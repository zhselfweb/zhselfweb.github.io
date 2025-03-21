document.addEventListener('DOMContentLoaded', function() {
    const saveApiBtn = document.getElementById('saveApiBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const errorMessage = document.getElementById('errorMessage');
    
    // 檢查有無API Key
    const savedApiKey = localStorage.getItem('youtube_api_key');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    saveApiBtn.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            errorMessage.style.display = 'block';
            return;
        }
        
        // 簡單驗證API Key(長度 格式)
        if (apiKey.length < 30 || !apiKey.match(/^[A-Za-z0-9_-]+$/)) {
            errorMessage.style.display = 'block';
            return;
        }
        
        // 保存API Key到本地儲存
        localStorage.setItem('youtube_api_key', apiKey);
        
        // 跳轉
        window.location.href = 'analyze.html';
    });
    
    // 在輸入時隱藏錯誤消息
    apiKeyInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
}); 