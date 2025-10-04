// 渲染科目筛选按钮
function renderSubjectFilters() {
    const container = document.getElementById('subjectFilters');
    container.innerHTML = '';
    
    // 添加"全部科目"按钮
    const allBtn = document.createElement('button');
    allBtn.className = 'flex items-center space-x-2 bg-primary/10 text-primary border border-primary/30 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap card-hover';
    allBtn.innerHTML = `<i class="fa fa-th-large"></i><span>全部科目</span>`;
    allBtn.addEventListener('click', () => filterBySubject('all'));
    container.appendChild(allBtn);
    
    // 添加各科目按钮
    subjects.forEach(subject => {
        const btn = document.createElement('button');
        btn.className = `flex items-center space-x-2 bg-dark-200 hover:bg-dark-100 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap card-hover`;
        btn.innerHTML = `<i class="fa ${subject.icon}"></i><span>${subject.name}</span>`;
        btn.addEventListener('click', () => filterBySubject(subject.id));
        container.appendChild(btn);
    });
}

// 渲染日期筛选按钮
// 渲染日期筛选按钮
function renderDateFilters() {
    const container = document.getElementById('dateFilters');
    container.innerHTML = '';
    
    // 添加"全部日期"按钮
    const allDateBtn = document.createElement('button');
    allDateBtn.className = `rounded-full px-4 py-2 text-sm font-medium btn-effect ${currentDateFilter === 'all' ? 'bg-primary text-white' : 'bg-dark-200 hover:bg-dark-100'}`;
    allDateBtn.innerHTML = '全';
    allDateBtn.addEventListener('click', () => filterByDate('all'));
    container.appendChild(allDateBtn);
    
    // 获取未来7天的日期
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    
    // 创建日期按钮
    dates.forEach(date => {
        const btn = document.createElement('button');
        const dateStr = formatDate(date);
        const weekday = getWeekdayName(date);
        const isToday = date.toDateString() === today.toDateString();
        
        // 根据当前筛选状态设置样式
        btn.className = `rounded-full px-4 py-2 text-sm font-medium btn-effect ${currentDateFilter === dateStr ? 'bg-primary text-white' : (isToday ? 'bg-primary/20 text-primary' : 'bg-dark-200 hover:bg-dark-100')}`;
        btn.innerHTML = `${weekday}<br>${date.getDate()}`;
        btn.addEventListener('click', () => filterByDate(dateStr));
        
        container.appendChild(btn);
    });
}

// 渲染作业列表
function renderHomeworkLists() {
    const pendingContainer = document.getElementById('pendingHomeworkContainer');
    const completedContainer = document.getElementById('completedHomeworkContainer');
    
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    // 1. 先按日期筛选作业
    let filteredByDate = [...homeworkData];
    if (currentDateFilter !== 'all') {
      // 只保留截止日期与筛选条件匹配的作业
      filteredByDate = filteredByDate.filter(homework => homework.dueDate === currentDateFilter);
    }
    
    // 2. 再按截止日期排序
    const sortedHomework = filteredByDate.sort((a, b) => {
      return parseDate(a.dueDate) - parseDate(b.dueDate);
    });
    
    // 3. 分离待完成和已完成作业（后续逻辑不变）
    const pendingHomework = sortedHomework.filter(homework => !homework.isCompleted);
    const completedHomework = sortedHomework.filter(homework => homework.isCompleted);
    

    // 更新计数
    document.getElementById('pendingCount').textContent = pendingHomework.length;
    document.getElementById('urgentCount').textContent = getUrgentHomeworkCount();
    document.getElementById('notificationBadge').style.display = getUrgentHomeworkCount() > 0 ? 'block' : 'none';
    

        // 计算今日截止的作业数量
        const today = formatDate(new Date());
        const todayDeadlineCount = pendingHomework.filter(homework => 
            homework.dueDate === today && !homework.isCompleted
        ).length;
        
        // 更新今日截止计数显示
        document.getElementById('todayCount').textContent = todayDeadlineCount;

        
    // 渲染待完成作业
    if (pendingHomework.length === 0) {
        pendingContainer.innerHTML = `
            <div class="bg-dark-300 rounded-xl p-6 text-center border border-dark-100">
                <i class="fa fa-check-circle text-green-400 text-3xl mb-3"></i>
                <p class="text-light-300">目前沒有待完成的作業</p>
            </div>
        `;
    } else {
        pendingHomework.forEach(homework => {
            pendingContainer.appendChild(createHomeworkCard(homework));
        });
    }
    
    // 渲染已完成作业
    if (completedHomework.length === 0) {
        completedContainer.innerHTML = `
            <div class="bg-dark-300/50 rounded-xl p-6 text-center border border-dark-100/50">
                <i class="fa fa-tasks text-light-300/50 text-3xl mb-3"></i>
                <p class="text-light-300/50">尚未完成任何作業</p>
            </div>
        `;
    } else {
        completedHomework.forEach(homework => {
            completedContainer.appendChild(createHomeworkCard(homework));
        });
    }
}

