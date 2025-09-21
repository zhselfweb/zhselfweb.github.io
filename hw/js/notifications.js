// 更新通知徽章
function updateNotificationBadge() {
    if (!serviceWorkerRegistration) return;
    
    const now = new Date();
    const urgentCount = homeworkData.filter(homework => 
        !homework.isCompleted && 
        isUrgent(homework.dueDate)
    ).length;
    
    // 更新界面徽章
    const badgeElement = document.getElementById('notificationBadge');
    if (urgentCount > 0) {
        badgeElement.classList.remove('hidden');
    } else {
        badgeElement.classList.add('hidden');
    }
    
    // 更新應用徽章（支持的瀏覽器）
    if ('setAppBadge' in serviceWorkerRegistration) {
        if (urgentCount > 0) {
            serviceWorkerRegistration.setAppBadge(urgentCount).catch(err => {
                console.log('設置應用徽章失敗:', err);
            });
        } else {
            serviceWorkerRegistration.clearAppBadge().catch(err => {
                console.log('清除應用徽章失敗:', err);
            });
        }
    }
}

// 初始化通知
async function initNotifications() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            window.serviceWorkerRegistration = registration;
            
            // 请求通知权限
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('通知权限已授予');
                updateNotificationBadge();
                
                // 检查即将到期的作业并发送通知
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'CHECK_NOTIFICATIONS',
                        homeworkData: homeworkData
                    });
                }
            }
        } catch (error) {
            console.error('初始化通知失败:', error);
        }
    }
}