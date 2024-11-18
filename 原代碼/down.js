document.getElementById('xssh-anon').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'https://drive.usercontent.google.com/uc?id=1ZEFyKYk5fT4nBzwnbLvUyK-fO2iy6RkO&export=download';
    link.download = 'xssh原碼.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