// 创建作业卡片
function createHomeworkCard(homework) {
    const subject = getSubjectById(homework.subject);
    const urgent = isUrgent(homework.dueDate);
    const overdue = isOverdue(homework.dueDate);
    
    const card = document.createElement('div');
    card.className = `bg-dark-300 rounded-xl p-4 card-hover border border-dark-100 ${homework.isCompleted ? 'opacity-70 bg-dark-300/50 border-dark-100/50' : ''} ${urgent ? 'animate-pulse-soft' : ''}`;
    
    let statusText = '';
    let statusClass = '';
    
    if (homework.isCompleted) {
        statusText = `<i class="fa fa-check-circle mr-1"></i><span>已完成</span>`;
        statusClass = 'text-light-300/40';
    } else if (overdue) {
        statusText = `<i class="fa fa-exclamation-triangle mr-1"></i><span>已過期</span>`;
        statusClass = 'text-amber-400';
    } else if (urgent) {
        statusText = `<i class="fa fa-exclamation-circle mr-1"></i><span>${homework.dueDate} 即將截止</span>`;
        statusClass = 'text-accent';
    } else {
        statusText = `<i class="fa fa-calendar-o mr-1"></i><span>${homework.dueDate} 截止</span>`;
        statusClass = 'text-light-300/60';
    }
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex items-center">
                <span class="${subject.color} text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">${subject.name}</span>
                <h4 class="font-medium text-light-100 ${homework.isCompleted ? 'line-through text-light-100/70' : ''}">${homework.title}</h4>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${homework.isCompleted ? 'checked' : ''} class="sr-only peer" data-id="${homework.id}">
                <div class="w-9 h-5 bg-dark-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
        </div>
        
        <p class="text-light-300/80 text-sm mb-3 ${homework.isCompleted ? 'line-through text-light-300/50' : ''}">${homework.description}</p>
        
        <div class="flex justify-between items-center">
            <div class="flex items-center text-xs ${statusClass}">
                ${statusText}
            </div>
            <button class="text-primary ${homework.isCompleted ? 'text-primary/70' : ''} text-xs hover:underline flex items-center detail-btn" data-id="${homework.id}">
                <span>詳細</span>
                <i class="fa fa-chevron-right ml-1 text-[10px]"></i>
            </button>
        </div>
    `;
    
    // 添加事件监听
    const checkbox = card.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        toggleHomeworkStatus(parseInt(this.dataset.id));
    });
    
    const detailBtn = card.querySelector('.detail-btn');
    detailBtn.addEventListener('click', function() {
        openHomeworkDetail(parseInt(this.dataset.id));
    });
    
    return card;
}

// 渲染日历视图
function renderCalendar(currentDate = new Date()) {
    const calendarGrid = document.getElementById('calendarGrid');
    const weekDates = getWeekDates(currentDate);
    const today = new Date();
    const selectedDate = window.selectedDate || today;
    
    // 更新周范围标题
    document.getElementById('currentWeekRange').textContent = getWeekRangeString(currentDate);
    
    calendarGrid.innerHTML = '';
    
    // 渲染日历格子
    weekDates.forEach(date => {
        const dateStr = formatDate(date);
        const isToday = date.toDateString() === today.toDateString();
        const hasHomework = getHomeworkForDate(dateStr).length > 0;
        const isSelected = date.toDateString() === selectedDate.toDateString();
        
        const dayElement = document.createElement('div');
        dayElement.className = `calendar-day ${isToday ? 'calendar-day-today' : ''} ${hasHomework ? 'calendar-day-has-homework' : ''} ${isSelected ? 'calendar-day-selected' : ''}`;
        dayElement.innerHTML = `<span class="text-sm font-medium">${date.getDate()}</span>`;
        dayElement.dataset.date = dateStr;
        
        dayElement.addEventListener('click', () => {
            selectCalendarDate(date);
        });
        
        calendarGrid.appendChild(dayElement);
    });
    
    // 显示选中日期的作业
    renderDailyHomework(selectedDate);
}

// 渲染指定日期的作业
function renderDailyHomework(date) {
    const container = document.getElementById('dailyHomeworkContainer');
    const dateStr = formatDate(date);
    const homeworkList = getHomeworkForDate(dateStr);
    
    // 更新标题
    document.getElementById('selectedDateTitle').textContent = `${dateStr} (週${getWeekdayName(date)}) 的作業`;
    
    container.innerHTML = '';
    
    if (homeworkList.length === 0) {
        container.innerHTML = `
            <div class="bg-dark-300 rounded-xl p-6 text-center border border-dark-100">
                <i class="fa fa-calendar-o text-light-300/70 text-3xl mb-3"></i>
                <p class="text-light-300/70">當天沒有作業</p>
            </div>
        `;
        return;
    }
    
    // 按完成状态和科目排序
    homeworkList.sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1; // 未完成的在前
        }
        return a.subject.localeCompare(b.subject);
    });
    
    // 创建作业列表
    const list = document.createElement('div');
    list.className = 'space-y-3';
    
    homeworkList.forEach(homework => {
        const item = document.createElement('div');
        const subject = getSubjectById(homework.subject);
        
        item.className = `bg-dark-300 rounded-xl p-4 border border-dark-100 ${homework.isCompleted ? 'opacity-70 bg-dark-300/50' : ''}`;
        item.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="${subject.color} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block">${subject.name}</span>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${homework.isCompleted ? 'checked' : ''} class="sr-only peer" data-id="${homework.id}">
                    <div class="w-8 h-4 bg-dark-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
            <h4 class="font-medium text-light-100 mb-2 ${homework.isCompleted ? 'line-through text-light-100/70' : ''}">${homework.title}</h4>
            <p class="text-light-300/80 text-sm ${homework.isCompleted ? 'line-through text-light-300/50' : ''}">${homework.description}</p>
        `;
        
        // 添加事件监听
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            toggleHomeworkStatus(parseInt(this.dataset.id));
        });
        
        list.appendChild(item);
    });
    
    container.appendChild(list);
}

