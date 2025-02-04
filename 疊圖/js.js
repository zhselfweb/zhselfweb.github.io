const container = document.getElementById('container');
let images = [];
let currentOffset = 0;

// 初始化排序功能
Sortable.create(document.getElementById('preview-list'), {
    animation: 150,
    handle: '.layer-handle',
    onEnd: updateLayersOrder
});

// 文件上传处理
document.getElementById('file-input').addEventListener('change', function (e) {
    Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.className = 'draggable-img';
            img.dataset.id = Date.now() + index;

            img.onload = () => {
                const listItem = document.createElement('li');
                listItem.className = 'layer-item';
                listItem.innerHTML = `
                    <div class="layer-handle"></div>
                    <span>圖層 ${images.length + 1}</span>
                `;
                listItem.dataset.id = img.dataset.id;
                document.getElementById('preview-list').appendChild(listItem);

                images.push({
                    id: img.dataset.id,
                    element: img,
                    originalWidth: img.naturalWidth,
                    originalHeight: img.naturalHeight
                });

                updateLayersOrder();
                applyImageLayout();
            };

            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

// 偏移量控制
document.getElementById('offset-control').addEventListener('input', function (e) {
    currentOffset = parseInt(e.target.value);
    applyImageLayout();
});

// 更新图层顺序
function updateLayersOrder() {
    const newOrder = Array.from(document.getElementById('preview-list').children)
        .map(li => li.dataset.id);

    images.sort((a, b) =>
        newOrder.indexOf(a.id) - newOrder.indexOf(b.id)
    );

    applyImageLayout();
}

// 應用布局
function applyImageLayout() {
images.forEach((img, index) => {
const scale = Math.min(
    container.offsetWidth / img.originalWidth,
    container.offsetHeight / img.originalHeight
);

const width = img.originalWidth * scale;
const height = img.originalHeight * scale;
const offset = currentOffset * index;

// 記錄計算後的寬高，供下載時使用
img.scaledWidth = width;
img.scaledHeight = height;

Object.assign(img.element.style, {
    width: `${width}px`,
    height: `${height}px`,
    top: `${offset}px`,
    left: `${(container.offsetWidth - width) / 2}px`,
    position: 'absolute',
    zIndex: images.length - index  // z-index 根據排序調整
});
});
}
// 下載功能：反轉繪製順序，先繪製底層再繪製上層
document.getElementById('download-btn').addEventListener('click', async function () {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 計算 canvas 高度
const maxBottom = Math.max(...images.map((img, index) =>
currentOffset * index + img.scaledHeight
));

canvas.width = container.offsetWidth;
canvas.height = maxBottom;

// 確保所有圖片載入完畢
await Promise.all(images.map(img =>
new Promise(resolve => {
    if (img.element.complete) resolve();
    else img.element.onload = resolve;
})
));

// 清除背景 (透明)
ctx.clearRect(0, 0, canvas.width, canvas.height);

// 使用反轉順序，先繪製底層，再依序疊加上層
images.slice().reverse().forEach((img, indexReversed) => {
// 計算原本的 index，若需要根據 currentOffset 計算高度，可如下：
// 注意：此處 offset 需要對應原始排序中該圖的位置
const originalIndex = images.length - 1 - indexReversed;
const offset = currentOffset * originalIndex;

ctx.drawImage(
    img.element,
    (canvas.width - img.scaledWidth) / 2,
    offset,
    img.scaledWidth,
    img.scaledHeight
);
});

// 產生下載連結
const link = document.createElement('a');
link.download = `疊圖-${Date.now()}.png`;
link.href = canvas.toDataURL();
link.click();
});
