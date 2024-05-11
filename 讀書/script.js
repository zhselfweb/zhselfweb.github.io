let currentPage = 1; // 當前頁面
let totalPages = 1; // 總頁數
let novelContent = ''; // 小說內容

function handleFile(files) {
    const file = files[0]; // 獲取第一個文件
    const reader = new FileReader(); // 創建文件讀取器

    reader.onload = function(event) {
        novelContent = event.target.result; // 將文件內容存儲到變量中
        displayNovel(); // 顯示小說內容
    }

    reader.readAsText(file); // 讀取文件內容為文本
}

function displayNovel() {
    const novelContainer = document.getElementById('novelContainer'); // 獲取小說容器
    const footer = document.getElementById('footer'); // 獲取頁腳容器
    const lines = novelContent.split('\n'); // 將文件內容按行分割
    let chapterTitle = ''; // 章節標題
    let chapterContent = ''; // 章節內容
    let novelPage = ''; // 小說頁面

    lines.forEach(line => {
        if (line.trim() === '') {
            // 空行表示章節結束
            if (chapterTitle !== '') {
                novelPage += `<h2>${chapterTitle}</h2>`;
                novelPage += `<p>${chapterContent}</p>`;
                chapterTitle = '';
                chapterContent = '';
                totalPages++;
            }
        } else if (line.match(/^\s*第\d+章\s*$/)) {
            // 新的章節標題（僅包含“第X章”）
            if (novelPage !== '') {
                novelContainer.innerHTML += `<div class="novelPage" id="page${totalPages}">${novelPage}</div>`;
                novelPage = '';
            }
            if (novelContainer.innerHTML === '') {
                // 直接將第一章插入到第一頁
                novelContainer.innerHTML += `<div class="novelPage" id="page${totalPages}"></div>`;
            }
            chapterTitle = line.trim();
        } else {
            // 累加章節內容
            chapterContent += line.trim() + '<br>';
        }
    });

    // 顯示最後一個章節
    if (chapterTitle !== '') {
        novelPage += `<h2>${chapterTitle}</h2>`;
        novelPage += `<p>${chapterContent}</p>`;
        totalPages++;
    }

    if (novelPage !== '') {
        novelContainer.innerHTML += `<div class="novelPage" id="page${totalPages}">${novelPage}</div>`;
    }

    // 顯示導航按鈕
    let navButtons = '';
    if (totalPages > 1) {
        navButtons += `<button onclick="goToPrevPage()" id="prevPageButton" >上一頁</button>`;
        navButtons += `<select onchange="goToPage(parseInt(this.value))" class="sel">`;
        for (let i = 1; i <= totalPages; i++) {
            navButtons += `<option value="${i}" ${i === currentPage ? 'selected' : ''}>${i}</option>`;
        }
        navButtons += `</select>`;
        navButtons += `<button onclick="goToNextPage()" id="nextPageButton" >下一頁</button>`;
    }
    footer.innerHTML = navButtons;

    // 顯示初始頁面
    showPage(currentPage);
}

function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        showPage(currentPage);
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        updateSelectBox();
        scrollToTop(); // 滚动到页面顶部
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        updateSelectBox();
        scrollToTop(); // 滚动到页面顶部
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 平滑滚动到页面顶部
}


function updateSelectBox() {
    const selectBox = document.querySelector('select');
    selectBox.value = currentPage;
}

function showPage(page) {
    const novelPages = document.getElementsByClassName('novelPage');
    for (let i = 0; i < novelPages.length; i++) {
        novelPages[i].style.display = 'none';
    }
    document.getElementById(`page${page}`).style.display = 'block';
}

window.onload = function() {
    updateSelectBox();
}