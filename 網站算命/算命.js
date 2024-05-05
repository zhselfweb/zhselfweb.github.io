// 定義問題與答案
var questions = [
    "你幾年出生(民國)？",
    "你星座是什麼(請回答，純文字，下方有參考)"
];

var answers = [];


// 函數來顯示問題，並根據問題數量決定顯示哪一個問題
function showQuestion() {
    var questionIndex = answers.length;
    if (questionIndex < questions.length) {
        document.getElementById("question").textContent = questions[questionIndex];
    } else {
        // 如果所有問題都回答完畢，隱藏問題和輸入框，顯示結果
        document.getElementById("question").style.display = "none";
        document.getElementById("answer").style.display = "none";
        document.getElementById("submitBtn").style.display = "none";
        document.getElementById("loading").style.display = "block";
        setTimeout(showResult, 2000); // 這裡的2000表示2秒鐘

    }
}
// 函數來處理使用者的回答
function saveAnswer() {
    var answer = document.getElementById("answer").value.trim().replace(/[^\u4e00-\u9fa5\d\s]/gi, ''); // 移除所有非中文字符、數字和空格的符號
    if (answer === "") {
        alert("不要空白...");
        return;
    }
    if (answers.length === 0) { // 第一題的驗證
        if (isNaN(answer) || answer < 13) {
            alert("阿你怎麼還活者");
            return;
        }
        if (answer > 113) {
            alert("那你很年輕喔");
            return;
        }
    } else if (answers.length === 1) { // 第二題的驗證
        if (!["牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座", "天秤座", "天蠍座", "射手座", "摩羯座", "魔羯座", "水瓶座", "雙魚座", "牡羊", "金牛", "雙子", "巨蟹", "獅子", "處女", "天秤", "天蠍", "射手", "摩羯", "魔羯", "水瓶", "雙魚"].includes(answer)) {
            alert("你是不是看不懂中文");
            return;
        }
    }
    answers.push(answer);
    // 清空輸入框
    document.getElementById("answer").value = "";
    // 顯示下一個問題或顯示結果
    showQuestion();
}



// 函數來顯示最終結果
function showResult() {
    var birthYear = answers[0];
    var constellation = answers[1];
    // 這裡可以根據回答來顯示不同的結果
    var result = "根據系統專業的計算" + "<br><br>你的出生年份是：<span id='birthYear'>" + birthYear + "</span><br>你的星座是：<span id='constellation'>" + constellation + "</span>";

    document.getElementById("loading").style.display = "none"; // 隱藏 loading 動畫
    document.getElementById("result").innerHTML = result; // 顯示結果
}

// 顯示第一個問題
showQuestion();