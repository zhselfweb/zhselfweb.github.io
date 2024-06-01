// script.js
function rotateClock(speedMultiplier) {
    const hourHand = document.getElementById('hour');
    const minuteHand = document.getElementById('minute');

    let hour = 0;
    let minute = 0;

    function updateClock() {
        minute += 0.5 * speedMultiplier; // 每幀增加0.5度，乘以速度倍數
        hour += (1 / 120) * speedMultiplier; // 每幀增加1/120度，乘以速度倍數

        minuteHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${minute}deg)`;
        hourHand.style.transform = `translateX(-50%) translateY(-100%) rotate(${hour}deg)`;

        requestAnimationFrame(updateClock); // 使用requestAnimationFrame進行下一次更新
    }

    requestAnimationFrame(updateClock); // 開始動畫循環
}

document.addEventListener('DOMContentLoaded', () => {
    let speedMultiplier = 1;

    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const speedInput = document.getElementById('speed-input');
    const cancelButton = document.getElementById('cancel-button');
    const resetButton = document.getElementById('reset-button');
    const applyButton = document.getElementById('apply-button');

    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    cancelButton.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    resetButton.addEventListener('click', () => {
        speedMultiplier = 1;
        speedInput.value = 1;
        settingsModal.style.display = 'none';
        rotateClock(speedMultiplier); // 在重置後重新調用rotateClock函數
    });

    applyButton.addEventListener('click', () => {
        speedMultiplier = parseFloat(speedInput.value);
        settingsModal.style.display = 'none';
        rotateClock(speedMultiplier); // 在更新倍數後重新調用rotateClock函數
    });

    rotateClock(speedMultiplier); // 開始時鐘旋轉
});