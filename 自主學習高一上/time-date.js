function nowdate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();

    var formattedDate = year + '-' + month + '-' + day;


    var currentDateElement = document.getElementById('currentDate');
    currentDateElement.textContent = formattedDate;
}
setInterval(nowdate, 1000);

function toggleFullScreen() {
    var button = document.getElementById('fullscreen-button');
    var navElement = document.querySelector('nav');
    var footerElement = document.querySelector('footer');
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        button.classList.add('hidden'); // 隱藏按鈕
        navElement.classList.add('hidden'); // 隱藏 nav 元素
        footerElement.classList.add('hidden'); // 隱藏 footer 元素
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

document.addEventListener('fullscreenchange', function() {
    var button = document.getElementById('fullscreen-button');
    var navElement = document.querySelector('nav');
    var footerElement = document.querySelector('footer');
    if (!document.fullscreenElement) {
        button.classList.remove('hidden'); // 退出全螢幕後顯示按鈕
        navElement.classList.remove('hidden'); // 退出全螢幕後顯示 nav 元素
        footerElement.classList.remove('hidden'); // 退出全螢幕後顯示 footer 元素
    }
});



var hiddenCursorDiv = document.getElementById('hiddenCursor');

hiddenCursorDiv.addEventListener('mousemove', function() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // 如果在全螢幕模式下，隱藏鼠標
        hiddenCursorDiv.style.cursor = 'none';
    } else {
        // 如果不在全螢幕模式下，顯示鼠標
        hiddenCursorDiv.style.cursor = 'auto';
    }
});