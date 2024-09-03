document.getElementById('enter-button').style.display = 'none';
document.getElementById('lod-f').style.display = 'none';


const loadingText = document.getElementById("loading");
const foundText = document.getElementById("found");

// 設置載入動畫效果
let dotCount = 0;
const loadingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4; // 控制點數在0到3之間循環
    loadingText.textContent = "找尋線路中" + ".".repeat(dotCount); 
}, 500); // 每500毫秒更新一次文字

// 設置隨機時間在3到5秒之間
const randomDelay = Math.floor(Math.random() * 7000) + 3000; // 3000到10000毫秒之間

// 在隨機時間後顯示 "已找到線路."
setTimeout(() => {
    clearInterval(loadingInterval); // 停止載入動畫
    loadingText.style.display = "none"; // 隱藏載入文字
    document.getElementById('lod-in').style.display = 'none';
    document.getElementById('lod-f').style.display = 'flex';
    foundText.style.display = "block"; // 顯示已找到線路文字
    document.getElementById('enter-button').style.display = 'flex';


    
}, randomDelay);
