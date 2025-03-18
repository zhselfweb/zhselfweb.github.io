// 獲取DOM元素
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const radiusSlider = document.getElementById('radius-slider');
const radiusValue = document.getElementById('radius-value');
const previewCanvas = document.getElementById('preview-canvas');
const placeholder = document.getElementById('placeholder');
const downloadBtn = document.getElementById('download-btn');

// 設置canvas繪圖上下文
const ctx = previewCanvas.getContext('2d');

// 儲存原始圖片資訊
let originalImage = null;
let imageWidth = 0;
let imageHeight = 0;

// 添加一個變量保存原始檔名
let originalFileName = '';

// 監聽上傳按鈕點擊事件
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// 監聽檔案選擇事件
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('image')) {
        // 保存原始檔名（去掉副檔名）
        originalFileName = file.name.replace(/\.[^/.]+$/, "");
        
        const reader = new FileReader();

        reader.onload = (event) => {
            originalImage = new Image();
            originalImage.onload = () => {
                // 調整圖片大小，最大寬高為500像素，保持原比例
                const maxDimension = 500;
                if (originalImage.width > maxDimension || originalImage.height > maxDimension) {
                    if (originalImage.width > originalImage.height) {
                        imageWidth = maxDimension;
                        imageHeight = (originalImage.height / originalImage.width) * maxDimension;
                    } else {
                        imageHeight = maxDimension;
                        imageWidth = (originalImage.width / originalImage.height) * maxDimension;
                    }
                } else {
                    imageWidth = originalImage.width;
                    imageHeight = originalImage.height;
                }

                // 設置canvas大小
                previewCanvas.width = imageWidth;
                previewCanvas.height = imageHeight;

                // 隱藏提示文字，顯示canvas和下載按鈕
                placeholder.style.display = 'none';
                previewCanvas.style.display = 'block';
                downloadBtn.style.display = 'block';

                // 繪製圖片
                drawImageWithRadius(parseInt(radiusSlider.value));
            };
            originalImage.src = event.target.result;
        };

        reader.readAsDataURL(file);
    }
});

// 監聽滑動條變化事件
radiusSlider.addEventListener('input', () => {
    const radius = parseInt(radiusSlider.value);
    radiusValue.textContent = `${radius}px`;

    if (originalImage) {
        drawImageWithRadius(radius);
    }
});

// 繪製帶圓角的圖片
function drawImageWithRadius(radius) {
    // 清除canvas
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // 保存畫布狀態
    ctx.save();

    // 確保圓角半徑不超過圖片寬高的一半
    const maxRadius = Math.min(imageWidth, imageHeight) / 2;
    const actualRadius = Math.min(radius, maxRadius);

    // 創建圓角路徑
    ctx.beginPath();
    ctx.moveTo(actualRadius, 0);
    ctx.lineTo(imageWidth - actualRadius, 0);
    ctx.quadraticCurveTo(imageWidth, 0, imageWidth, actualRadius);
    ctx.lineTo(imageWidth, imageHeight - actualRadius);
    ctx.quadraticCurveTo(imageWidth, imageHeight, imageWidth - actualRadius, imageHeight);
    ctx.lineTo(actualRadius, imageHeight);
    ctx.quadraticCurveTo(0, imageHeight, 0, imageHeight - actualRadius);
    ctx.lineTo(0, actualRadius);
    ctx.quadraticCurveTo(0, 0, actualRadius, 0);
    ctx.closePath();

    // 裁剪區域
    ctx.clip();

    // 繪製圖片
    ctx.drawImage(originalImage, 0, 0, imageWidth, imageHeight);

    // 恢復畫布狀態
    ctx.restore();
}

// 監聽下載按鈕點擊事件
downloadBtn.addEventListener('click', () => {
    // 創建一個臨時連結
    const link = document.createElement('a');
    // 使用原始檔名+0作為下載檔名
    link.download = originalFileName ? `${originalFileName}0.png` : '圓角圖片.png';
    link.href = previewCanvas.toDataURL('image/png');
    link.click();
});