// 筛选作业（按科目）
function filterBySubject(subjectId) {
    currentFilter = subjectId;
    const pendingContainer = document.getElementById('pendingHomeworkContainer');
    const completedContainer = document.getElementById('completedHomeworkContainer');
    
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    // 筛选作业
    let filteredHomework = [...homeworkData];
    if (subjectId !== 'all') {
        filteredHomework = filteredHomework.filter(homework => homework.subject === subjectId);
    }
    
    // 排序并分离作业
    const sortedHomework = filteredHomework.sort((a, b) => {
        return parseDate(a.dueDate) - parseDate(b.dueDate);
    });
    
    const pendingHomework = sortedHomework.filter(homework => !homework.isCompleted);
    const completedHomework = sortedHomework.filter(homework => homework.isCompleted);
    
    // 渲染结果
    if (pendingHomework.length === 0) {
        pendingContainer.innerHTML = `
            <div class="bg-dark-300 rounded-xl p-6 text-center border border-dark-100">
                <i class="fa fa-check-circle text-green-400 text-3xl mb-3"></i>
                <p class="text-light-300">目前沒有待完成的作業</p>
            </div>
        `;
    } else {
        pendingHomework.forEach(homework => {
            pendingContainer.appendChild(createHomeworkCard(homework));
        });
    }
    
    if (completedHomework.length === 0) {
        completedContainer.innerHTML = `
            <div class="bg-dark-300/50 rounded-xl p-6 text-center border border-dark-100/50">
                <i class="fa fa-tasks text-light-300/50 text-3xl mb-3"></i>
                <p class="text-light-300/50">尚未完成任何作業</p>
            </div>
        `;
    } else {
        completedHomework.forEach(homework => {
            completedContainer.appendChild(createHomeworkCard(homework));
        });
    }
}

