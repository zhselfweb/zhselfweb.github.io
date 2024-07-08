// 加載已保存的備忘錄
window.onload = function() {
    loadMemos();
};

// 保存備忘錄到本地存儲
function saveMemo() {
    var memoInput = document.getElementById("memoInput");
    var memoList = JSON.parse(localStorage.getItem("memos")) || [];

    var memoText = memoInput.value.trim();
    if (memoText !== "") {
        memoList.push(memoText);
        localStorage.setItem("memos", JSON.stringify(memoList));
        memoInput.value = "";
        loadMemos(); // 重新加載備忘錄列表
    }
}


// 加載備忘錄列表
function loadMemos() {
    var memoList = JSON.parse(localStorage.getItem("memos")) || [];
    var memoListDiv = document.getElementById("memoList");
    memoListDiv.innerHTML = "";

    if (memoList.length > 0) {
        var ul = document.createElement("ul");
        memoList.forEach(function(memo, index) {
            var li = document.createElement("li");
            li.textContent = memo;
            li.setAttribute("data-index", index); // 添加索引數據屬性
            li.addEventListener("click", function() {
                this.classList.toggle("selected");
            });
            ul.appendChild(li);
        });
        memoListDiv.appendChild(ul);
    } else {
        memoListDiv.textContent = "目前沒有任何備忘錄。";
    }
}

// 清除備忘錄
function clearMemo() {
    var clearOption = document.getElementById("clearOption").value;
    var memoList = JSON.parse(localStorage.getItem("memos")) || [];

    switch (clearOption) {
        case "all":
            localStorage.removeItem("memos");
            break;
        case "last":
            memoList.pop();
            localStorage.setItem("memos", JSON.stringify(memoList));
            break;

    }

    loadMemos(); // 重新加載備忘錄列表
}