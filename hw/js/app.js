// 配置Tailwind
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#6366f1', // 主色：靛藍色
                secondary: '#a855f7', // 次要色：紫色
                accent: '#f43f5e', // 強調色：粉紅色
                success: '#10b981', // 成功色：綠色
                warning: '#f59e0b', // 警告色：黃色
                dark: {
                    100: '#374151',
                    200: '#1f2937',
                    300: '#111827',
                    400: '#030712',
                },
                light: {
                    100: '#f9fafb',
                    200: '#f3f4f6',
                    300: '#e5e7eb',
                }
            },
            fontFamily: {
                sans: ['Noto Sans TC', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-out': 'fadeOut 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-down': 'slideDown 0.3s ease-out',
                'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-soft': 'pulseSoft 2s infinite',
                'pulse-urgent': 'pulseUrgent 1.5s infinite',
                'scale-in': 'scaleIn 0.3s ease-out',
                'scale-out': 'scaleOut 0.3s ease-in',
                'bounce-light': 'bounceLight 0.6s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(20px)', opacity: '0' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                pulseUrgent: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.03)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleOut: {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(0.95)', opacity: '0' },
                },
                bounceLight: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        }
    }
}

// 全局变量
let currentFilter = 'all';
let currentDateFilter = 'all';
let currentView = 'home';
let currentWeek = new Date();
const STORAGE_KEY = 'homework_completion_status'; // 本地存储键名
let serviceWorkerRegistration = null;

// 初始化应用
function initApp() {
    // 从本地存储加载完成状态
    loadCompletionStatus();
    
    // 渲染UI组件
    renderSubjectFilters();
    renderDateFilters();
    renderHomeworkLists();
    renderCalendar();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化通知
    initNotifications();
    
    // 检查并显示即将截止的作业通知
    checkUrgentHomework();

       
    // 处理PWA安装提示
    let deferredPrompt;
    const installPrompt = document.getElementById('installPrompt');
    const installAppBtn = document.getElementById('installApp');

    window.addEventListener('beforeinstallprompt', (e) => {
        // 阻止浏览器默认的安装提示
        e.preventDefault();
        // 保存事件以备后用
        deferredPrompt = e;
        // 显示安装提示按钮
        installPrompt.classList.remove('hidden');
    });

    // 安装按钮点击事件
    installAppBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            // 显示安装提示
            deferredPrompt.prompt();
            // 等待用户选择
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`選擇: ${outcome}`);
            // 重置安装提示
            deferredPrompt = null;
            // 隐藏安装按钮
            installPrompt.classList.add('hidden');
        }
    });

    // 安装完成后隐藏提示
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
        showToast('\(￣︶￣*\))', '\(￣︶￣*\))');
    });
}



// 从本地存储加载完成状态
function loadCompletionStatus() {
    try {
        const savedStatus = localStorage.getItem(STORAGE_KEY);
        if (savedStatus) {
            const statusMap = JSON.parse(savedStatus);
            
            // 将保存的状态应用到作业数据
            homeworkData.forEach(homework => {
                if (statusMap.hasOwnProperty(homework.id)) {
                    homework.isCompleted = statusMap[homework.id];
                }
            });
        }
    } catch (error) {
        console.error('加载作业状态失败:', error);
        // 失败时不影响应用运行，使用默认状态
    }
}

