const imageInput = document.getElementById('image-input');
const radiusInput = document.getElementById('radius-input');
const radiusValue = document.getElementById('radius-value');
const canvas = document.getElementById('canvas');
const downloadBtn = document.getElementById('download-btn');
const ctx = canvas.getContext('2d');
let image = new Image();
const MAX_WIDTH = 500; // 定義圖片最大寬度
const MAX_HEIGHT = 500; // 定義圖片最大高度

imageInput.addEventListener('change', handleImageUpload);
radiusInput.addEventListener('input', updateRoundedCorners);
downloadBtn.addEventListener('click', downloadImage);

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
        image.onload = function() {
            const dimensions = getAdjustedDimensions(image.width, image.height);
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            updateRoundedCorners();
            canvas.style.display = 'block';
            downloadBtn.style.display = 'inline-block';
        };
    };
    reader.readAsDataURL(file);
}

function getAdjustedDimensions(width, height) {
    const aspectRatio = width / height;
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
            width = MAX_WIDTH;
            height = width / aspectRatio;
        } else {
            height = MAX_HEIGHT;
            width = height * aspectRatio;
        }
    }
    return { width, height };
}

function updateRoundedCorners() {
    const radius = parseInt(radiusInput.value);
    radiusValue.textContent = radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'rounded-image.png';
    link.click();
}