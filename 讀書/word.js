let fontSize = 20; // 初始字体大小

function decreaseFontSize() {
    if (fontSize > 5) {
        fontSize -= 2; // 减小字体大小
        applyFontSize();
    }
}

function increaseFontSize() {
    if (fontSize < 40) {
        fontSize += 2; // 增大字体大小
        applyFontSize();
    }
}

function applyFontSize() {
    const novelPages = document.getElementsByClassName('novelPage');
    for (let i = 0; i < novelPages.length; i++) {
        novelPages[i].style.fontSize = fontSize + 'px'; // 应用新的字体大小
    }
}