document.getElementById('modal').style.display = 'none';


// 綁定“進入網站”按鈕的點擊事件
document.getElementById('enter-button').addEventListener('click', function() {
    // 顯示自定義的模態視窗
    document.getElementById('modal').style.display = 'flex';
});

// 綁定“確認進入”按鈕的點擊事件
document.getElementById('confirm-button').addEventListener('click', function() {
    // 確認進入網站
    window.location.href = 'https://www.books.com.tw/products/CN10094106?srsltid=AfmBOorBEsii9z0x7frzqPwW6W82JiTIRx_4Gnm2uR5wnWlHrSWqtfou'; 
});

// 綁定“退出”按鈕的點擊事件
document.getElementById('cancel-button').addEventListener('click', function() {
    window.location.href = 'https://mammy.hpa.gov.tw/Home/NewsKBContent?id=2403&type=01';
});
