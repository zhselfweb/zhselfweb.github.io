$(document).ready(function () {
    // 當文件準備好後，綁定各種按鈕和輸入事件
    $('#toggleButton').click(togglePosition); // 綁定切換位置的按鈕
    $('#clearButton').click(clearSearchInput); // 綁定清除搜尋輸入的按鈕
    $('#back-to-top-btn').click(scrollToTop); // 綁定回到頂端按鈕
    $('#playVideoButton').click(playVideo); // 綁定播放影片按鈕
    $('#searchInput').on('input', debounce(searchSongs, 300)); // 綁定搜尋輸入框的輸入事件，並添加防抖功能

    loadSongs(); // 載入歌曲列表
});

function togglePosition() {
    // 切換播放器和邊框容器的位置
    var playerWrapper = $('#playerWrapper');
    var borderContainer = $('.border-container');
    var newPosition = (playerWrapper.css('position') === 'fixed') ? 'absolute' : 'fixed';

    playerWrapper.css('position', newPosition);
    borderContainer.css('position', newPosition);
}

function clearSearchInput() {
    // 清空搜尋輸入框並重新搜尋
    $('#searchInput').val('');
    searchSongs('');
}

function scrollToTop() {
    // 平滑滾動回到頂端
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function playVideo() {
    // 播放 YouTube 或 Bilibili 影片
    var url = $('#videoURL').val(); // 取得使用者輸入的影片連結
    var videoInfo = getVideoInfo(url); // 從連結中提取影片資訊
    if (videoInfo) {
        // 根據影片資訊生成嵌入的 iframe
        var embedUrl = '';
        if (videoInfo.platform === 'YouTube') {
            embedUrl = 'https://www.youtube.com/embed/' + videoInfo.id + '?autoplay=1';
        } else if (videoInfo.platform === 'Bilibili') {
            embedUrl = 'https://player.bilibili.com/player.html?bvid=' + videoInfo.id + (videoInfo.time ? '&t=' + videoInfo.time : '') + '&autoplay=1&high_quality=1&danmaku=0';
        }
        $('#player').html('<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>').addClass('show');
    } else {
        // 如果影片連結無效，提示使用者輸入有效的連結
        alert('請輸入有效的 YouTube 或 Bilibili 影片連結！');
    }
}

function getVideoInfo(url) {
    // 從 YouTube 或 Bilibili 連結中提取影片資訊
    var youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|live\/|watch\?v=|&v=)([^#\&\?]*).*/;
    var bilibiliRegExp = /^.*bilibili\.com\/video\/(BV[\w]+)\/?.*/;
    var timeRegExp = /[?&]t=(\d+)/;

    var youtubeMatch = url.match(youtubeRegExp);
    var bilibiliMatch = url.match(bilibiliRegExp);
    var timeMatch = url.match(timeRegExp);

    if (youtubeMatch && youtubeMatch[2].length === 11) {
        return { platform: 'YouTube', id: youtubeMatch[2] };
    } else if (bilibiliMatch && bilibiliMatch[1]) {
        return { platform: 'Bilibili', id: bilibiliMatch[1], time: timeMatch ? timeMatch[1] : null };
    } else {
        return null;
    }
}


function loadSongs() {
    // 從 songs.json 載入歌曲並添加到表格中
    $.getJSON('songs.json', function (data) {
        data.forEach(song => {
            addSongToTable(song.name, song.link);
        });
    });
}

function addSongToTable(songName, songLink) {
    // 將歌曲添加到表格中，並為每首歌添加複製連結和播放影片的按鈕
    var row = '<tr><td><a href="' + songLink + '" target="_blank">' + songName + '</a></td>' +
        '<td><button onclick="copyLink(\'' + songLink + '\')">複製連結</button></td>' +
        '<td><button onclick="playSong(\'' + songLink + '\')">播放影片</button></td></tr>';
    $('#songList').append(row);
}

function copyLink(link) {
    // 複製歌曲連結到剪貼簿
    var dummy = $('<textarea>').val(link).appendTo('body').select();
    document.execCommand('copy');
    dummy.remove();
}

function playSong(songLink) {
    // 播放指定的 YouTube 或 Bilibili 歌曲影片
    var videoInfo = getVideoInfo(songLink);
    if (videoInfo) {
        var embedUrl = '';
        if (videoInfo.platform === 'YouTube') {
            embedUrl = 'https://www.youtube.com/embed/' + videoInfo.id + '?autoplay=1';
        } else if (videoInfo.platform === 'Bilibili') {
            embedUrl = 'https://player.bilibili.com/player.html?bvid=' + videoInfo.id + (videoInfo.time ? '&t=' + videoInfo.time : '') + '&autoplay=1&high_quality=1&danmaku=0';
        }
        $('#player').html('<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allowfullscreen></iframe>').addClass('show');
    } else {
        alert('請輸入有效的 YouTube 或 Bilibili 影片連結！');
    }
}

function searchSongs() {
    // 搜尋歌曲並篩選表格中的結果
    var keyword = $('#searchInput').val().trim().toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, '');
    $('#songList tr').each(function () {
        var songName = $(this).find('td').first().text().toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, '');
        $(this).toggle(songName.includes(keyword));
    });
}

function debounce(func, wait) {
    // 防抖函數，避免頻繁觸發搜尋事件
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}
