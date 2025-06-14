// 初始化粒子背景
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#1DB954" },
        shape: { type: "circle" },
        opacity: { value: 0.2, random: true },
        size: { value: 3, random: true },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" },
            resize: true
        }
    }
});

// 音頻上下文和分析器
let audioContext;
let analyser;
let audioSource;
let audioBuffer;
let isPlaying = false;
let startTime = 0;
let currentTime = 0;
let isLoop = false;  // 改為循環狀態
let isRepeat = false;
let isLiked = false;
let totalDuration = 120; // 預設總時長
// 添加手動滾動控制變數
let isUserScrolling = false;
let userScrollTimeout;

// 錯誤處理函數
function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    // 創建錯誤訊息元素
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${context} 發生錯誤：${error.message}</span>
            <button class="error-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    // 添加到頁面
    document.body.appendChild(errorMessage);
    
    // 自動移除錯誤訊息
    setTimeout(() => {
        errorMessage.classList.add('fade-out');
        setTimeout(() => errorMessage.remove(), 500);
    }, 5000);
    
    // 關閉按鈕事件
    errorMessage.querySelector('.error-close').addEventListener('click', () => {
        errorMessage.classList.add('fade-out');
        setTimeout(() => errorMessage.remove(), 500);
    });
}


// 初始化歌詞
async function initLyrics() {
    try {
        const response = await fetch('lyrics.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 更新歌曲信息
        document.querySelector('.song-title').textContent = data.title;
        document.querySelector('.song-artist').textContent = data.artist;
        totalDuration = data.duration;
        
        // 更新總時長顯示
        const totalMinutes = Math.floor(totalDuration / 60);
        const totalSeconds = Math.floor(totalDuration % 60);
        document.getElementById('totalTime').textContent = 
            `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
        
        // 添加歌詞
        const lyricsContainer = document.getElementById('lyricsContainer');
        lyricsContainer.innerHTML = ''; // 清空現有歌詞
        
        data.lyrics.forEach(lyric => {
            const lyricLine = document.createElement('div');
            lyricLine.className = 'lyric-line';
            lyricLine.dataset.time = lyric.time;
            lyricLine.textContent = lyric.text;
            lyricsContainer.appendChild(lyricLine);
        });

        // 添加滾動事件監聽
        lyricsContainer.addEventListener('wheel', (e) => {
            isUserScrolling = true;
            clearTimeout(userScrollTimeout);
            userScrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 1500);
        });

        lyricsContainer.addEventListener('touchstart', () => {
            isUserScrolling = true;
            clearTimeout(userScrollTimeout);
        });

        lyricsContainer.addEventListener('touchmove', () => {
            isUserScrolling = true;
            clearTimeout(userScrollTimeout);
        });

        lyricsContainer.addEventListener('touchend', () => {
            userScrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 1500);
        });
    } catch (error) {
        handleError(error, '載入歌詞');
    }
}
// 修改高亮當前歌詞的函數
function highlightCurrentLyric() {
    // 如果使用者正在滑動，不進行定位
    if (isUserScrolling) return;

    const lyricsContainer = document.getElementById('lyricsContainer');
    const lyricLines = document.querySelectorAll('.lyric-line');
    let currentActive = null;
    
    // 找到當前應高亮的歌詞
    for (let i = 0; i < lyricLines.length; i++) {
        const lineTime = parseFloat(lyricLines[i].dataset.time);
        const lineText = lyricLines[i].textContent;
   
        // 跳過間奏
        if (lineText === "--") continue;
        
        // 如果當前時間大於歌詞時間點，且不是最後一句
        if (currentTime >= lineTime) {
            if (i === lyricLines.length - 1 || currentTime < parseFloat(lyricLines[i+1].dataset.time)) {
                currentActive = i;
                break;
            }
        }
    }
    
    // 更新歌詞高亮
    lyricLines.forEach((line, index) => {
        if (index === currentActive && line.textContent !== "間奏") {
            line.classList.add('active');
            
            // 只有在非使用者滑動時才進行滾動
            if (!isUserScrolling) {
                // 計算滾動位置
                const containerHeight = lyricsContainer.clientHeight;
                const lineTop = line.offsetTop;
                const lineHeight = line.clientHeight;
                const scrollPosition = lineTop - (containerHeight / 2) + (lineHeight / 2);
                
                // 使用 scrollTo 而不是 scrollIntoView，這樣只會滾動歌詞容器
                lyricsContainer.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            line.classList.remove('active');
        }
    });
}



// 初始化音頻上下文
async function initAudio() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // 檢查音頻上下文狀態
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        if (!analyser) {
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
        }
        
        // 創建音頻元素
        if (!window.audioElement) {
            window.audioElement = new Audio('./lemon.mp3');
            
            // 添加錯誤處理
            window.audioElement.addEventListener('error', (e) => {
                let errorMessage = '音頻載入失敗';
                switch (e.target.error.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMessage = '音頻載入被中止';
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMessage = '網路錯誤導致音頻載入失敗';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMessage = '音頻格式不支援或檔案損壞';
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = '不支援的音頻格式';
                        break;
                }
                handleError(new Error(errorMessage), '音頻載入');
            });

            // 設置音頻播放權限
            window.audioElement.muted = false;
            window.audioElement.playsInline = true;
            window.audioElement.volume = 0.5;
            
            try {
                audioSource = audioContext.createMediaElementSource(window.audioElement);
                audioSource.connect(analyser);
                analyser.connect(audioContext.destination);
            } catch (error) {
                if (error.name === 'InvalidStateError') {
                    handleError(new Error('音頻節點已經被連接到其他音頻上下文'), '音頻初始化');
                } else {
                    throw error;
                }
            }
        }
        
        // 設置音量條初始位置
        const volumeLevel = document.getElementById('volumeLevel');
        if (volumeLevel) {
            volumeLevel.style.width = '50%';
        }
        
        // 設置初始進度條位置
        currentTime = 0;
        updateProgressBar();
        
        // 創建音頻可視化條
        const visualizer = document.getElementById('visualizer');
        if (visualizer) {
            visualizer.innerHTML = '';
            const barCount = 32;
            
            for (let i = 0; i < barCount; i++) {
                const bar = document.createElement('div');
                bar.className = 'bar';
                visualizer.appendChild(bar);
            }
        }
        
        // 設置音頻事件
        window.audioElement.addEventListener('timeupdate', () => {
            currentTime = window.audioElement.currentTime;
            updateProgressBar();
            highlightCurrentLyric();
        });
        
        // 設置音頻結束事件
        window.audioElement.addEventListener('ended', () => {
            if (isLoop) {
                window.audioElement.currentTime = 0;
                window.audioElement.play().catch(error => {
                    handleError(error, '循環播放');
                });
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                isPlaying = true;
            } else if (isRepeat) {
                window.audioElement.currentTime = 0;
                window.audioElement.play().catch(error => {
                    handleError(error, '重複播放');
                });
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                isPlaying = true;
            } else {
                resetPlayback();
            }
        });
        
        // 更新總時長
        window.audioElement.addEventListener('loadedmetadata', () => {
            totalDuration = window.audioElement.duration;
            const totalMinutes = Math.floor(totalDuration / 60);
            const totalSeconds = Math.floor(totalDuration % 60);
            const totalTimeDisplay = document.getElementById('totalTime');
            if (totalTimeDisplay) {
                totalTimeDisplay.textContent = 
                    `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
            }
        });
        
        // 開始更新可視化
        updateVisualizer();
    } catch (error) {
        handleError(error, '初始化音頻');
    }
}

