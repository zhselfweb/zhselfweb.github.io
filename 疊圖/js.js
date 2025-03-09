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

    // 显示加载指示器
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = '正在生成圖片...';
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;z-index:9999;';
    document.body.appendChild(loadingMsg);

    try {
        // 筛选出可见的图片，保持原始顺序
        const visibleImages = images.filter(img => img.visible !== false);
        
        if (visibleImages.length === 0) {
            alert('沒有可見的圖片可供下載');
            return;
        }

        // 创建画布
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 导出比例
        const exportScale = 2;
        
        // 计算每个可见图片的信息
        const imageDataList = [];
        
        // 重要：从0开始重新计算偏移量，忽略隐藏的图片
        visibleImages.forEach((img, visibleIndex) => {
            // 使用与预览完全相同的缩放逻辑
            const scale = Math.min(
                container.offsetWidth / img.originalWidth,
                600 / img.originalHeight
            ) * 0.8;
            
            // 计算预览尺寸
            const width = img.originalWidth * scale;
            const height = img.originalHeight * scale;
            
            // 关键修改：使用可见图片的索引计算偏移，而不是原始索引
            const offset = currentOffset * visibleIndex;
            
            // 保存数据
            imageDataList.push({
                img: img,
                originalIndex: images.indexOf(img), // 保留原始索引用于调试
                visibleIndex: visibleIndex, // 在可见图片中的索引
                previewWidth: width,
                previewHeight: height,
                previewOffset: offset,
                bottom: offset + height  // 记录底部位置
            });
        });
        
        // 寻找最后一张图片（底部位置最低的图片）
        const lastImage = imageDataList.reduce((prev, current) => {
            return (current.bottom > prev.bottom) ? current : prev;
        }, imageDataList[0]);
        
        // 使用第一张可见图片的宽度作为基准
        const firstVisibleImg = visibleImages[0];
        const firstImgScale = Math.min(
            container.offsetWidth / firstVisibleImg.originalWidth,
            600 / firstVisibleImg.originalHeight
        ) * 0.8;
        const firstImgWidth = firstVisibleImg.originalWidth * firstImgScale;
        
        // 设置画布尺寸
        canvas.width = firstImgWidth * exportScale;
        canvas.height = lastImage.bottom * exportScale;  // 精确匹配最低点
        
        console.log(`画布尺寸: ${canvas.width} x ${canvas.height}`);
        console.log(`最底部图层：${lastImage.img.id}, 底部位置: ${lastImage.bottom}`);
        console.log(`可见图片数量: ${visibleImages.length}, 总图片数量: ${images.length}`);
        
        // 确保所有图片加载完毕
        await Promise.all(visibleImages.map(img =>
            new Promise(resolve => {
                if (img.element.complete) resolve();
                else img.element.onload = resolve;
            })
        ));

        // 清除背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 按从底到顶的顺序绘制
        imageDataList.slice().reverse().forEach(data => {
            // 计算导出尺寸和位置
            const exportWidth = data.previewWidth * exportScale;
            const exportHeight = data.previewHeight * exportScale;
            const exportOffset = data.previewOffset * exportScale;
            const exportX = (canvas.width - exportWidth) / 2;
            
            console.log(`绘制图层 ${data.img.id}: 原始索引=${data.originalIndex}, 可见索引=${data.visibleIndex}`);
            console.log(`位置(${exportX}, ${exportOffset}), 尺寸${exportWidth}x${exportHeight}`);
            
            // 绘制图片
            ctx.drawImage(
                data.img.element,
                exportX, exportOffset,
                exportWidth, exportHeight
            );
        });

        // 生成下载链接
        const link = document.createElement('a');
        link.download = `疊圖-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
    } catch (error) {
        console.error('下載圖片時發生錯誤:', error);
        console.error(error.stack);
        alert('下載失敗，請重試');
    } finally {
        // 移除加载指示器
        document.body.removeChild(loadingMsg);
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
