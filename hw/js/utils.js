// 日期工具函数

/**
 * 格式化日期为YYYY/MM/DD格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(1, '0');
    const day = String(date.getDate()).padStart(1, '0');
    return `${year}/${month}/${day}`;
}

/**
 * 解析YYYY/MM/DD格式的日期字符串为Date对象
 * @param {string} dateStr - 日期字符串
 * @returns {Date} 日期对象
 */
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59);
}

/**
 * 计算两个日期之间的天数差
 * @param {Date} date1 - 第一个日期
 * @param {Date} date2 - 第二个日期
 * @returns {number} 天数差
 */
function getDayDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // 毫秒
    const diffTime = date2 - date1;
    return Math.ceil(diffTime / oneDay);
}

/**
 * 判断作业是否即将截止（剩余时间不足一天）
 * @param {string} dueDate - 截止日期字符串(YYYY/MM/DD)
 * @returns {boolean} 是否即将截止
 */
function isUrgent(dueDate) {
    const due = parseDate(dueDate);
    const now = new Date();
    const diffInHours = (due - now) / (1000 * 60 * 60);
    
    // 剩余时间不足36小时且尚未截止
    return diffInHours > 0 && diffInHours < 36;
}

/**
 * 判断作业是否已过期
 * @param {string} dueDate - 截止日期字符串(YYYY/MM/DD)
 * @returns {boolean} 是否已过期
 */
function isOverdue(dueDate) {
    const due = parseDate(dueDate);
    const now = new Date();
    return now > due;
}

/**
 * 获取指定日期是星期几（中文）
 * @param {Date} date - 日期对象
 * @returns {string} 星期几
 */
function getWeekdayName(date) {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[date.getDay()];
}

/**
 * 获取指定日期所在周的所有日期
 * @param {Date} date - 日期对象
 * @returns {Date[]} 一周的日期数组
 */
function getWeekDates(date) {
    const weekDates = [];
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 调整到周一
    
    const monday = new Date(date);
    monday.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday);
        currentDate.setDate(monday.getDate() + i);
        weekDates.push(currentDate);
    }
    
    return weekDates;
}

/**
 * 获取指定日期所在周的范围字符串
 * @param {Date} date - 日期对象
 * @returns {string} 周范围字符串
 */
function getWeekRangeString(date) {
    const weekDates = getWeekDates(date);
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    return `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
}

/**
 * 获取指定日期的作业
 * @param {string} dateStr - 日期字符串(YYYY/MM/DD)
 * @returns {Array} 作业数组
 */
function getHomeworkForDate(dateStr) {
    return homeworkData.filter(homework => homework.dueDate === dateStr);
}

/**
 * 计算待完成作业数量
 * @returns {number} 待完成作业数量
 */
function getPendingHomeworkCount() {
    return homeworkData.filter(homework => !homework.isCompleted).length;
}

/**
 * 计算即将截止的作业数量
 * @returns {number} 即将截止的作业数量
 */
function getUrgentHomeworkCount() {
    return homeworkData.filter(homework => !homework.isCompleted && isUrgent(homework.dueDate)).length;
}

/**
 * 根据科目ID获取科目信息
 * @param {string} subjectId - 科目ID
 * @returns {Object} 科目信息
 */
function getSubjectById(subjectId) {
    return subjects.find(subject => subject.id === subjectId);
}
