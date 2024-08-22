
document.addEventListener("DOMContentLoaded", function () {
    // 檢查Cookie來決定是否顯示彈窗
    if (!getCookie("noShowAgain")) {
        // 檢測是否是手機設備
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            const popup = document.getElementById("mobile-popup");
            popup.style.display = "flex";

            // 2.5秒後自動關閉彈窗
            setTimeout(() => {
                popup.style.display = "none";
            }, 2500);

            // 記住用戶選擇是否下次不再顯示彈窗
            document.getElementById("no-show-again").addEventListener("change", function () {
                if (this.checked) {
                    setCookie("noShowAgain", true, 365);
                }
            });
        }
    }
});

// 設置Cookie的函數
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 獲取Cookie的函數
function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}
