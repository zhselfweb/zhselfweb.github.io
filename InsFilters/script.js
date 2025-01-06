let favoriteFilters = JSON.parse(localStorage.getItem('favoriteFilters')) || [];

// 切換收藏狀態
function toggleFavorite(button) {
    const filterItem = button.closest('.filter-item');
    const filterName = filterItem.querySelector('.filter-name').textContent;
    const checkbox = button.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
        // 添加收藏
        if (!favoriteFilters.includes(filterName)) {
            favoriteFilters.push(filterName);
        }
    } else {
        // 移除收藏
        favoriteFilters = favoriteFilters.filter(item => item !== filterName);
    }

    // 儲存收藏至 localStorage
    localStorage.setItem('favoriteFilters', JSON.stringify(favoriteFilters));

    // 即時更新 filter-page
    if (!document.getElementById('filter-page').classList.contains('hidden')) {
        updateFilterPage();  // 更新濾鏡頁面的顯示狀態
    }
}




// 更新收藏頁面
function updateFavoriteList() {
    const favoriteList = document.getElementById('favorite-list');
    favoriteList.innerHTML = ''; // 清空舊的收藏列表

    favoriteFilters.forEach(filterName => {
        // 根據濾鏡名稱找到對應的項目
        const filterItem = Array.from(document.querySelectorAll('.filter-item')).find(item =>
            item.querySelector('.filter-name').textContent === filterName
        );

        // 確保找到對應的濾鏡項目
        if (filterItem) {
            const filterImage = filterItem.getAttribute('data-image'); // 取得圖片 URL

            const item = document.createElement('div');
            item.classList.add('filter-item');
            item.innerHTML = `
                <img src="${filterImage}" alt="filter" class="filter-img">
                <div class="filter-info">
                    <span class="filter-name">${filterName}</span>
                </div>
                <button class="favorite-btn" onclick="toggleFavorite(this)">
                    <label class="container">
                        <input type="checkbox" checked />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 75 100" class="pin">
                            <line stroke-width="12" stroke="black" y2="100" x2="37" y1="64" x1="37"></line>
                            <path stroke-width="10" stroke="black"
                                d="M16.5 36V4.5H58.5V36V53.75V54.9752L59.1862 55.9903L66.9674 67.5H8.03256L15.8138 55.9903L16.5 54.9752V53.75V36Z">
                            </path>
                        </svg>
                    </label>
                </button>
            `;
            favoriteList.appendChild(item);
        }
    });
}



// 更新濾鏡頁面
function updateFilterPage() {
    const filterItems = document.querySelectorAll('.filter-item');

    filterItems.forEach(item => {
        const filterName = item.querySelector('.filter-name').textContent;
        const checkbox = item.querySelector('input[type="checkbox"]');

        // 更新checkbox的選中狀態
        if (favoriteFilters.includes(filterName)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

// 切換至濾鏡頁
function showFilters() {
    document.getElementById('filter-page').classList.remove('hidden');
    document.getElementById('favorite-page').classList.add('hidden');
    updateFilterPage();  // 確保回到濾鏡頁時更新濾鏡狀態
}

// 切換至收藏頁
function showFavorites() {
    document.getElementById('filter-page').classList.add('hidden');
    document.getElementById('favorite-page').classList.remove('hidden');
    updateFavoriteList();  // 更新收藏頁面顯示的內容
}


// 初始化頁面顯示濾鏡頁
showFilters();

// 確保已收藏的項目會顯示為選中狀態
function initFavorites() {
    const allFilterItems = document.querySelectorAll('.filter-item');

    allFilterItems.forEach(item => {
        const filterName = item.querySelector('.filter-name').textContent;
        const checkbox = item.querySelector('input[type="checkbox"]');

        // 如果該濾鏡是已收藏，則選中checkbox
        if (favoriteFilters.includes(filterName)) {
            checkbox.checked = true;
            updateBookmarkColor(checkbox, filterName);
        }
    });
}


// 等待頁面加載完成後初始化收藏狀態
window.onload = initFavorites;


