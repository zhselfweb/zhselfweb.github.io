// 主要 DOM 元素引用
const container = document.getElementById('container');
const dropZone = document.getElementById('drop-zone');
const previewList = document.getElementById('preview-list');
const offsetControl = document.getElementById('offset-control');
const offsetValue = document.getElementById('offset-value');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const fileInput = document.getElementById('file-input');
const layerCount = document.getElementById('layer-count');

// 全域狀態
let images = [];
let currentOffset = 0;

// 初始化應用
function initApp() {
    console.log('正在初始化疊圖工具...');
    
    // 初始化 Sortable 拖曳排序
    Sortable.create(previewList, {
        animation: 180,
        handle: '.layer-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function() {
            updateLayersOrder();
        }
    });

    // 綁定檔案上傳與拖放事件
    fileInput.addEventListener('change', handleFileInputChange);
    setupDragAndDrop();

    // 綁定控制項事件
    offsetControl.addEventListener('input', handleOffsetChange);
    downloadBtn.addEventListener('click', handleDownload);
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClearAll);
    }
    
    // 監聽視窗縮放
    window.addEventListener('resize', debounce(handleResize, 150));

    // 初始介面更新
    updateOffsetDisplay();
    updateUIState();
    console.log('疊圖工具初始化完成');
}

// 設置拖曳上傳
function setupDragAndDrop() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    container.addEventListener('dragover', () => {
        container.classList.add('drag-over');
    });

    ['dragleave', 'drop'].forEach(eventName => {
        container.addEventListener(eventName, () => {
            container.classList.remove('drag-over');
        });
    });

    container.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt ? Array.from(dt.files) : [];
        if (files.length > 0) {
            processFiles(files);
        }
    });
}

// 檔案選擇變更
function handleFileInputChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        processFiles(files);
    }
    // 重置 input 值，確保再次選擇相同檔案時也能正常觸發 change
    fileInput.value = '';
}

// 批次處理上傳檔案
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('請選擇有效的圖片檔案 (PNG, JPG, WebP 等)');
        return;
    }

    imageFiles.forEach((file, index) => {
        const objectUrl = URL.createObjectURL(file);
        const layerId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        createImageLayer(file, objectUrl, layerId);
    });
}

// 建立圖層物件與介面項目
function createImageLayer(file, objectUrl, id) {
    const img = new Image();
    img.src = objectUrl;
    img.className = 'draggable-img';
    img.dataset.id = id;

    img.onload = () => {
        // 建立列表項目
        const listItem = document.createElement('li');
        listItem.className = 'layer-item';
        listItem.dataset.id = id;

        listItem.innerHTML = `
            <div class="layer-handle" title="按住拖曳調整順序">☰</div>
            <img class="layer-thumb" src="${objectUrl}" alt="圖層預覽">
            <div class="layer-info">
                <span class="layer-title">圖層</span>
                <span class="layer-sub" title="${file.name}">${file.name} (${img.naturalWidth}×${img.naturalHeight})</span>
            </div>
            <div class="layer-actions">
                <button class="icon-btn visibility-toggle" title="顯示/隱藏圖層" aria-label="切換可見性">👁️</button>
                <button class="icon-btn delete-btn" title="刪除此圖層" aria-label="刪除圖層">🗑️</button>
            </div>
        `;

        // 綁定可見性按鈕
        const visibilityBtn = listItem.querySelector('.visibility-toggle');
        visibilityBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLayerVisibility(id);
        });

        // 綁定刪除按鈕
        const deleteBtn = listItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteLayer(id);
        });

        previewList.appendChild(listItem);

        // 加入圖層陣列
        images.push({
            id: id,
            file: file,
            objectUrl: objectUrl,
            element: img,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            visible: true
        });

        container.appendChild(img);

        // 更新排序與排版
        updateLayersOrder();
    };

    img.onerror = () => {
        console.error('圖片載入失敗:', file.name);
        URL.revokeObjectURL(objectUrl);
    };
}

// 刪除單一圖層
function deleteLayer(id) {
    const index = images.findIndex(item => item.id === id);
    if (index === -1) return;

    const layerData = images[index];

    // 釋放記憶體
    if (layerData.objectUrl) {
        URL.revokeObjectURL(layerData.objectUrl);
    }

    // 移除 DOM
    if (layerData.element && layerData.element.parentNode) {
        layerData.element.parentNode.removeChild(layerData.element);
    }

    const listItem = Array.from(previewList.children).find(li => li.dataset.id === id);
    if (listItem && listItem.parentNode) {
        listItem.parentNode.removeChild(listItem);
    }

    // 從陣列中移除
    images.splice(index, 1);

    // 更新圖層排版與序號
    updateLayersOrder();
}

