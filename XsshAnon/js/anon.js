// https://script.google.com/macros/s/AKfycbznmbnT29h3-tikG_atswKL7Nwc8ADqy2KO0CZpRUaN/dev

const scriptURL = 'https://script.google.com/macros/s/AKfycbxXJ_gfnk2JJMvNjhJX5KKvXxx2Cvc4WUmKebhPagmLMIXpTVgg2JBc-vzR2sFcqaXRFg/exec';

    async function getRandomAvatar() {
        try {
            const response = await fetch('https://randomuser.me/api/portraits/med/men/' + Math.floor(Math.random() * 100) + '.jpg');
            return response.url;
        } catch (error) {
            console.error('無法獲取頭像:', error);
            return 'https://randomuser.me/api/portraits/med/men/1.jpg'; // 預設頭像
        }
    }

    // 隨機生成名稱，使用外部 API
    async function getRandomName() {
        try {
            const response = await fetch('https://api.randomuser.me/');
            const data = await response.json();
            return data.results[0].name.first;
        } catch (error) {
            console.error('無法獲取名字:', error);
            return '未知'; // 預設名字
        }
    }

    document.getElementById('submitButton').addEventListener('click', async function() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;

        if (message.trim() === '') {
            alert('留言不能為空！');
            return;
        }

        const avatarURL = await getRandomAvatar();
        const name = await getRandomName();

        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify({ message, avatarURL, name }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('留言提交成功！');
                messageInput.value = '';  // 清空輸入框
                loadMessages();  // 重新加載留言
            } else {
                alert('留言提交失敗！');
            }
        })
        .catch(error => {
            console.error('錯誤:', error);
            alert('提交過程中出錯！');
        });
    });

    function loadMessages() {
        fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.getElementById('messages');
            messageContainer.innerHTML = '';

            data.reverse().forEach(msg => { // 反轉數組，使最新的留言顯示在最上面
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');

                messageElement.innerHTML = `
                    <div class="message-info">
                        <div class="info">
                            <img src="${msg.avatarURL}" width="100" height="100" alt="隨機頭像">
                            <strong>${msg.name}</strong>
                        </div>
                        <span>${new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="content">
                        ${msg.message}
                    </div>
                `;

                messageContainer.appendChild(messageElement);
            });
        })
        .catch(error => {
            console.error('錯誤:', error);
        });
    }

    // 初次加載留言
    loadMessages();
