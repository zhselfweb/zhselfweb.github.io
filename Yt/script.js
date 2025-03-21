// localStorage 獲取 API Key
let API_KEY = localStorage.getItem('youtube_api_key');

// 如果没有API Key，跳回g設置
if (!API_KEY) {
    window.location.href = 'index.html';
}

document.getElementById('analyzeBtn').addEventListener('click', fetchVideoData);

async function fetchVideoData() {
    const urlInput = document.getElementById('urlInput').value;
    const resultCard = document.getElementById('resultCard');
    const loading = document.getElementById('loading');
    const header = document.querySelector('h1'); 


    header.textContent = '分析中...';
    loading.style.display = 'block';
    resultCard.style.opacity = '0';

    try {
        const videoId = extractVideoId(urlInput);
        if (!videoId) throw new Error('無效的YouTube網址');

        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const apiUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`;

        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        const data = await response.json();
        const stats = JSON.parse(data.contents);

        const videoInfo = await getVideoInfo(videoId);
        showResult({ ...stats, ...videoInfo });
        header.textContent = '₍ ˃ᯅ˂）分析出來了~';

    } catch (error) {
        resultCard.innerHTML = `<div class="error">錯誤：${error.message}</div>`;
    } finally {
        loading.style.display = 'none';
    }
}



async function getVideoInfo(videoId) {
    // 使用前再次檢查API Key存在否
    if (!API_KEY) {
        throw new Error('YouTube API Key 未設置，請返回首頁設置');
    }
    
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${API_KEY}`
    );
    const data = await response.json();
    
    // 檢查API是否反回錯誤
    if (data.error) {
        if (data.error.errors && data.error.errors[0].reason === 'keyInvalid') {
            // API Key無效，引導重新設置
            localStorage.removeItem('youtube_api_key');
            alert('API Key 無效，請重新設置');
            window.location.href = 'index.html';
            throw new Error('無效的 API Key');
        }
        throw new Error(data.error.message || '獲取影片資訊失敗');
    }
    
    const item = data.items[0];
    
    return {
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        viewCount: parseInt(item.statistics.viewCount),
        duration: formatDuration(item.contentDetails.duration),
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
    };
}

function showResult(data) {
    const resultCard = document.getElementById('resultCard');
    resultCard.innerHTML = `
        <img src="https://img.youtube.com/vi/${data.id}/maxresdefault.jpg" class="thumbnail" alt="影片縮圖">
        <h2>${data.title}</h2>
        <div class="stats-grid">
            <div class="stat-item">
                <div>正讚數</div>
                <div class="stat-value">${numberWithCommas(data.likes)}</div>
            </div>
            <div class="stat-item">
                <div>倒讚數</div>
                <div class="stat-value">${numberWithCommas(data.dislikes)}</div>
            </div>
            <div class="stat-item">
                <div>觀看次數</div>
                <div class="stat-value">${numberWithCommas(data.viewCount)}</div>
            </div>
            <div class="stat-item">
                <div>頻道名稱</div>
                <div class="stat-value">${data.channel}</div>
            </div>
            <div class="stat-item">
                <div>發布時間</div>
                <div class="stat-value">${data.publishedAt}</div>
            </div>
            <div class="stat-item">
                <div>影片長度</div>
                <div class="stat-value">${data.duration}</div>
            </div>
        </div>
    `;
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDuration(duration) {
    const matches = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    const seconds = parseInt(matches[3]) || 0;
    
    return [hours, minutes, seconds]
        .map(unit => unit.toString().padStart(2, '0'))
        .join(':')
        .replace(/^00:/, '');
}