// 清空所有圖層
function handleClearAll() {
    if (images.length === 0) return;
    
    if (!confirm('確定要清空所有圖層嗎？')) return;

    // 釋放所有 ObjectURL
    images.forEach(img => {
        if (img.objectUrl) {
            URL.revokeObjectURL(img.objectUrl);
        }
        if (img.element && img.element.parentNode) {
            img.element.parentNode.removeChild(img.element);
        }
    });

    images = [];
    previewList.innerHTML = '';
    
    // 重置偏移量
    currentOffset = 0;
    offsetControl.value = 0;
    updateOffsetDisplay();
    
    updateLayersOrder();
}

// 切換圖層可見性
function toggleLayerVisibility(id) {
    const imgData = images.find(img => img.id === id);
    if (!imgData) return;

    imgData.visible = !imgData.visible;

    // 更新 DOM 圖片顯示狀態
    imgData.element.style.display = imgData.visible ? 'block' : 'none';

    // 更新列表項目樣式
    const listItem = Array.from(previewList.children).find(li => li.dataset.id === id);
    if (listItem) {
        const visibilityBtn = listItem.querySelector('.visibility-toggle');
        if (visibilityBtn) {
            visibilityBtn.textContent = imgData.visible ? '👁️' : '🚫';
            visibilityBtn.title = imgData.visible ? '隱藏圖層' : '顯示圖層';
        }
        if (imgData.visible) {
            listItem.classList.remove('layer-hidden');
        } else {
            listItem.classList.add('layer-hidden');
        }
    }

    // 重新計算排版
    applyImageLayout();
}

// 偏移量滑塊變更
function handleOffsetChange(e) {
    currentOffset = parseInt(e.target.value, 10) || 0;
    updateOffsetDisplay();
    applyImageLayout();
}

// 更新偏移量標籤
function updateOffsetDisplay() {
    offsetValue.textContent = currentOffset;
}

// 更新圖層順序（包含列表重新命名與 DOM 疊加順序）
function updateLayersOrder() {
    const newOrderIds = Array.from(previewList.children).map(li => li.dataset.id);

    // 根據列表的新順序重排 images 陣列
    images.sort((a, b) => {
        const idxA = newOrderIds.indexOf(String(a.id));
        const idxB = newOrderIds.indexOf(String(b.id));
        return idxA - idxB;
    });

    // 更新列表文字標題（圖層 1 (最上層), 圖層 2, ...）
    Array.from(previewList.children).forEach((li, idx) => {
        const titleSpan = li.querySelector('.layer-title');
        if (titleSpan) {
            if (idx === 0) {
                titleSpan.textContent = `圖層 1 (最上層)`;
            } else if (idx === previewList.children.length - 1) {
                titleSpan.textContent = `圖層 ${idx + 1} (最底層)`;
            } else {
                titleSpan.textContent = `圖層 ${idx + 1}`;
            }
        }
    });

    // 重新排序 container 內的 DOM 節點
    images.forEach(img => {
        if (img.element.parentNode === container) {
            container.appendChild(img.element);
        }
    });

    // 更新介面狀態（空狀態與數量計數）
    updateUIState();

    // 重新應用版面排版
    applyImageLayout();
}

// 更新全域 UI 狀態
function updateUIState() {
    if (layerCount) {
        layerCount.textContent = images.length;
    }

    if (images.length === 0) {
        container.classList.remove('has-images');
        dropZone.classList.remove('hidden');
        container.style.height = '480px';
    } else {
        container.classList.add('has-images');
        dropZone.classList.add('hidden');
    }
}

