        // 主題切換功能
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        
        let currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    
        themeToggle.addEventListener('click', () => {
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                currentTheme = 'dark';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                currentTheme = 'light';
            }
            localStorage.setItem('theme', currentTheme);
            createParticles(); // 主題變更時更新粒子效果
        });
    
        // 搜尋功能相關元素
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const resultContainer = document.getElementById('result-container');
        const errorMessage = document.getElementById('error-message');
        const backBtn = document.getElementById('back-btn');
        
        // 影片元素
        const videos = [
            document.getElementById('video-1'),
            document.getElementById('video-2'),
            document.getElementById('video-3')
        ];
        
        // 影片標題
        const videoTitle = document.getElementById('video-title');
        
        // 影片標題列表
        const videoTitles = [
            "屎王的傳奇故事",
            "屎王的輝煌成就",
            "屎王的精彩時刻"
        ];
        
        // 目前活動的影片索引
        let activeVideoIndex = 0;
        
        // 進度條元素
        const progressBar = document.getElementById('progress-bar');
    
        // 切換影片函數
        function switchVideo(index) {
            // 隱藏所有影片並暫停播放
            videos.forEach(video => {
                video.classList.remove('active');
                video.pause();
            });
            
            // 顯示選擇的影片
            videos[index].classList.add('active');
            
            // 更新影片導航點
            document.querySelectorAll('.video-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // 更新影片選擇按鈕
            document.querySelectorAll('.video-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
            
            // 更新標題並添加動畫效果
            videoTitle.textContent = videoTitles[index];
            videoTitle.classList.remove('active');
            setTimeout(() => {
                videoTitle.classList.add('active');
            }, 50);
            
            // 播放新影片
            videos[index].play();
            
            // 更新當前影片索引
            activeVideoIndex = index;
            
            // 重置進度條
            progressBar.style.width = '0%';
        }
        
        // 上一個影片按鈕
        document.getElementById('prev-video').addEventListener('click', () => {
            let newIndex = activeVideoIndex - 1;
            if (newIndex < 0) newIndex = videos.length - 1;
            switchVideo(newIndex);
        });
        
        // 下一個影片按鈕
        document.getElementById('next-video').addEventListener('click', () => {
            let newIndex = activeVideoIndex + 1;
            if (newIndex >= videos.length) newIndex = 0;
            switchVideo(newIndex);
        });
        
        // 影片導航點點擊事件
        document.querySelectorAll('.video-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                switchVideo(index);
            });
        });
        
        // 影片選擇按鈕點擊事件
        document.querySelectorAll('.video-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                switchVideo(index);
            });
        });
    
        // 搜尋按鈕點擊事件
        searchBtn.addEventListener('click', performSearch);
        
        // 鍵盤事件：按下 Enter 鍵觸發搜尋
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 執行搜尋的函數
        function performSearch() {
            const query = searchInput.value.trim().toLowerCase();
            const validQueries = ['屎王', '屎', '拉屎', '炸屎', '糞便', '便便', '臭臭', '屎尿', '黃金', '屎皇', '屎帝', '屎尊', '屎聖', '屎霸', '屎主', '屎君', '軟屎', '硬屎', '水屎', '臭屎', '黑屎', '黃屎', '綠屎', '熱屎', '冰屎', '噴屎', '丟屎', '炸屎', '甩屎', '踩屎', '吞屎', '滾屎', '屎之巔', '屎中之王', '屎界傳奇', '萬屎之祖', 'han', '遊覽車', '畢旅', '傳奇', '吳鴻瀚', '吳鴻翰'];

            if (validQueries.includes(query)) {
                // 搜尋成功
                errorMessage.style.display = 'none';
                resultContainer.classList.add('active');
                switchVideo(0); // 預設顯示第一個影片
                
                // 滾動到結果區
                setTimeout(() => {
                    resultContainer.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                // 搜尋失敗
                errorMessage.style.display = 'block';
                resultContainer.classList.remove('active');
                
                // 錯誤訊息動畫
                errorMessage.style.animation = 'none';
                setTimeout(() => {
                    errorMessage.style.animation = 'shake 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                }, 10);
            }
        }


        
        
        // 返回按鈕事件
        backBtn.addEventListener('click', () => {
            resultContainer.classList.remove('active');
            videos.forEach(video => {
                video.pause(); // 暫停所有影片
            });
            searchInput.value = ''; // 清空搜尋欄
            
            // 滾動回頂部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    
        // 粒子背景效果
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const colors = currentTheme === 'light' 
                ? ['#6c5ce7', '#a29bfe', '#fd79a8', '#00cec9', '#81ecec']
                : ['#9c88ff', '#8c7ae6', '#ff6b81', '#00cec9', '#81ecec'];
            
            particlesContainer.innerHTML = '';
            
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                const size = Math.random() * 20 + 5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = color;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                
                particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // 初始化粒子效果
        createParticles();
    
        // 更新進度條
        videos.forEach(video => {
            video.addEventListener('timeupdate', () => {
                if (video.classList.contains('active')) {
                    const percent = (video.currentTime / video.duration) * 100;
                    progressBar.style.width = `${percent}%`;
                }
            });
        });

        const playPauseBtn = document.getElementById('play-pause');

playPauseBtn.addEventListener('click', () => {
    const activeVideo = videos[activeVideoIndex];
    if (activeVideo.paused) {
        activeVideo.play();
        playPauseBtn.querySelector('i').classList.remove('fa-play');
        playPauseBtn.querySelector('i').classList.add('fa-pause');
    } else {
        activeVideo.pause();
        playPauseBtn.querySelector('i').classList.remove('fa-pause');
        playPauseBtn.querySelector('i').classList.add('fa-play');
    }
});

// 動態更新圖標
videos.forEach(video => {
    video.addEventListener('play', () => {
        if (video.classList.contains('active')) {
            playPauseBtn.querySelector('i').classList.remove('fa-play');
            playPauseBtn.querySelector('i').classList.add('fa-pause');
        }
    });
    video.addEventListener('pause', () => {
        if (video.classList.contains('active')) {
            playPauseBtn.querySelector('i').classList.remove('fa-pause');
            playPauseBtn.querySelector('i').classList.add('fa-play');
        }
    });
});

const muteUnmuteBtn = document.getElementById('mute-unmute');

muteUnmuteBtn.addEventListener('click', () => {
    const activeVideo = videos[activeVideoIndex];
    activeVideo.muted = !activeVideo.muted;
    if (activeVideo.muted) {
        muteUnmuteBtn.querySelector('i').classList.remove('fa-volume-up');
        muteUnmuteBtn.querySelector('i').classList.add('fa-volume-mute');
    } else {
        muteUnmuteBtn.querySelector('i').classList.remove('fa-volume-mute');
        muteUnmuteBtn.querySelector('i').classList.add('fa-volume-up');
    }
});

// 動態更新圖標
videos.forEach(video => {
    video.addEventListener('volumechange', () => {
        if (video.classList.contains('active')) {
            if (video.muted) {
                muteUnmuteBtn.querySelector('i').classList.remove('fa-volume-up');
                muteUnmuteBtn.querySelector('i').classList.add('fa-volume-mute');
            } else {
                muteUnmuteBtn.querySelector('i').classList.remove('fa-volume-mute');
                muteUnmuteBtn.querySelector('i').classList.add('fa-volume-up');
            }
        }
    });
});

const fullscreenBtn = document.getElementById('fullscreen');

// 全螢幕按鈕事件
fullscreenBtn.addEventListener('click', () => {
    const activeVideo = videos[activeVideoIndex];
    
    if (activeVideo.requestFullscreen) {
        activeVideo.requestFullscreen();
    } else if (activeVideo.mozRequestFullScreen) { // Firefox
        activeVideo.mozRequestFullScreen();
    } else if (activeVideo.webkitRequestFullscreen) { // Chrome, Safari, Opera
        activeVideo.webkitRequestFullscreen();
    } else if (activeVideo.msRequestFullscreen) { // IE/Edge
        activeVideo.msRequestFullscreen();
    }

    // 確保影片在全螢幕時按原比例顯示
    activeVideo.style.objectFit = 'contain'; // 使用contain來保持原比例
});

// 假如退出全螢幕時，恢復原始的object-fit設定
document.addEventListener('fullscreenchange', () => {
    const activeVideo = videos[activeVideoIndex];
    if (!document.fullscreenElement) { // 當退出全螢幕模式時
        activeVideo.style.objectFit = ''; // 重設為原來的設定
    }
});

