// 服務工作線程版本
const CACHE_VERSION = 'v1';
const CACHE_NAME = `homework-tracker-${CACHE_VERSION}`;

// 需要緩存的資源
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'js/data.js',
    'js/utils.js',
    'js/components.js',
    'js/notifications.js',
    'js/app.js',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
    'assets/icon-48.png',
    'assets/icon-180.png',
    'css/styles.css'
];

// 安裝階段 - 緩存靜態資源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('正在緩存資源');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活階段 - 清理舊緩存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('刪除舊緩存:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 請求階段 - 提供離線支持
self.addEventListener('fetch', (event) => {
    // 對於通知請求，直接轉發到網絡
    if (event.request.url.includes('https://fcm.googleapis.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // 其他請求使用緩存優先策略
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 緩存中有則返回，否則請求網絡
                return response || fetch(event.request).catch(() => {
                    // 網絡請求失敗時的處理
                    if (event.request.mode === 'navigate') {
                        return caches.match('index.html');
                    }
                });
            })
    );
});

// 處理來自頁面的消息
self.addEventListener('message', (event) => {
    if (event.data.type === 'CHECK_NOTIFICATIONS') {
        // 檢查即將到期的作業並發送通知
        checkAndSendNotifications(event.data.homeworkData);
    }
});

// 檢查即將到期的作業並發送通知
function checkAndSendNotifications(homeworkData) {
    if (!homeworkData || !homeworkData.length) return;
    
    const now = new Date();
    const notifications = [];
    
    // 檢查每個作業是否即將到期
    homeworkData.forEach(homework => {
        if (homework.isCompleted) return; // 跳過已完成的作業
        
        const dueDate = new Date(homework.dueDate);
        const timeDiff = dueDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // 檢查是否在24小時內且尚未過期
        if (hoursDiff > 0 && hoursDiff <= 24) {
            notifications.push({
                id: homework.id,
                title: `作業即將截止: ${homework.title}`,
                body: `剩餘${Math.ceil(hoursDiff)}小時，記得完成作業！`,
                icon: 'assets/icon-48.png',
                data: { homeworkId: homework.id }
            });
        }
    });
    
    // 發送通知
    notifications.forEach(notification => {
        // 使用作業ID作為標記，避免重複通知
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            data: notification.data,
            tag: `homework-${notification.id}`,
            renotify: false,
            requireInteraction: false,
            timestamp: Date.now()
        });
    });
}

// 處理通知點擊事件
self.addEventListener('notificationclick', (event) => {
    // 關閉通知
    event.notification.close();
    
    // 打開應用並導航到相關作業
    const homeworkId = event.notification.data?.homeworkId;
    let urlToOpen = '/';
    
    if (homeworkId) {
        urlToOpen = `/?homework=${homeworkId}`;
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                if (clientList.length > 0) {
                    const client = clientList.find(c => c.visibilityState === 'visible');
                    if (client) {
                        return client.navigate(urlToOpen);
                    }
                    return clientList[0].focus();
                }
                return clients.openWindow(urlToOpen);
            })
    );

});