// 更新音頻可視化
function updateVisualizer() {
    if (!analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    const bars = document.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        const value = dataArray[index];
        const height = (value / 255) * 100;
        bar.style.height = `${height}%`;
    });
    
    // 持續更新可視化，不受播放狀態影響
    requestAnimationFrame(updateVisualizer);
}

// 播放按鈕事件
const playButton = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');

playButton.addEventListener('click', togglePlayback);

async function togglePlayback() {
    try {
        if (!audioContext || !window.audioElement) {
            await initAudio();
        }
        
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            await window.audioElement.play();
            startPlayback();
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            window.audioElement.pause();
            stopPlayback();
        }
    } catch (error) {
        handleError(error, '切換播放狀態');
    }
}

// 開始播放
function startPlayback() {
    if (!audioContext) {
        initAudio();
    }
    
    startTime = audioContext.currentTime - currentTime;
    requestAnimationFrame(updatePlayback);
}

// 停止播放
function stopPlayback() {
    isPlaying = false;
}

// 更新播放進度
function updatePlayback() {
    if (!isPlaying) return;
    
    if (window.audioElement) {
        currentTime = window.audioElement.currentTime;
    } else {
        currentTime = audioContext.currentTime - startTime;
    }
    
    updateProgressBar();
    highlightCurrentLyric();
    
    if (currentTime >= totalDuration) {
        if (isRepeat) {
            resetPlayback();
            startPlayback();
        } else {
            resetPlayback();
        }
    } else {
        requestAnimationFrame(updatePlayback);
    }
}