// 筛选作业（按日期）
function filterByDate(dateStr) {
    const pendingContainer = document.getElementById('pendingHomeworkContainer');
    const completedContainer = document.getElementById('completedHomeworkContainer');
    
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    // 筛选指定日期的作业
    const filteredHomework = homeworkData.filter(homework => homework.dueDate === dateStr);
    
    // 分离作业
    const pendingHomework = filteredHomework.filter(homework => !homework.isCompleted);
    const completedHomework = filteredHomework.filter(homework => homework.isCompleted);
    
    // 日期筛选逻辑
let currentDateFilter = 'all'; // 全局变量，记录当前日期筛选条件

function filterByDate(dateStr) {
  // 更新当前筛选状态
  currentDateFilter = dateStr;
  
  // 重新渲染日期筛选按钮（更新选中样式）
  renderDateFilters();
  
  // 关键：重新渲染作业列表，应用新的筛选条件
  renderHomeworkLists();
}
    // 渲染结果
    if (pendingHomework.length === 0) {
        pendingContainer.innerHTML = `
            <div class="bg-dark-300 rounded-xl p-6 text-center border border-dark-100">
                <i class="fa fa-check-circle text-green-400 text-3xl mb-3"></i>
                <p class="text-light-300">當天沒有待完成的作業</p>
            </div>
        `;
    } else {
        pendingHomework.forEach(homework => {
            pendingContainer.appendChild(createHomeworkCard(homework));
        });
    }
    
    if (completedHomework.length === 0) {
        completedContainer.innerHTML = `
            <div class="bg-dark-300/50 rounded-xl p-6 text-center border border-dark-100/50">
                <i class="fa fa-tasks text-light-300/50 text-3xl mb-3"></i>
                <p class="text-light-300/50">當天沒有已完成的作業</p>
            </div>
        `;
    } else {
        completedHomework.forEach(homework => {
            completedContainer.appendChild(createHomeworkCard(homework));
        });
    }
}

