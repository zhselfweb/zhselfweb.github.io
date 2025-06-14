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
let isShuffle = false;
let isRepeat = false;
let isLiked = false;
let totalDuration = 120; // 預設總時長

// 初始化歌詞
async function initLyrics() {
    try {
        const response = await fetch('lyrics.json');
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
    } catch (error) {
        console.error('Error loading lyrics:', error);
    }
}

// 初始化音頻上下文
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // 創建音頻元素
        const audioElement = new Audio('TNT时代少年团 X 优酸乳《Lemon》认人歌词版 CN／PIN／ENG｜嚼柠檬主题曲中文版 - TNT时代少年团 MiniBoom.mp3');
        audioSource = audioContext.createMediaElementSource(audioElement);
        
        // 連接音頻節點
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // 設置初始進度條位置
        currentTime = 0;
        updateProgressBar();
        
        // 創建音頻可視化條
        const visualizer = document.getElementById('visualizer');
        visualizer.innerHTML = ''; // 清空現有內容
        const barCount = 32; // 可視化條的數量
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            visualizer.appendChild(bar);
        }
        
        // 設置音頻事件
        audioElement.addEventListener('timeupdate', () => {
            currentTime = audioElement.currentTime;
            updateProgressBar();
            highlightCurrentLyric();
        });
        
        // 設置音頻結束事件
        audioElement.addEventListener('ended', () => {
            if (isRepeat) {
                audioElement.currentTime = 0;
                audioElement.play();
            } else {
                resetPlayback();
            }
        });
        
        // 更新總時長
        audioElement.addEventListener('loadedmetadata', () => {
            totalDuration = audioElement.duration;
            const totalMinutes = Math.floor(totalDuration / 60);
            const totalSeconds = Math.floor(totalDuration % 60);
            document.getElementById('totalTime').textContent = 
                `${totalMinutes}:${totalSeconds < 10 ? '0' + totalSeconds : totalSeconds}`;
        });
        
        // 保存音頻元素引用
        window.audioElement = audioElement;
        
        // 開始更新可視化
        updateVisualizer();
    } catch (error) {
        console.error('Error initializing audio:', error);
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

function togglePlayback() {
    if (!audioContext) {
        initAudio();
    }
    
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        window.audioElement.play();
        startPlayback();
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        window.audioElement.pause();
        stopPlayback();
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

// 高亮當前歌詞
function highlightCurrentLyric() {
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
            
            // 滾動到當前歌詞
            line.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else {
            line.classList.remove('active');
        }
    });
}

// 進度條點擊事件
const progressContainer = document.getElementById('progressContainer');

progressContainer.addEventListener('click', (e) => {
    if (!window.audioElement) return;
    
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * totalDuration;
    
    window.audioElement.currentTime = newTime;
    currentTime = newTime;
    updateProgressBar();
    highlightCurrentLyric();
});

// 音量控制
const volumeBar = document.getElementById('volumeBar');
const volumeLevel = document.getElementById('volumeLevel');

volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newVolume = Math.max(0, Math.min(100, (offsetX / barWidth) * 100));
    
    volumeLevel.style.width = `${newVolume}%`;
    if (audioSource) {
        audioSource.gain.setValueAtTime(newVolume / 200, audioContext.currentTime);
    }
});

// 隨機播放和重複播放
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

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
                console.error('Error playing audio:', error);
            });
        }
        
        updateProgressBar();
        highlightCurrentLyric();
    }
});

// 初始化
initLyrics();
initAudio();
highlightCurrentLyric();
updateVisualizer(); 