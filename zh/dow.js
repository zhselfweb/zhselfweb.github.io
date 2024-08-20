document.getElementById('downloadBtn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'zh.zip';
    link.download = '𝓏𝒽ℴ𝓊-名片源碼😎.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
