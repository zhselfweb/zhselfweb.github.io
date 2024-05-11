let margin;

// 根据窗口宽度设置初始 margin 值
if (window.innerWidth >= 768) {
    margin = 100; // 在大屏幕上设置初始 margin 值为 20px
} else {
    margin = 30; // 在小屏幕上设置初始 margin 值为 10px
}

// 函数：减小 margin
function demar() {
    if (margin > 5) {
        margin -= 5; // 减小 margin
        apmar();
    }
}

// 函数：增大 margin
function inmar() {
    if (margin <= 100) {
        margin += 5; // 增大 margin
        apmar();
    }
}

// 函数：应用新的 margin
function apmar() {
    const novelPages = document.getElementsByClassName('novelPage');
    for (let i = 0; i < novelPages.length; i++) {
        novelPages[i].style.margin = margin + 'px'; // 应用新的 margin 值
    }
}

// 监听窗口大小变化事件
window.addEventListener('resize', function() {
    // 根据窗口宽度设置 margin 值
    if (window.innerWidth >= 768) {
        margin = 100; // 在大屏幕上设置 margin 值为 20px
    } else {
        margin = 30; // 在小屏幕上设置 margin 值为 10px
    }
    apmar(); // 应用新的 margin 值
});