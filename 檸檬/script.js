// 初始化粒子背景
particlesJS("particles-js", {
    particles: {
        number: { 
            value: 50,
            density: { 
                enable: true, 
                value_area: 1000 
            }
        },
        color: { 
            value: ["#FFD700", "#1DB954", "#ffffff"]
        },
        shape: { 
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            }
        },
        opacity: {
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#FFD700",
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "grab"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 140,
                line_linked: {
                    opacity: 0.5
                }
            },
            push: {
                particles_nb: 4
            }
        }
    },
    retina_detect: true
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

// 載入狀態控制
function showLoading(message = '載入中...') {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        // 生成 0.5 到 1.5 秒的隨機時間
        const randomTime = Math.random() * 1000 + 500; // 500ms 到 1500ms
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (!overlay.classList.contains('active')) {
                    overlay.remove();
                }
            }, 150);
        }, randomTime);
    }
}

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
        showLoading('載入歌詞中...');
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

        hideLoading();
    } catch (error) {
        hideLoading();
        handleError(error, '載入歌詞');
    }
}

// 修改高亮當前歌詞的函數
function highlightCurrentLyric() {
    if (isUserScrolling) return;

    const lyricsContainer = document.getElementById('lyricsContainer');
    const lyricLines = document.querySelectorAll('.lyric-line');
    let currentActive = null;
    
    // 使用 requestAnimationFrame 來優化滾動性能
    requestAnimationFrame(() => {
        for (let i = 0; i < lyricLines.length; i++) {
            const lineTime = parseFloat(lyricLines[i].dataset.time);
            const lineText = lyricLines[i].textContent;
       
            if (lineText === "--") continue;
            
            if (currentTime >= lineTime) {
                if (i === lyricLines.length - 1 || currentTime < parseFloat(lyricLines[i+1].dataset.time)) {
                    currentActive = i;
                    break;
                }
            }
        }
        
        lyricLines.forEach((line, index) => {
            if (index === currentActive && line.textContent !== "間奏") {
                line.classList.add('active');
                
                if (!isUserScrolling) {
                    const containerHeight = lyricsContainer.clientHeight;
                    const lineTop = line.offsetTop;
                    const lineHeight = line.clientHeight;
                    const scrollPosition = lineTop - (containerHeight / 2) + (lineHeight / 2);
                    
                    // 恢復平滑滾動效果
                    lyricsContainer.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                line.classList.remove('active');
            }
        });
    });
}

// 初始化音頻上下文
async function initAudio() {
    try {
        showLoading('初始化音頻...');
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // 檢查音頻上下文狀態
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        if (!analyser) {
            analyser = audioContext.createAnalyser();
            // 增加頻率分析器的精度
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
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

        hideLoading();
    } catch (error) {
        hideLoading();
        handleError(error, '音頻初始化');
    }
}

// 更新音頻可視化
function updateVisualizer() {
    if (!analyser) return;
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    const bars = document.querySelectorAll('.bar');
    const barCount = bars.length;
    
    // 使用 requestAnimationFrame 的時間戳來創建平滑的動畫
    const now = performance.now();
    
    bars.forEach((bar, index) => {
        // 使用正弦函數來創建更自然的波動效果
        const waveOffset = Math.sin(now * 0.001 + index * 0.1) * 5;
        
        // 獲取頻率數據並應用平滑過渡
        const value = dataArray[index];
        const height = Math.max(5, (value / 255) * 100 + waveOffset);
        
        // 應用平滑過渡
        const currentHeight = parseFloat(bar.style.height) || 0;
        const newHeight = currentHeight + (height - currentHeight) * 0.3;
        
        bar.style.height = `${newHeight}%`;
        
        // 根據頻率強度調整顏色
        const hue = (value / 255) * 60 + 120; // 從綠色到黃色的漸變
        const saturation = 70 + (value / 255) * 30; // 70% 到 100% 的飽和度
        const lightness = 50 + (value / 255) * 10; // 50% 到 60% 的亮度
        
        bar.style.background = `linear-gradient(to top, 
            hsl(${hue}, ${saturation}%, ${lightness}%), 
            hsl(${hue + 20}, ${saturation}%, ${lightness + 10}%)
        )`;
    });
    
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

// 鍵盤快捷鍵控制
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 如果正在輸入文字，不觸發快捷鍵
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.code) {
            case 'Space':
                e.preventDefault(); // 防止頁面滾動
                togglePlayback();
                break;
            
            case 'ArrowLeft':
                e.preventDefault();
                if (window.audioElement) {
                    const newTime = Math.max(0, window.audioElement.currentTime - 5);
                    window.audioElement.currentTime = newTime;
                    currentTime = newTime;
                    updateProgressBar();
                }
                break;
            
            case 'ArrowRight':
                e.preventDefault();
                if (window.audioElement) {
                    const newTime = Math.min(totalDuration, window.audioElement.currentTime + 5);
                    window.audioElement.currentTime = newTime;
                    currentTime = newTime;
                    updateProgressBar();
                }
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                if (window.audioElement) {
                    const newVolume = Math.min(1, window.audioElement.volume + 0.1);
                    window.audioElement.volume = newVolume;
                    const volumeLevel = document.getElementById('volumeLevel');
                    if (volumeLevel) {
                        volumeLevel.style.width = `${newVolume * 100}%`;
                    }
                }
                break;
            
            case 'ArrowDown':
                e.preventDefault();
                if (window.audioElement) {
                    const newVolume = Math.max(0, window.audioElement.volume - 0.1);
                    window.audioElement.volume = newVolume;
                    const volumeLevel = document.getElementById('volumeLevel');
                    if (volumeLevel) {
                        volumeLevel.style.width = `${newVolume * 100}%`;
                    }
                }
                break;
            
            case 'Escape':
                // 關閉版本紀錄彈出視窗
                const versionModal = document.getElementById('versionModal');
                if (versionModal && versionModal.style.display === 'block') {
                    versionModal.style.display = 'none';
                }
                break;
            
            case 'KeyM':
                // 靜音/取消靜音
                if (window.audioElement) {
                    window.audioElement.muted = !window.audioElement.muted;
                    const volumeIcon = document.querySelector('.volume-container i');
                    if (volumeIcon) {
                        volumeIcon.className = window.audioElement.muted ? 
                            'fas fa-volume-mute' : 'fas fa-volume-up';
                    }
                }
                break;
        }
    });
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

// 在初始化時添加快捷鍵支持
document.addEventListener('DOMContentLoaded', () => {
    initKeyboardShortcuts();
    // ... 其他初始化代碼 ...
}); 