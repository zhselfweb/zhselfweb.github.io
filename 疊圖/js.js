// 主要元素引用
const container = document.getElementById('container');
const previewList = document.getElementById('preview-list');
const offsetControl = document.getElementById('offset-control');
const offsetValue = document.getElementById('offset-value');
const downloadBtn = document.getElementById('download-btn');
const fileInput = document.getElementById('file-input');

// 全局状态
let images = [];
let currentOffset = 0;

// 初始化应用
function initApp() {
    console.log('初始化应用...');
    
    // 初始化排序功能
    Sortable.create(previewList, {
        animation: 150,
        handle: '.layer-handle',
        onStart: function(evt) {
            console.log('开始拖拽:', evt.oldIndex);
        },
        onEnd: function(evt) {
            console.log('结束拖拽, 从', evt.oldIndex, '到', evt.newIndex);
            updateLayersOrder();
        }
    });

    // 绑定事件监听器
    fileInput.addEventListener('change', handleFileUpload);
    offsetControl.addEventListener('input', handleOffsetChange);
    downloadBtn.addEventListener('click', handleDownload);
    
    // 初始显示滑块值
    updateOffsetDisplay();
    console.log('应用初始化完成');
}

// 文件上传处理
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // 处理每个文件
    files.forEach((file, index) => {
        // 验证是否为图片
        if (!file.type.startsWith('image/')) {
            console.warn('跳过非图片文件:', file.name);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            createImageLayer(event.target.result, Date.now() + index);
        };
        reader.onerror = () => {
            console.error('读取文件失败:', file.name);
        };
        reader.readAsDataURL(file);
    });
}

// 创建图层 - 添加可见性控制
function createImageLayer(src, id) {
    const img = new Image();
    img.src = src;
    img.className = 'draggable-img';
    
    // 确保 ID 是字符串类型
    const layerId = String(id);
    img.dataset.id = layerId;

    img.onload = () => {
        // 创建图层项目，添加可见性控制按钮
        const listItem = document.createElement('li');
        listItem.className = 'layer-item';
        listItem.innerHTML = `
            <div class="layer-handle"></div>
            <span>圖層 ${images.length + 1}</span>
            <button class="visibility-toggle" aria-label="切換可見性">👁️</button>
        `;
        listItem.dataset.id = layerId;
        
        // 为可见性按钮添加事件
        const visibilityBtn = listItem.querySelector('.visibility-toggle');
        visibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡
            toggleLayerVisibility(layerId);
        });
        
        previewList.appendChild(listItem);

        // 存储图片信息，确保 ID 保持一致
        images.push({
            id: layerId, // 存储为字符串
            element: img,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            visible: true // 默认可见
        });

        container.appendChild(img);
        
        // 更新UI
        updateLayersOrder();
    };
    
    img.onerror = () => {
        console.error('图片加载失败');
    };
}

// 切换图层可见性
function toggleLayerVisibility(id) {
    const imgIndex = images.findIndex(img => img.id === id);
    if (imgIndex === -1) return;
    
    // 切换可见性
    images[imgIndex].visible = !images[imgIndex].visible;
    
    // 更新DOM
    const img = images[imgIndex].element;
    img.style.display = images[imgIndex].visible ? 'block' : 'none';
    
    // 更新图层列表中的视觉反馈
    const layerItem = Array.from(previewList.children).find(li => li.dataset.id === id);
    if (layerItem) {
        const visibilityBtn = layerItem.querySelector('.visibility-toggle');
        if (visibilityBtn) {
            visibilityBtn.textContent = images[imgIndex].visible ? '👁️' : '👁️‍🗨️';
            visibilityBtn.style.opacity = images[imgIndex].visible ? 1 : 0.5;
        }
    }
    
    console.log(`图层 ${id} 可见性已切换为: ${images[imgIndex].visible}`);
}

// 偏移量控制
function handleOffsetChange(e) {
    currentOffset = parseInt(e.target.value);
    updateOffsetDisplay();
    applyImageLayout();
}

