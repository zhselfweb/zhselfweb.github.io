document.getElementById('modal').style.display = 'none';


// 綁定“進入網站”按鈕的點擊事件
document.getElementById('enter-button').addEventListener('click', function() {
    // 顯示自定義的模態視窗
    document.getElementById('modal').style.display = 'flex';
});

// 綁定“確認進入”按鈕的點擊事件
document.getElementById('confirm-button').addEventListener('click', function() {
    // 確認進入網站
    window.location.href = 'https://www.ttpc.mohw.gov.tw/public/news/handouts/a10e228ea3cc7856680920a38dd79f3a.pdf'; 
});

// 綁定“退出”按鈕的點擊事件
document.getElementById('cancel-button').addEventListener('click', function() {
    window.location.href = 'https://mammy.hpa.gov.tw/Home/NewsKBContent?id=2403&type=01';
});