// 筛选作业（按搜索）
function filterBySearch(keyword) {
    if (!keyword.trim()) {
        renderHomeworkLists();
        return;
    }
    
    const searchTerm = keyword.toLowerCase().trim();
    const pendingContainer = document.getElementById('pendingHomeworkContainer');
    const completedContainer = document.getElementById('completedHomeworkContainer');
    
    pendingContainer.innerHTML = '';
    completedContainer.innerHTML = '';
    
    // 筛选包含关键词的作业
    const filteredHomework = homeworkData.filter(homework => {
        const subject = getSubjectById(homework.subject);
        return (
            homework.title.toLowerCase().includes(searchTerm) ||
            homework.description.toLowerCase().includes(searchTerm) ||
            subject.name.toLowerCase().includes(searchTerm)
        );
    });
    
    // 分离作业
    const pendingHomework = filteredHomework.filter(homework => !homework.isCompleted);
    const completedHomework = filteredHomework.filter(homework => homework.isCompleted);
    
    // 渲染结果
    if (pendingHomework.length === 0) {
        pendingContainer.innerHTML = `
            <div class="bg-dark-300 rounded-xl p-6 text-center border border-dark-100">
                <i class="fa fa-search text-light-300/70 text-3xl mb-3"></i>
                <p class="text-light-300">沒有找到符合條件的待完成作業</p>
            </div>
        `;
    } else {
        pendingHomework.forEach(homework => {
            pendingContainer.appendChild(createHomeworkCard(homework));
        });
    }
    
    if (completedHomework.length === 0) {
        completedContainer.innerHTML = `
            <div class="bg-dark-300/50 rounded-xl p-6 text-center border border-dark-100/50">
                <i class="fa fa-search text-light-300/50 text-3xl mb-3"></i>
                <p class="text-light-300/50">沒有找到符合條件的已完成作業</p>
            </div>
        `;
    } else {
        completedHomework.forEach(homework => {
            completedContainer.appendChild(createHomeworkCard(homework));
        });
    }
}

// 切换作业完成状态
function toggleHomeworkStatus(homeworkId) {
    const homework = homeworkData.find(h => h.id === homeworkId);
    if (homework) {
        homework.isCompleted = !homework.isCompleted;
        saveCompletionStatus();
        renderHomeworkLists();
        renderCalendar(currentWeek);
        updateNotificationBadge();
    }
}

// 打开作业详情模态框
function openHomeworkDetail(homeworkId) {
    const homework = homeworkData.find(h => h.id === homeworkId);
    if (!homework) return;
    
    const subject = getSubjectById(homework.subject);
    
    // 填充模态框内容
    document.getElementById('modalSubject').textContent = subject.name;
    document.getElementById('modalSubject').className = `${subject.color} text-xs font-medium px-2.5 py-0.5 rounded-full`;
    document.getElementById('modalTitle').textContent = homework.title;
    document.getElementById('modalDueDate').textContent = `${homework.dueDate} 截止`;
    document.getElementById('modalContentText').innerHTML = homework.details.replace(/\n/g, '<br>');
    document.getElementById('modalAdditionalInfo').textContent = homework.additionalInfo;
    
    // 设置完成按钮事件
    const completeBtn = document.getElementById('completeInModal');
    completeBtn.onclick = () => {
        homework.isCompleted = true;
        saveCompletionStatus();
        renderHomeworkLists();
        renderCalendar(currentWeek);
        updateNotificationBadge();
        closeDetailModal();
    };
    
    // 显示模态框
    const modal = document.getElementById('detailModal');
    modal.classList.remove('hidden', 'pointer-events-none');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modal.querySelector('#modalContent').classList.remove('scale-95');
        modal.querySelector('#modalContent').classList.add('scale-100');
    }, 10);
}

// 关闭作业详情模态框
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('opacity-100');
    modal.querySelector('#modalContent').classList.remove('scale-100');
    modal.querySelector('#modalContent').classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden', 'pointer-events-none');
    }, 300);
}

// 修改selectCalendarDate函数（添加到components.js）
function selectCalendarDate(date) {
    // 移除之前选中的日期样式
    document.querySelectorAll('.calendar-day-selected').forEach(day => {
        day.classList.remove('calendar-day-selected');
    });
    
    // 添加新选中日期的样式
    const dateStr = formatDate(date);
    const dayElement = document.querySelector(`.calendar-day[data-date="${dateStr}"]`);
    if (dayElement) {
        // 添加选中动画
        dayElement.classList.add('calendar-day-selected', 'pulse-on-click');
        setTimeout(() => {
            dayElement.classList.remove('pulse-on-click');
        }, 300);
    }
    
    window.selectedDate = date;
    renderDailyHomework(date);
}