// 更新偏移量显示
function updateOffsetDisplay() {
    offsetValue.textContent = currentOffset;
}

// 更新图层顺序
function updateLayersOrder() {
    // 获取新的顺序
    const newOrder = Array.from(previewList.children)
        .map(li => li.dataset.id);
    
    console.log('排序前:', images.map(img => img.id));
    console.log('新顺序:', newOrder);
    
    // 重要修复：确保类型匹配进行比较
    // 问题在于 dataset.id 是字符串，而我们可能存储的是数字
    images.sort((a, b) => {
        const indexA = newOrder.indexOf(String(a.id));
        const indexB = newOrder.indexOf(String(b.id));
        return indexA - indexB;
    });
    
    console.log('排序后:', images.map(img => img.id));
    
    // 手动更新 DOM 顺序，确保图片在容器中的顺序也被更新
    container.innerHTML = ''; // 清空容器
    images.forEach((img, index) => {
        // 重新添加图片到容器，确保 DOM 中的顺序正确
        container.appendChild(img.element);
    });
    
    // 重新应用布局和调整 z-index
    applyImageLayout();
    
    console.log('图层顺序已更新:', newOrder);
}

// 应用布局
function applyImageLayout() {
    if (images.length === 0) return;
    
    let maxHeight = 0;
    
    console.log('应用布局，当前图层顺序:', images.map(img => img.id));
    
    // 使用 forEach 而不是 map，因为我们不需要返回值
    images.forEach((img, index) => {
        // 计算缩放比例
        const scale = Math.min(
            container.offsetWidth / img.originalWidth,
            600 / img.originalHeight
        ) * 0.8;

        const width = img.originalWidth * scale;
        const height = img.originalHeight * scale;
        const offset = currentOffset * index;

        img.scaledWidth = width;
        img.scaledHeight = height;
        
        const bottomPosition = offset + height;
        if (bottomPosition > maxHeight) {
            maxHeight = bottomPosition;
        }

        // z-index 从最大值开始递减，确保排序正确
        const zIndex = images.length - index;
        
        // 显示调试信息，检查是否正确应用
        console.log(`应用样式 - 图层 ${index}:`, img.id, 'z-index:', zIndex, 'visible:', img.visible || true);
        
        // 直接设置样式，确保每个属性都被设置
        img.element.style.width = `${width}px`;
        img.element.style.height = `${height}px`;
        img.element.style.top = `${offset}px`;
        img.element.style.left = `${(container.offsetWidth - width) / 2}px`;
        img.element.style.position = 'absolute';
        img.element.style.zIndex = zIndex;
        
        // 应用可见性状态
        if (img.visible === false) {
            img.element.style.display = 'none';
        } else {
            img.element.style.display = 'block';
        }
    });
    
    // 设置容器高度
    container.style.height = `${maxHeight + 50}px`;
}

// 下载功能
async function handleDownload() {
    if (images.length === 0) {
        alert('沒有圖片可供下載');
        return;
    }

    try {
        // 创建画布
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 计算画布尺寸 - 使用容器的当前高度或计算高度
        const maxBottom = Math.max(...images.map((img, index) => 
            currentOffset * index + img.scaledHeight
        ));

        canvas.width = container.offsetWidth;
        canvas.height = maxBottom + 50; // 添加一些底部边距

        // 确保所有图片加载完毕
        await Promise.all(images.map(img =>
            new Promise(resolve => {
                if (img.element.complete) resolve();
                else img.element.onload = resolve;
            })
        ));

        // 清除背景 (透明)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 使用反转顺序，先绘制底层，再依序叠加上层
        images.slice().reverse().forEach((img, indexReversed) => {
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

        // 生成下载链接
        const link = document.createElement('a');
        link.download = `疊圖-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('下載圖片時發生錯誤:', error);
        alert('下載失敗，請重試');
    }
}

// 窗口大小调整处理
function handleResize() {
    applyImageLayout();
}

// 添加窗口大小变化监听
window.addEventListener('resize', debounce(handleResize, 250));

// Debounce 函数，避免频繁调用
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);