// 保存完成状态到本地存储
function saveCompletionStatus() {
    try {
        // 创建只包含id和完成状态的对象
        const statusMap = {};
        homeworkData.forEach(homework => {
            statusMap[homework.id] = homework.isCompleted;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));
    } catch (error) {
        console.error('保存作业状态失败:', error);
        showToast('無法保存作業狀態，請稍後再試', 'error');
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 搜索框切换
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', () => {
        if (searchContainer.classList.contains('-translate-y-full')) {
            searchContainer.classList.remove('-translate-y-full');
            setTimeout(() => searchInput.focus(), 300);
            searchContainer.classList.add('animate-slide-down');
            setTimeout(() => {
                searchContainer.classList.remove('animate-slide-down');
            }, 400);
        } else {
            searchContainer.classList.add('animate-slide-up');
            setTimeout(() => {
                searchContainer.classList.add('-translate-y-full');
                searchContainer.classList.remove('animate-slide-up');
                searchInput.blur();
            }, 300);
        }
    });
    
    // 通知按钮 - 添加波纹效果
    const notificationsBtn = document.getElementById('notificationsBtn');
    notificationsBtn.addEventListener('click', (e) => {
        addRippleEffect(e, notificationsBtn);
        setTimeout(() => {
            showUrgentHomeworkNotification();
        }, 200);
    });
    
    // 关闭模态框按钮
    document.getElementById('closeModal').addEventListener('click', () => {
        closeDetailModal();
    });
    
    // 关闭紧急作业模态框
    document.getElementById('closeUrgentModal').addEventListener('click', () => {
        closeUrgentModal();
    });
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 10) {
            header.classList.add('py-2', 'shadow-md', 'shadow-black/20');
            header.classList.remove('py-3');
        } else {
            header.classList.add('py-3');
            header.classList.remove('py-2', 'shadow-md', 'shadow-black/20');
        }
    });
    
    // 搜索功能 - 实时反馈
    searchInput.addEventListener('input', (e) => {
        const searchIcon = document.querySelector('#searchContainer i');
        searchIcon.classList.add('animate-bounce-light');
        setTimeout(() => {
            searchIcon.classList.remove('animate-bounce-light');
        }, 600);
        
        filterBySearch(e.target.value);
    });
    
    // 视图切换 - 添加过渡动画
    document.getElementById('homeNav').addEventListener('click', (event) => {
        if (currentView !== 'home') {
            addRippleEffect(event, document.getElementById('homeNav'));
            switchView('home');
        }
    });
    
    document.getElementById('calendarNav').addEventListener('click', (event) => {
        if (currentView !== 'calendar') {
            addRippleEffect(event, document.getElementById('calendarNav'));
            switchView('calendar');
        }
    });
    
    // 日历导航 - 添加动画
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    
// 修改prevWeek和nextWeek的点击事件处理
prevWeekBtn.addEventListener('click', (event) => {
    addRippleEffect(event, prevWeekBtn);
    const calendarGrid = document.getElementById('calendarGrid');
    
    // 添加退出动画
    calendarGrid.classList.add('calendar-slide-exit');
    
    setTimeout(() => {
        currentWeek.setDate(currentWeek.getDate() - 7);
        // 清除动画类并添加进入动画
        calendarGrid.classList.remove('calendar-slide-exit');
        renderCalendar(currentWeek);
        calendarGrid.classList.add('calendar-slide-reverse-enter');
        
        // 动画结束后移除类
        setTimeout(() => {
            calendarGrid.classList.remove('calendar-slide-reverse-enter');
        }, 400);
    }, 300);
});

nextWeekBtn.addEventListener('click', (event) => {
    addRippleEffect(event, nextWeekBtn);
    const calendarGrid = document.getElementById('calendarGrid');
    
    // 添加退出动画
    calendarGrid.classList.add('calendar-slide-out-reverse');
    
    setTimeout(() => {
        currentWeek.setDate(currentWeek.getDate() + 7);
        // 清除动画类并添加进入动画
        calendarGrid.classList.remove('calendar-slide-out-reverse');
        renderCalendar(currentWeek);
        calendarGrid.classList.add('calendar-slide-enter');
        
        // 动画结束后移除类
        setTimeout(() => {
            calendarGrid.classList.remove('calendar-slide-enter');
        }, 400);
    }, 300);
});
}


// 按日期筛选作业
function filterByDate(dateStr) {
    currentDateFilter = dateStr;
    renderDateFilters(); // 重新渲染日期筛选按钮以更新高亮状态
    renderHomeworkLists(); // 重新渲染作业列表
}

// 添加波纹点击效果
function addRippleEffect(event, element) {
    // 创建波纹元素
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // 设置波纹样式
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size/2}px`;
    ripple.style.top = `${event.clientY - rect.top - size/2}px`;
    ripple.classList.add('ripple');
    
    // 添加到元素并自动移除
    element.appendChild(ripple);
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 opacity-0`;
    
    // 根据类型设置样式
    switch(type) {
        case 'success':
            toast.classList.add('bg-success', 'text-white');
            toast.innerHTML = `<i class="fa fa-check-circle mr-2"></i>${message}`;
            break;
        case 'error':
            toast.classList.add('bg-accent', 'text-white');
            toast.innerHTML = `<i class="fa fa-times-circle mr-2"></i>${message}`;
            break;
        case 'warning':
            toast.classList.add('bg-warning', 'text-white');
            toast.innerHTML = `<i class="fa fa-exclamation-triangle mr-2"></i>${message}`;
            break;
        default:
            toast.classList.add('bg-dark-200', 'text-light-100');
            toast.innerHTML = `<i class="fa fa-info-circle mr-2"></i>${message}`;
    }
    
    // 添加到页面并显示
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-100');
        toast.classList.add('bottom-8');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('opacity-100');
        toast.classList.remove('bottom-8');
        toast.classList.add('bottom-6');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}