// 切换视图（首页/日历）
function switchView(view) {
    currentView = view;
    const homeView = document.getElementById('homeView');
    const calendarView = document.getElementById('calendarView');
    const homeNav = document.getElementById('homeNav');
    const calendarNav = document.getElementById('calendarNav');
    
    if (view === 'home') {
        homeView.classList.remove('hidden');
        calendarView.classList.add('hidden');
        homeNav.classList.add('text-primary');
        homeNav.classList.remove('text-light-300/70', 'hover:text-light-100');
        calendarNav.classList.add('text-light-300/70', 'hover:text-light-100');
        calendarNav.classList.remove('text-primary');
    } else {
        homeView.classList.add('hidden');
        calendarView.classList.remove('hidden');
        homeNav.classList.add('text-light-300/70', 'hover:text-light-100');
        homeNav.classList.remove('text-primary');
        calendarNav.classList.add('text-primary');
        calendarNav.classList.remove('text-light-300/70', 'hover:text-light-100');
    }
}

// 显示紧急作业通知
function showUrgentHomeworkNotification() {
    const urgentHomework = homeworkData.filter(homework => !homework.isCompleted && isUrgent(homework.dueDate));
    const modalContent = document.getElementById('urgentModalContent');
    const modal = document.getElementById('urgentModal');
    
    modalContent.innerHTML = '';
    
    if (urgentHomework.length === 0) {
        modalContent.innerHTML = `
            <div class="p-6 text-center">
                <i class="fa fa-check-circle text-green-400 text-3xl mb-3"></i>
                <p class="text-light-300">目前沒有即將截止的作業</p>
            </div>
        `;
    } else {
        const list = document.createElement('div');
        list.className = 'divide-y divide-dark-100';
        
        urgentHomework.forEach(homework => {
            const subject = getSubjectById(homework.subject);
            const item = document.createElement('div');
            item.className = 'p-4 hover:bg-dark-200/50 transition-colors';
            item.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <span class="${subject.color} text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block">${subject.name}</span>
                        <h4 class="font-medium text-light-100">${homework.title}</h4>
                    </div>
                    <button class="text-primary text-sm hover:underline detail-btn" data-id="${homework.id}">
                        查看
                    </button>
                </div>
                <p class="text-light-300/80 text-sm mt-2">${homework.description}</p>
                <div class="flex items-center text-xs text-accent mt-2">
                    <i class="fa fa-exclamation-circle mr-1"></i>
                    <span>即將截止</span>
                </div>
            `;
            
            // 添加查看详情事件
            item.querySelector('.detail-btn').addEventListener('click', function() {
                openHomeworkDetail(parseInt(this.dataset.id));
                closeUrgentModal();
            });
            
            list.appendChild(item);
        });
        
        modalContent.appendChild(list);
    }
    
    // 显示模态框
    modal.classList.remove('hidden', 'pointer-events-none');
    setTimeout(() => {
        modal.classList.add('opacity-100');
        modal.querySelector('div[class*="bg-dark-300"]').classList.remove('scale-95');
        modal.querySelector('div[class*="bg-dark-300"]').classList.add('scale-100');
    }, 10);
}

// 关闭紧急作业模态框
function closeUrgentModal() {
    const modal = document.getElementById('urgentModal');
    modal.classList.remove('opacity-100');
    modal.querySelector('div[class*="bg-dark-300"]').classList.remove('scale-100');
    modal.querySelector('div[class*="bg-dark-300"]').classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('hidden', 'pointer-events-none');
    }, 300);
}

// 检查紧急作业并显示提示
function checkUrgentHomework() {
    const urgentCount = getUrgentHomeworkCount();
    if (urgentCount > 0) {
        setTimeout(() => {
            showUrgentHomeworkNotification();
        }, 1000);
    }
}
