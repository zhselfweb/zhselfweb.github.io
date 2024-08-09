document.addEventListener('paste', function(event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                const container = document.getElementById('imageContainer');
                container.innerHTML = ''; // 清空容器
                container.appendChild(img);
                
                const downloadBtn = document.getElementById('downloadBtn');
                downloadBtn.disabled = false;
                downloadBtn.onclick = function() {
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.download = 'pasted-image.png';
                    link.click();
                };
            };
            reader.readAsDataURL(file);
            break; // 只處理第一個圖像
        }
    }
});
