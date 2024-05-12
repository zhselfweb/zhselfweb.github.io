const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const adjustedCanvas = document.getElementById('adjustedCanvas');
const controlsContainer = document.getElementById('controlsContainer');
const downloadButton = document.getElementById('downloadButton');
const transparencySlider = document.getElementById('transparencySlider');
const transparencyValueInput = document.getElementById('transparencyValue');
const darkModeToggle = document.getElementById('darkModeToggle');

let originalImage;

imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.src = e.target.result;
        originalImage.onload = function() {
            previewImage.src = originalImage.src;
            previewImage.style.display = 'inline-block';
            adjustedCanvas.style.display = 'none';
            previewContainer.style.display = 'block';
            controlsContainer.style.display = 'block';
            downloadButton.style.display = 'inline-block';
            drawImageWithTransparency(100); // Draw with full opacity initially
        }
    }
    reader.readAsDataURL(file);
});

transparencySlider.addEventListener('input', function() {
    const transparency = this.value;
    transparencyValueInput.value = transparency;
    drawImageWithTransparency(transparency);
});

transparencyValueInput.addEventListener('input', function() {
    let transparency = parseInt(this.value);
    if (transparency < 0) {
        transparency = 0;
    } else if (transparency > 100) {
        transparency = 100;
    }
    transparencySlider.value = transparency;
    drawImageWithTransparency(transparency);
});

function drawImageWithTransparency(transparency) {
    const ctx = adjustedCanvas.getContext('2d');
    adjustedCanvas.width = originalImage.width;
    adjustedCanvas.height = originalImage.height;

    // Clear canvas
    ctx.clearRect(0, 0, adjustedCanvas.width, adjustedCanvas.height);

    // Draw original image
    ctx.globalAlpha = transparency / 100;
    ctx.drawImage(originalImage, 0, 0, adjustedCanvas.width, adjustedCanvas.height);

    adjustedCanvas.style.display = 'inline-block';
}

downloadButton.addEventListener('click', function() {
    if (!originalImage) {
        alert('Please upload an image first.');
        return;
    }
    const image = adjustedCanvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'adjusted_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});