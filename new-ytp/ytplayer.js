$(document).ready(function() {
    $('#toggleButton').click(togglePosition);
    $('#clearButton').click(clearSearchInput);
    $('#back-to-top-btn').click(scrollToTop);
    $('#playVideoButton').click(playVideo);
    $('#searchInput').on('input', debounce(searchSongs, 300));

    loadSongs();
});

function togglePosition() {
    var playerWrapper = $('#playerWrapper');
    var borderContainer = $('.border-container');
    var newPosition = (playerWrapper.css('position') === 'fixed') ? 'absolute' : 'fixed';

    playerWrapper.css('position', newPosition);
    borderContainer.css('position', newPosition);
}

function clearSearchInput() {
    $('#searchInput').val('');
    searchSongs('');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function playVideo() {
    var url = $('#videoURL').val();
    var videoId = getYouTubeID(url);
    if (videoId) {
        $('#player').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>').addClass('show');
    } else {
        alert('請輸入有效的 YouTube 影片或直播連結！');
    }
}

function getYouTubeID(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|live\/|watch\?v=|&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function loadSongs() {
    $.getJSON('songs.json', function(data) {
        data.forEach(song => {
            addSongToTable(song.name, song.link);
        });
    });

}

function addSongToTable(songName, songLink) {
    var row = '<tr><td><a href="' + songLink + '" target="_blank">' + songName + '</a></td>' +
              '<td><button onclick="copyLink(\'' + songLink + '\')">複製連結</button></td>' +
              '<td><button onclick="playSong(\'' + songLink + '\')">播放影片</button></td></tr>';
    $('#songList').append(row);
}

function copyLink(link) {
    var dummy = $('<textarea>').val(link).appendTo('body').select();
    document.execCommand('copy');
    dummy.remove();
}

function playSong(songLink) {
    var songId = getYouTubeID(songLink);
    $('#player').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + songId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>').addClass('show');
}

function searchSongs() {
    var keyword = $('#searchInput').val().trim().toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, '');
    $('#songList tr').each(function() {
        var songName = $(this).find('td').first().text().toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, '');
        $(this).toggle(songName.includes(keyword));
    });
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}


// 播放模式控制
$('#playbackMode').change(function() {
    var mode = $(this).val();
    switch (mode) {
        case 'repeat':
            player.setLoop(true);
            break;
        case 'shuffle':
            // 實現隨機播放功能
            break;
        default:
            player.setLoop(false);
            break;
    }
});



$('#searchInput').on('input', debounce(searchSongs, 300));


