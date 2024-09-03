document.addEventListener("DOMContentLoaded", function () {
    // 圖片列表
    const images = ["bg.png", "bg2.png", "bg3.png", "bg4.png"]; // 將圖片的檔名放在這裡

    // 隨機選擇一張圖片
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // 動態設定背景圖片
    document.body.style.backgroundImage = `linear-gradient(135deg, #1d1f2ac4, #6f75759f), url('images/${randomImage}')`;
});