// 重置播放
function resetPlayback() {
    stopPlayback();
    currentTime = 0;
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    if (audioSource) {
        audioSource.gain.setValueAtTime(0, audioContext.currentTime);
    }
    updateProgressBar();
    highlightCurrentLyric();
}

// 更新進度條
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = (currentTime / totalDuration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // 更新時間顯示
    const currentTimeDisplay = document.getElementById('currentTime');
    const totalTimeDisplay = document.getElementById('totalTime');
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = Math.floor(totalDuration % 60);
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
}

// 音量控制
const volumeBar = document.getElementById('volumeBar');
const volumeLevel = document.getElementById('volumeLevel');

volumeBar.addEventListener('click', (e) => {
    if (!window.audioElement) return;
    
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newVolume = Math.max(0, Math.min(1, offsetX / barWidth));
    
    // 更新音量條顯示
    volumeLevel.style.width = `${newVolume * 100}%`;
    
    // 設置音頻元素音量
    window.audioElement.volume = newVolume;
});

// 循環按鈕事件
const loopBtn = document.getElementById('shuffleBtn');
// 修改按鈕的初始圖標為循環圖標
const loopIcon = loopBtn.querySelector('i');
loopIcon.classList.remove('fa-random');
loopIcon.classList.add('fa-sync');

loopBtn.addEventListener('click', () => {
    isLoop = !isLoop;
    loopBtn.classList.toggle('active', isLoop);
});

// 重複播放按鈕事件
const repeatBtn = document.getElementById('repeatBtn');
repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
    
    // 重置播放位置到開始
    if (window.audioElement) {
        window.audioElement.currentTime = 0;
        currentTime = 0;
        updateProgressBar();
        highlightCurrentLyric();
    }
});

// 愛心按鈕
const heartBtn = document.querySelector('.control-btn .fa-heart').parentElement;
heartBtn.addEventListener('click', () => {
    isLiked = !isLiked;
    heartBtn.classList.toggle('active', isLiked);
});

// 歌詞點擊事件
const lyricsContainer = document.getElementById('lyricsContainer');
lyricsContainer.addEventListener('click', (e) => {
    const lyricLine = e.target.closest('.lyric-line');
    if (lyricLine && window.audioElement) {
        const time = parseFloat(lyricLine.dataset.time);
        window.audioElement.currentTime = time;
        currentTime = time;
        
        // 如果正在播放，確保音頻繼續播放
        if (isPlaying) {
            window.audioElement.play().catch(error => {
                handleError(error, '點擊歌詞播放');
            });
        }
        
        updateProgressBar();
        highlightCurrentLyric();
    }
});

// 進度條拖曳功能
const progressContainer = document.getElementById('progressContainer');

progressContainer.addEventListener('click', (e) => {
    if (!window.audioElement) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newTime = (offsetX / barWidth) * totalDuration;
    
    // 更新音頻時間
    window.audioElement.currentTime = newTime;
    currentTime = newTime;
    updateProgressBar();
    highlightCurrentLyric();
});

// 添加拖曳功能
let isDragging = false;

progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleProgressDrag(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        handleProgressDrag(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// 處理拖曳事件
function handleProgressDrag(e) {
    if (!window.audioElement) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const barWidth = rect.width;
    const newTime = (offsetX / barWidth) * totalDuration;
    
    // 更新音頻時間
    window.audioElement.currentTime = newTime;
    currentTime = newTime;
    updateProgressBar();
    highlightCurrentLyric();
}

// 初始化
initLyrics();
initAudio();
highlightCurrentLyric();
updateVisualizer(); 



// 版本紀錄功能
document.addEventListener('DOMContentLoaded', function() {
    const versionBtn = document.getElementById('versionBtn');
    const versionModal = document.getElementById('versionModal');
    const closeBtn = document.querySelector('.close-btn');

    // 點擊版本按鈕顯示彈出視窗
    versionBtn.addEventListener('click', function() {
        versionModal.style.display = 'block';
    });

    // 點擊關閉按鈕隱藏彈出視窗
    closeBtn.addEventListener('click', function() {
        versionModal.style.display = 'none';
    });

    // 點擊彈出視窗外部區域隱藏彈出視窗
    window.addEventListener('click', function(event) {
        if (event.target === versionModal) {
            versionModal.style.display = 'none';
        }
    });
}); 