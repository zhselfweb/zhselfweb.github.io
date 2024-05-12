from flask import Flask, render_template, request, redirect, send_file
from pytube import YouTube

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    yt_url = request.form['yt_url']
    try:
        yt = YouTube(yt_url)
        if request.form['download'] == '下載為 MP4':
            video = yt.streams.get_highest_resolution()
            video.download(filename='C:\\Users\\b2555\\OneDrive\\桌面\\yt下載\\video.mp4')
            return send_file('C:\\Users\\b2555\\OneDrive\\桌面\\yt下載\\video.mp4', as_attachment=True)
        elif request.form['download'] == '下載為 MP3':
            audio = yt.streams.filter(only_audio=True).first()
            audio.download(filename='C:\\Users\\b2555\\OneDrive\\桌面\\yt下載\\audio.mp3')
            return send_file('C:\\Users\\b2555\\OneDrive\\桌面\\yt下載\\audio.mp3', as_attachment=True)
    except Exception as e:
        return f"發生錯誤：{e}"

if __name__ == '__main__':
    app.run(debug=True)

