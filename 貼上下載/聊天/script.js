document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messageBox = document.getElementById('message-box');
    const imageInput = document.getElementById('image-input');

    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            addMessage(text);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                const url = URL.createObjectURL(blob);
                addMessage(`<img src="${url}" alt="Pasted Image">`);
            }
        }
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            addMessage(`<img src="${url}" alt="Uploaded Image">`);
        }
    });

    function addMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = content;
        messageBox.appendChild(messageDiv);
        messageBox.scrollTop = messageBox.scrollHeight;
    }
});
