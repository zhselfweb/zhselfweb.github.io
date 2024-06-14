let searchTimer;

// 搜尋YouTube影片
document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchYouTube, 500);
});

// 搜尋YouTube播放清單
document.getElementById('playlistInput').addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchPlaylist, 500);
});

function searchYouTube() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (!searchQuery) {
        clearResults('resultTable');
        return;
    }
    const apiKey = 'AIzaSyD0-Hyy39jPom80dvrwLT4IrPgm4LA7ESU';

    fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&part=snippet&type=video`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items, 'resultTable'); // Pass the table ID here
        })
        .catch(error => {
            console.error('搜尋錯誤：', error);
        });
}

function displayResults(videos, tableId) {
    const tableBody = document.getElementById(tableId);

    if (!videos || videos.length === 0) {
        console.log('沒有找到相關影片');
        return;
    }

    videos.forEach(video => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        const urlCell = document.createElement('td');
        const copyButtonCell = document.createElement('td');
        const copyButton = document.createElement('button');

        titleCell.textContent = video.snippet.title;
        urlCell.textContent = `https://www.youtube.com/watch?v=${video.id.videoId}`;

        copyButton.textContent = '複製';
        copyButton.onclick = function() {
            copyURL(`https://www.youtube.com/watch?v=${video.id.videoId}`);
        };

        row.appendChild(titleCell);
        row.appendChild(urlCell);
        copyButtonCell.appendChild(copyButton);
        row.appendChild(copyButtonCell);
        tableBody.appendChild(row);
    });
}

function copyURL(url) {
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('已複製到剪貼簿！');
        })
        .catch(err => {
            console.error('無法複製：', err);
        });
}

function searchPlaylist() {
    const playlistUrl = document.getElementById('playlistInput').value.trim();
    if (!playlistUrl) {
        clearResults('playlistTable');
        return;
    }
    const playlistId = getPlaylistId(playlistUrl);
    if (playlistId) {
        fetchPlaylistItems(playlistId, 'playlistTable'); // Pass the table ID here
    } else {
        alert('請輸入有效的YouTube撥放清單網址！');
    }
}

function getPlaylistId(playlistUrl) {
    const playlistIdRegex = /list=([A-Za-z0-9_-]+)/;
    const match = playlistUrl.match(playlistIdRegex);
    return match ? match[1] : null;
}

function clearResults(tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
}

function fetchPlaylistItems(playlistId, tableId, pageToken = '') {
    const apiKey = 'AIzaSyA3yipqUhlCWbr4IdD8SIiYUgbo1XyK6Ng';
    const maxResults = 50;

    let url = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${apiKey}&part=snippet&maxResults=${maxResults}`;
    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.items || data.items.length === 0) {
                console.log('沒有找到播放清單項目');
                return;
            }
            displayPlaylistItems(data.items, tableId); // Pass the table ID here
        })
        .catch(error => {
            console.error('搜尋錯誤：', error);
        });
}

function displayPlaylistItems(items, tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';

    items.forEach(item => {
        const video = item.snippet;
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        const urlCell = document.createElement('td');
        const copyButtonCell = document.createElement('td');
        const copyButton = document.createElement('button');

        titleCell.textContent = video.title;
        urlCell.textContent = `https://www.youtube.com/watch?v=${video.resourceId.videoId}`;

        copyButton.textContent = '複製';
        copyButton.onclick = function() {
            copyURL(`https://www.youtube.com/watch?v=${video.resourceId.videoId}`);
        };

        row.appendChild(titleCell);
        row.appendChild(urlCell);
        copyButtonCell.appendChild(copyButton);
        row.appendChild(copyButtonCell);
        tableBody.appendChild(row);
    });
}