// 應用預覽視圖版面排版
function applyImageLayout() {
    if (images.length === 0) return;

    const containerWidth = container.clientWidth || 860;
    const visibleImages = images.filter(img => img.visible !== false);

    if (visibleImages.length === 0) {
        container.style.height = '480px';
        return;
    }

    // 計算最大原始尺寸作為縮放基準
    const maxNaturalWidth = Math.max(...visibleImages.map(img => img.originalWidth));
    const maxNaturalHeight = Math.max(...visibleImages.map(img => img.originalHeight));

    // 計算預覽縮放比例
    const previewScale = Math.min(
        (containerWidth - 40) / maxNaturalWidth,
        500 / maxNaturalHeight
    );

    let maxBottom = 0;

    // 僅針對可見圖層依序計算向下位移
    visibleImages.forEach((img, visibleIdx) => {
        const width = img.originalWidth * previewScale;
        const height = img.originalHeight * previewScale;
        const topOffset = currentOffset * visibleIdx;
        const leftOffset = (containerWidth - width) / 2;

        // z-index 讓第 1 個圖層在最上方，後續圖層依次在下方
        const zIndex = 100 - visibleIdx;

        img.element.style.width = `${width}px`;
        img.element.style.height = `${height}px`;
        img.element.style.top = `${topOffset}px`;
        img.element.style.left = `${leftOffset}px`;
        img.element.style.zIndex = zIndex;
        img.element.style.display = 'block';

        const bottom = topOffset + height;
        if (bottom > maxBottom) {
            maxBottom = bottom;
        }
    });

    // 隱藏不可見圖層
    images.filter(img => img.visible === false).forEach(img => {
        img.element.style.display = 'none';
    });

    // 動態調整預覽容器高度
    container.style.height = `${Math.max(480, maxBottom + 40)}px`;
}

// 高解析度無損下載功能
async function handleDownload() {
    const visibleImages = images.filter(img => img.visible !== false);

    if (visibleImages.length === 0) {
        alert('請先上傳圖片且至少保留一個可見圖層');
        return;
    }

    // 顯示載入指示器
    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = '<div style="font-size:24px;margin-bottom:8px;">⏳</div>正在進行原圖高畫質合成輸出...';
    loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(18, 20, 26, 0.95);
        border: 1px solid #374151;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        color: #f3f4f6;
        padding: 24px 36px;
        border-radius: 12px;
        z-index: 99999;
        text-align: center;
        font-family: inherit;
        font-size: 15px;
    `;
    document.body.appendChild(loadingMsg);

    try {
        // 確保所有圖片完成載入
        await Promise.all(visibleImages.map(img => {
            if (img.element.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.element.onload = resolve;
                img.element.onerror = resolve;
            });
        }));

        // 1. 計算原圖座標系下的基準尺寸
        const maxNaturalWidth = Math.max(...visibleImages.map(img => img.originalWidth));
        const maxNaturalHeight = Math.max(...visibleImages.map(img => img.originalHeight));

        // 2. 獲取當前預覽縮放比例
        const containerWidth = container.clientWidth || 860;
        const previewScale = Math.min(
            (containerWidth - 40) / maxNaturalWidth,
            500 / maxNaturalHeight
        );

        // 3. 將網頁預覽的向下偏移量準確轉換為原圖自然座標系下的偏移量
        const naturalStepOffset = currentOffset / previewScale;

        // 4. 計算畫布所需完整長寬
        let maxCanvasHeight = 0;
        const renderList = visibleImages.map((img, visibleIdx) => {
            const naturalTop = naturalStepOffset * visibleIdx;
            const naturalLeft = (maxNaturalWidth - img.originalWidth) / 2;
            const bottom = naturalTop + img.originalHeight;
            if (bottom > maxCanvasHeight) {
                maxCanvasHeight = bottom;
            }

            return {
                element: img.element,
                x: naturalLeft,
                y: naturalTop,
                width: img.originalWidth,
                height: img.originalHeight,
                visibleIdx: visibleIdx
            };
        });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(maxNaturalWidth);
        canvas.height = Math.round(maxCanvasHeight);

        const ctx = canvas.getContext('2d');
        
        // 開啟最高畫質圖片插值平滑處理
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 5. 依圖層順序由底至頂（由後向前）繪製
        // 在陣列中 index 0 是最頂層，index N 是最底層
        // 因此畫布繪製必須由 index N 畫到 index 0
        const reversedRenderList = [...renderList].reverse();

        reversedRenderList.forEach(item => {
            ctx.drawImage(
                item.element,
                Math.round(item.x),
                Math.round(item.y),
                Math.round(item.width),
                Math.round(item.height)
            );
        });

        // 6. 導出最高品質無損 PNG
        canvas.toBlob((blob) => {
            if (!blob) {
                alert('圖片產生失敗，請重試');
                return;
            }

            const downloadUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
            downloadLink.download = `疊圖合成_${timestamp}.png`;
            downloadLink.href = downloadUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
        }, 'image/png');

    } catch (err) {
        console.error('合成下載時發生錯誤:', err);
        alert('下載失敗: ' + (err.message || err));
    } finally {
        if (loadingMsg && loadingMsg.parentNode) {
            document.body.removeChild(loadingMsg);
        }
    }
}

// 視窗縮放處理
function handleResize() {
    applyImageLayout();
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// DOM 載入後啟動
document.addEventListener('DOMContentLoaded', initApp);

