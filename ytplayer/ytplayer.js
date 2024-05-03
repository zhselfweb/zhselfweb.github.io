$(document).ready(function() {
    $('#toggleButton').click(function() {
        var playerWrapperPosition = $('#playerWrapper').css('position');
        var borderContainerPosition = $('.border-container').css('position');

        if (playerWrapperPosition === 'fixed') {
            $('#playerWrapper, .border-container').css('position', 'absolute');
        } else {
            $('#playerWrapper, .border-container').css('position', 'fixed');
        }
    });
});

document.getElementById("back-to-top-btn").addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


function playVideo() {
    var url = document.getElementById('videoURL').value;
    var videoId = getYouTubeID(url);
    if (videoId !== null) {
        var playerDiv = document.getElementById('player');
        playerDiv.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
        playerDiv.classList.add('show');
    } else {
        alert('請輸入有效的 YouTube 影片網址！');
    }
}

function getYouTubeID(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length === 11) {
        return match[2];
    } else {
        return null;
    }
}

function addSongToTable(songName, songLink) {
    var table = document.getElementById('songTable').getElementsByTagName('tbody')[0];

    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = '<a href="' + songLink + '" target="_blank">' + songName + '</a>';
    cell2.innerHTML = '<button onclick="copyLink(\'' + songLink + '\')">複製連結</button>';
}

function copyLink(link) {
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = link;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

function playSong(songLink) {
    var songId = getYouTubeID(songLink);

    var playerDiv = document.getElementById('player');
    playerDiv.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + songId + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
    playerDiv.classList.add('show');
}


function addSongToTable(songName, songLink) {
    var table = document.getElementById('songTable').getElementsByTagName('tbody')[0];

    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = '<a href="' + songLink + '" target="_blank">' + songName + '</a>';
    cell2.innerHTML = '<button onclick="copyLink(\'' + songLink + '\')">複製連結</button>';
    cell3.innerHTML = '<button onclick="playSong(\'' + songLink + '\')">播放影片</button>';
}



// 當輸入框內容改變時執行搜尋
var delayTimer; // 延遲計時器

document.getElementById('searchInput').addEventListener('input', function() {
    clearTimeout(delayTimer); // 清除之前的計時器

    delayTimer = setTimeout(function() {
        var keyword = this.value.trim().toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, ''); // 去除空格
        searchSongs(keyword);
    }.bind(this), 50); // 設定延遲時間為 300 毫秒
});

function searchSongs(keyword) {
    var rows = document.getElementById('songList').getElementsByTagName('tr');
    Array.from(rows).forEach(function(row) {
        var songName = row.getElementsByTagName('td')[0].innerText.toLowerCase().replace(/[^\w\s\u4E00-\u9FFF]/g, '').replace(/\s/g, ''); // 去除空格
        row.style.display = songName.includes(keyword) ? '' : 'none';
    });
}









addSongToTable("【AMV】SPYAIR - オレンジ (ORANGE) 《排球少年！！ 垃圾場的決戰》 劇場版主題曲 【中日歌詞字幕】", "https://www.youtube.com/watch?v=f_XHSsI9wBI");
addSongToTable("SPYAIR - オレンジ(Orange)《劇場版排球少年!!垃圾場的決戰》電影主題曲【中日歌詞】", "https://www.youtube.com/watch?v=ffiZaVU23tc");
addSongToTable("王巨星 - 画 (Cover: G.E.M.邓紫棋)【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=tN_Bf6ijOfE");
addSongToTable("池魚 - 畫心（完整版）「愛著你像心跳難觸摸 畫著你畫不出你的骨骼」【動態歌詞】♪", "https://www.youtube.com/watch?v=ZkvEcEw0D1A");
addSongToTable("周兴哲单依纯《永不失联的爱》  原唱和翻唱的梦幻合体！纯享 | ZJSTV #Music #live", "https://www.youtube.com/watch?v=Umz_2fYtYpY");
addSongToTable("lil/MILK - Moonlight『你的笑容像是我昨晚的moonlight（月光）』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=VmUxPayaTAA");
addSongToTable("胡夏 Xia Hu - Those Bygone Years 那些年", "https://www.youtube.com/watch?v=KqjgLbKZ1h0");
addSongToTable("K.D 翻唱《擱淺》【我只能永遠讀著對白，讀著我給妳的傷害...】♫周傑倫《擱淺》", "https://www.youtube.com/watch?v=Lpfp7klFOaY");
addSongToTable("趙乃吉 - 當 (原唱:動力火車)『讓我們紅塵作伴活得瀟瀟灑灑，策馬奔騰共享人世繁華。』【高音質|動態歌詞Lyrics】♫ · 翻唱歌曲", "https://www.youtube.com/watch?v=7H1DZyckZpY");
addSongToTable("【HD】金玟岐 - 歲月神偷 [歌詞字幕][電影《北京愛情故事》主題曲][完整高清音質] Beijing Love Story Theme Song : Travel in Time", "https://www.youtube.com/watch?v=lR1WgXLllq4");
addSongToTable("劉人語 心跳的證明 歌詞", "https://www.youtube.com/watch?v=HfJDdxSWfnU");
addSongToTable("Giveon - Heartbreak Anniversary (Lyrics)", "https://www.youtube.com/watch?v=KK3E56xc0as");
addSongToTable("忘記你", "https://www.youtube.com/watch?v=S9CoQioeBD0");
addSongToTable("周杰倫 擱淺 歌詞（繁體中文）", "https://www.youtube.com/watch?v=Up59Y0U11uY");
addSongToTable("Architect", "https://www.youtube.com/watch?v=QkNzZUVToyM");
addSongToTable("承桓 - 丟掉天分『後來我丟掉取悅你的天分，但這件事我曾比誰都認真。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=9AcBlzom0fQ");
addSongToTable("在加納共和國離婚", "https://www.youtube.com/watch?v=eACpNen3ZcI");
addSongToTable("en - 在加納共和國離婚『只是覺得努力了那麽久，最後卻還是敗給不適合。』【高音質|動態歌詞Lyrics】♫ · 翻唱歌曲 (原唱:菲道爾/Dior大穎)", "https://www.youtube.com/watch?v=Dy0Uu0VcQw4");
addSongToTable("ILLIT (아일릿) ‘Magnetic’ Official MV", "https://www.youtube.com/watch?v=Vk5-c_v4gMU");
addSongToTable("趙雷 -《無法長大》- 成都 MV (高圓圓出演)", "https://www.youtube.com/watch?v=MAXeCR7iNmU");
addSongToTable("廬州月", "https://www.youtube.com/watch?v=KWEWyewO3mg");
addSongToTable("蔡依林 & 陶喆  今天你要嫁給我《歌詞》", "https://www.youtube.com/watch?v=RZ2WRJnSAyY");
addSongToTable("盧廣仲 Crowd Lu 【幾分之幾 You Complete Me】 Official Music Video （花甲大人轉男孩電影主題曲）", "https://www.youtube.com/watch?v=HQ_mU73VhEQ");
addSongToTable("都是weather你", "https://www.youtube.com/watch?v=wDDvtyeXy4g");
addSongToTable("言瑾羽 - 未必『孤獨的島 躺在大海的懷抱，自由的鳥 愛上遠方的困擾，誰先爭吵 未必就是誰胡鬧，眼前的一切就是如此的奇妙。』【動態歌詞MV】", "https://www.youtube.com/watch?v=vTDvi1Au4f4");
addSongToTable("★南方姑娘-趙雷★南方姑娘，你是否習慣北方的秋涼，南方姑娘，你是否喜歡北方人的直爽【動態歌詞Lyric】", "https://www.youtube.com/watch?v=1xUH7XbFWQU");
addSongToTable("董又霖 - 一個人去巴黎『怎麼放下兩個人的記憶....』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=VF7DiE12wFM");
addSongToTable("張齊山ZQS - 這是你期盼的長大嗎『你很失望吧，大人的世界不快樂吧。』【高音質|動態歌詞Lyrics】♫ Is this what you expected grew up?", "https://www.youtube.com/watch?v=nlYskBsMbmE");
addSongToTable("陳村長 - 愛怎麼了『怎麼我 比想像中脆弱得多』【Lyrics Video】", "https://www.youtube.com/watch?v=yjf2Doys0nk");
addSongToTable("梁靜茹 Fish Leong - 慢冷 Slow-To-Cool-Down【慢冷的人啊，會自我折磨】[ 歌詞 ]", "https://www.youtube.com/watch?v=2LuW7acW9B8");
addSongToTable("於冬然 - 身騎白馬「而你卻 靠近了 逼我們視線交錯 原地不動 或向前走」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=UD4oCnle-70");
addSongToTable("黃氏兄弟【不專心】首張單曲MV ｜ Official Music Video", "https://www.youtube.com/watch?v=0GzLgn2fgcI");
addSongToTable("【小玉】沒用的大學生【高三症候群主題曲】Offical MV", "https://www.youtube.com/watch?v=ttcl8qKDL8A");
addSongToTable("【单曲纯享】李荣浩导师大秀演唱《慢冷》 情歌舞台氛围感拉满【2022中国好声音】EP1 Sing！China20220805", "https://www.youtube.com/watch?v=66e50-LWLmE");
addSongToTable("Li-2c - 爱一点 (新版)『我想说我会爱你多一点点 一直就在你的耳边。』【動態歌詞】♪", "https://www.youtube.com/watch?v=WkfZ0t9wDXI");
addSongToTable("纯享丨GAI周延/吉克隽逸合唱《问风》 两人互换眼神故事感拉满 #天赐的声音3 EP1 20220311", "https://www.youtube.com/watch?v=NYgcBxfRWQA");
addSongToTable("yihuik苡慧 - 專屬天使（原唱：TANK）【動態歌詞】「沒有誰能把你搶離我身旁 你是我的專屬天使 唯我能獨佔」♪", "https://www.youtube.com/watch?v=U1n_lWOaw4g");
addSongToTable("王晴 - 還是錯過他『我們熬過幾個冬夏還是錯過啊，我為你犯的傻 你會不會講給她。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=hm7Qw3yKclg");
addSongToTable("晚夜微雨问海棠 - 镜予歌/喧笑/陈亦洺【爱恨此消彼长 停步回望 我陪你同往】《二哈和他的白猫师尊》古风 中国风 抖音 中文歌曲 华语歌曲 | Chinese Song, Chinese Music", "https://www.youtube.com/watch?v=vI8wLPH8rvk");
addSongToTable("家家 - 家家酒『動態歌詞』我們 是真的愛嗎 我想問我自己嗎 要是像 家家酒 想要家 就有個家 那該有多好呀# 極品絕配片尾曲", "https://www.youtube.com/watch?v=FjhqHeJ98aI");
addSongToTable("GooGoo - 可能是風太大了吧『是我太差了吧 所以不能把你給擁有，很遺憾我來的不是時候 只好默默的接受。』【動態歌詞MV】", "https://www.youtube.com/watch?v=RAfhUQQ2s3o");
addSongToTable("王子明/WYAN王毓千 - 計劃裡『我已拼盡我的全力 拼盡我全力都無法把你抱緊，我們的未來就是被你從計劃抹去。』【動態歌詞MV】", "https://www.youtube.com/watch?v=4KQy3T21wmo");
addSongToTable("我知道-BY2【我知道你还是爱着我 虽然分开的理由 我们都已接受】动态歌词", "https://www.youtube.com/watch?v=Gq-9iqrKz7U");
addSongToTable("林凡 Freya Lim【五天幾年 5 days】Official Music Video", "https://www.youtube.com/watch?v=PtrIG-4ulTE");
addSongToTable("WiFi歪歪 - 我知道（原唱：By2）『我知道你還是愛著我，雖然 分開的理由我們都已接受。』【動態歌詞MV】", "https://www.youtube.com/watch?v=9825Txn6lLw");
addSongToTable("小蓝背心 - 风错过雨 【风紧紧追着雨 看过人间四季】", "https://www.youtube.com/watch?v=O3nxr4vBUbE");
addSongToTable("就是南方凱 - 《離別開出花》「當離別開花 伸出新長的枝椏 像冬去春又來 等待心雪融化」「動態歌詞 𝄞」", "https://www.youtube.com/watch?v=GTuJL4fjiqo");
addSongToTable("曾瑋中『必巡』／Official Music Video／收錄在曾瑋中『總會有一工』專輯", "https://www.youtube.com/watch?v=X06y7ZuT7_Y");
addSongToTable("PPlin x XIANG  想了不只幾百次(Official Music Video)", "https://www.youtube.com/watch?v=LRei6WdbVAI");
addSongToTable("Bu$Y & Ye!!ow , Paper Jim - 【戀曲2020 LOVE SONG 2020】Chapter 1 (Official Music Video)", "https://www.youtube.com/watch?v=2oZr3uv_ddc");
addSongToTable("許嵩 - 天龍八部之宿敵『當恩怨各一半 我怎麼圈攬』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=QgUshNyWC8E");
addSongToTable("李榮浩 Li Ronghao / 李白【歌詞】", "https://www.youtube.com/watch?v=xbwqkqv5ljo");
addSongToTable("劉大壯 - 最『想用盡全身的力氣 來挽救這份感情』【Lyrics Video】", "https://www.youtube.com/watch?v=ktaNd2oMmEo");
addSongToTable("热恋夏季 (抒情版)", "https://www.youtube.com/watch?v=3AtAufecosU");
addSongToTable("｛高品质/动态音频可视化｝《姑娘别哭泣》~柯柯柯啊", "https://www.youtube.com/watch?v=keZJE_cShy8");
addSongToTable("江皓南 - 大人「不知不覺我們變成曾嚮往的大人」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=aaPA7yR1c6I");
addSongToTable("直到你降临", "https://youtu.be/7349tcyyE-c?si=amVXRwbq1eDuiGI4");
addSongToTable("Yu Ai", "https://www.youtube.com/watch?v=MirexJxv9PE");
addSongToTable("Best Friend", "https://www.youtube.com/watch?v=XHfEdr2rhoU");
addSongToTable("Abba - Money, Money, Money (Official Music Video)", "https://www.youtube.com/watch?v=ETxmCCsMoD0");
addSongToTable("陳粒-虛擬『你是我未曾拥有无法捕捉的亲昵』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=9SOazsnVVCk");
addSongToTable("【纯享版】终于等到了张碧晨Solo版《字字句句》！  独特哭腔“字字句句”都让人心碎  2023-2024浙江卫视跨年晚会 20231231", "https://www.youtube.com/watch?v=urjRUdZuT50");
addSongToTable("承桓 - 吹安靜的風「吹安靜的風 你安靜的走 我突然好想你 用什麼自救 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=IOyUD-Vo0gE");
addSongToTable("劉大壯 - 我很好 (正式版)【高音質|動態歌詞Lyrics】♫『我很好只是偶爾遺憾會從眼裡掉，我很好怎麼拼命忘卻還是忘不掉。』", "https://www.youtube.com/watch?v=ucCz9tn8iUg");
addSongToTable("K.D 原創《被神明寫的歌》【唱首歌送給生命的過客，你聽著是否眼睛會濕呢...】♫", "https://www.youtube.com/watch?v=EkSft19RcMk");
addSongToTable("幻聽", "https://www.youtube.com/watch?v=qnpkllm_2QA");
addSongToTable("有何不可", "https://www.youtube.com/watch?v=_2f-7oQIS8M");
addSongToTable("張信哲   過火 無損音樂FLAC 歌詞LYRICS 純享", "https://www.youtube.com/watch?v=ECuVZlkae-4");
addSongToTable("Beau Young Prince - Let Go", "https://www.youtube.com/watch?v=4VvAUcJ2Yms");
addSongToTable("柯柯柯啊 - 姑娘在遠方「可能我總不會忘 愛來愛去哭一場 失去原本模樣」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=g3lxkkSHSZM");
addSongToTable("【单曲纯享】 刘宪华《有没有一首歌会让你想起我》 高音穿透力绝了【2023中国好声音】EP1 Sing！China 20230728", "https://www.youtube.com/watch?v=qNi2OEawvm0");
addSongToTable("这样的薛之谦很难不爱！高情商为搭档解围合唱林俊杰《江南》超好听！#music #薛之谦 #音乐", "https://www.youtube.com/watch?v=RH0AnvUuK9M");
addSongToTable("周華健 Wakin Chau【讓我歡喜讓我憂 You make me happy and sad】Official Music Video", "https://www.youtube.com/watch?v=vqTXMw9zdto");
addSongToTable("【单曲纯享】薛之谦《让我欢喜让我忧》 歌声中充满震撼人心的力量 【2023中国好声音】EP1 Sing！China 20230728", "https://www.youtube.com/watch?v=Wl5wAaX1_DU");
addSongToTable("【纯享】 #陈势安《#天后 》曾霸榜KTV多年，如今他带着这首歌从时光里走出来 |《时光音乐会•老友记》Time Concert • Old Friends Pure Version｜MangoTV", "https://www.youtube.com/watch?v=15d2w0EKuWM");
addSongToTable("張齊山（ZQS） - 平凡已是不凡『如果天黑了就對自己說晚安，天冷了就抱抱自己取暖。』【動態歌詞 | Pinyin Lyrics】【PENGUIN MUSIC】", "https://www.youtube.com/watch?v=A8eE4hNwKJE");
addSongToTable("派偉俊 Patrick Brasca '3am - Demo Ver.'", "https://www.youtube.com/watch?v=zuWd9Fs9A_k");
addSongToTable("星野 - 有備無份「可惜的是我們從未在一起 愛真是叫人盲目的東西」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=KXdPShX_TfQ");
addSongToTable("盧盧快閉嘴 / 劉思达LOFTHESTAR - 猜不透 (說唱版)「如果忽遠忽近的灑脫 是你要的自由 那我寧願回到一個人生活」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=O2qg33EnzeQ");
addSongToTable("张妙格 - 我期待的不是雪 (而是有你的冬天)『我期待的不是雪 而是有你的冬天，我期待的不是月 而是和你的遇见。』【動態歌詞】♪", "https://www.youtube.com/watch?v=-9UMdJTNswc");
addSongToTable("周杰倫Jay Chou X aMEI【不該 Shouldn't Be】Official MV", "https://www.youtube.com/watch?v=_VxLOj3TB5k");
addSongToTable("周杰倫-我是如此相信【歌詞】", "https://www.youtube.com/watch?v=ZtHVvjg9pes");
addSongToTable("王力宏 Wang Leehom : 電影《長城》片尾曲《緣分一道橋》MV", "https://www.youtube.com/watch?v=EQ5Ib7jNnnE");
addSongToTable("《时光音乐会3》青春记忆被激活 Youth memories are activated  Tank《三国恋》引大合唱leads to a chorus", "https://www.youtube.com/watch?v=RgliRDC13Yg");
addSongToTable("【纯享】张杰＆于文文《曹操》点燃全场！架子鼓配上电吉他舞台感炸裂｜声生不息宝岛季 EP4 Infinity and Beyond 2023 | MangoTV", "https://www.youtube.com/watch?v=PoVQ380Ol_I");
addSongToTable("【纯享版】华晨宇《好想爱这个世界啊》治愈系暖曲沁人心脾《歌手·当打之年》Singer2020 SinglesVersion【芒果TV音乐频道HD】", "https://www.youtube.com/watch?v=WCjC_f1A5SQ");
addSongToTable("治愈！厦门六中合唱团翻唱华晨宇《好想爱这个世界啊》", "https://www.youtube.com/watch?v=Z1Qj_Qa6IgQ");
addSongToTable("蔣雪兒&七叔- 莫問歸期【深情對唱版】「誰訣別相思成疾，莫問天涯也莫問歸期。」【動態歌詞/Pinyin Lyrics】", "https://www.youtube.com/watch?v=27Gqgxoka2o");
addSongToTable("【纯享版】太好哭了！胡彦斌&希林娜依高《负重一万斤长大》 用歌声描述成长故事 用音符传递治愈力量 #天赐的声音4 EP10", "https://www.youtube.com/watch?v=PndY1Xl37dU");
addSongToTable("JORKER XUE 薛之谦 2022 —的最佳歌曲 音乐播放列表 薛之谦 Joker Xue 金曲捞演唱合辑'''你還要我怎樣,演員,天外來物,醜八怪", "https://www.youtube.com/watch?v=r2I6o6gb2IA");
addSongToTable("en - 靜悄悄「世界突然變得好安靜 只剩心跳的聲音」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=yLuJ1GA_UWw");
addSongToTable("皓凡 - 迷人的危險（深情版）「他不配站在你眼前 你的痛怎能看不見」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=uoRu2dgK0z8");
addSongToTable("等什麼君 - 辭九門回憶『戲子多秋，可憐一處情深舊。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=SpAzIb026bs");
addSongToTable("【无损高音质】薛之谦 70首经典好听的歌曲合集 #薛之谦  #歌曲合集", "https://www.youtube.com/watch?v=dGNSD3uuxTA");
addSongToTable("天外来物-薛之谦〖你是不是我的，你像天外来物一样求之不得〗〖抖音超火🔥〗〖动态歌词〗", "https://www.youtube.com/watch?v=T4eqDMRnWfc");
addSongToTable("韓安旭 - 我害怕『我害怕身邊沒你 我害怕把你忘記，我害怕一個人醒來 在夜裡我又一次想你。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=Nz6yWC33dVk");
addSongToTable("周杰倫 青花瓷 歌詞", "https://www.youtube.com/watch?v=uf8HHCcbpFc");
addSongToTable("張韶涵-隱形的翅膀【歌詞完整版】", "https://www.youtube.com/watch?v=gXIgfiwTk90");
addSongToTable("光良 童話 歌詞", "https://www.youtube.com/watch?v=54gN7H9_FZk");
addSongToTable("於冬然 - 以朋友的身份「我們以朋友的身份 聊著戀人的天身邊有人向你追問」【動態歌詞】♪", "https://www.youtube.com/watch?v=9gOhPv0_iyk");
addSongToTable("[ 中英歌詞 ] Metro Boomin, The Weeknd, 21 Savage - Creepin'", "https://www.youtube.com/watch?v=DBM69IwGNn4");
addSongToTable("Love Yourself【愛妳自己】Justin Bieber  中文字幕", "https://www.youtube.com/watch?v=Jc2HRj8--M4");
addSongToTable("我只能离开 - 顏人中『一瞬间掉落的泪只想牵着你不放』【动态歌词Lyrics】", "https://www.youtube.com/watch?v=69ZH3sD-FfE");
addSongToTable("胡夏治愈演绎南拳妈妈《下雨天》，淋漓尽致表达思念", "https://www.youtube.com/watch?v=uKcByA-hPG8");
addSongToTable("Sasha Alex Sloan - Older (Lyric Video)", "https://www.youtube.com/watch?v=r1Fx0tqK5Z4");
addSongToTable("關喆 - 曾經你說（原唱：趙乃吉）『曾經你說看星空看日落不如看我的眼眸，我信以為真 換來了忘不掉的痛。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=aMlhBxDWhNs");
addSongToTable("Zac Efron, Zendaya -  Rewrite The Stars (Aquarius Remix)", "https://www.youtube.com/watch?v=ZIQoV8Pcv38");
addSongToTable("袁小葳/KyL3 - 別無所愛『後來我還是沒走出來 學你的習慣還是沒改，我們曾許過彼此未來 沒得到偏愛卻反受其害。』【動態歌詞MV】", "https://www.youtube.com/watch?v=yPIdiR3nlUA");
addSongToTable("不是花火呀 - 1022-比尔的歌 (青春版)(原唱：Bomb比尔)「他们说今晚的夜色很好，应该有个人对我来撒娇」(4k Video)【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=jHP8tQ8c3xw");
addSongToTable("Gym Class Heroes - Stereo Hearts - ft  Adam Levine [Lyrics/Vietsub]", "https://www.youtube.com/watch?v=Uk8AOATiT48");
addSongToTable("陳勢安 Andrew Tan - 不如我們 Why Not Official MV", "https://www.youtube.com/watch?v=nzz5fem53Ho");
addSongToTable("陳勢安 Andrew Tan - 全世界我只想保護你 Loverboy Official MV", "https://www.youtube.com/watch?v=iJaM72pw1EM");
addSongToTable("【愛恨交織】gnash - i hate u, i love u ft. olivia o'brien 中英歌詞 |經典回顧|", "https://www.youtube.com/watch?v=myWg3joQh-E");
addSongToTable("楊馥伊 - 失戀音藥會『在座都盛裝狼狽來參加這場音藥會』【動態歌詞】", "https://www.youtube.com/watch?v=0nY2I9S0Bnw");
addSongToTable("張澤歷 - 沒有你以後『我學著一個人生活，在沒有你的以後。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=8qXBkLoNrj8");
addSongToTable("Gracie Abrams - I know it won’t work (Official Music Video)", "https://www.youtube.com/watch?v=vIalke0YE_Y");
addSongToTable("葛东琪 - 囍  (Chinese Wedding)「她笑着哭来着，你猜她怎么笑着哭来着」【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=AMEv4ncoQxg");
addSongToTable("葛東琪 - 懸溺『我主張制止不了就放任，餘溫她卻喜歡過門，臨走呢 還隨手關了燈。』【動態歌詞MV】", "https://www.youtube.com/watch?v=U9Z9X_YXaNY");
addSongToTable("邓典《神魂颠倒》【 神魂颠倒，迷恋着你神魂颠倒，是你踩碎我的解药。】动态歌词/lyrics", "https://www.youtube.com/watch?v=YtmTtH391L4");
addSongToTable("普通人生 - 海洋Bo   动态歌词/Lyrics", "https://www.youtube.com/watch?v=M-TBk0g9yU8");
addSongToTable("Jeremy Zucker - comethru (中/英歌词)『Now I'm shaking, drinking all this coffee。』【動態歌詞】♪", "https://www.youtube.com/watch?v=on7DvcC0Ygg");
addSongToTable("Linkin Park - In The End (Mellen Gi & Tommee Profitt Remix)", "https://www.youtube.com/watch?v=WNeLUngb-Xg");
addSongToTable("Sasha  Sloan莎夏·斯隆 －dancing with your ghost 與你的靈魂共舞（中英歌詞）", "https://www.youtube.com/watch?v=EeDs7thtVpw");
addSongToTable("Olly Murs - That Girl (Lyric Video)", "https://www.youtube.com/watch?v=3q2IXr6fjh0");
addSongToTable("SLANDER - Love Is Gone ft. Dylan Matthew (Acoustic)", "https://www.youtube.com/watch?v=hCrtcVDgCGw");
addSongToTable("李二萌 - 我在财神殿里长跪不起 ▣从此没有爱情可以但没钱真不行▣ ♬【動態歌詞/Lyrics】♬", "https://www.youtube.com/watch?v=ixrojn63tHQ");
addSongToTable("一首超燃的英文歌：就算你繼續懷疑我，我仍會像個軍人般，舉起槍枝面對一切！【中文翻譯】", "https://www.youtube.com/watch?v=8C40QncdWFo");
addSongToTable("April Encounter - 很美味『想在一个美好的晚上 写这一首歌来给你唱』【動態歌詞】", "https://www.youtube.com/watch?v=RetuPVJPr1g");
addSongToTable("〓 Take Me Home  Country Roads 《鄉村小路帶我回家》－John Denver－歌詞版中文字幕〓", "https://www.youtube.com/watch?v=UFarTDONR48");
addSongToTable("封茗囧菌 - 去你妹的撩妹【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=2-qNsutDglc");
addSongToTable("向云端 - 小霞/海洋Bo   动态歌词/Lyrics", "https://www.youtube.com/watch?v=sokq7y4Go8E");
addSongToTable("海來阿木 - 過路的晚風『我想問問天上的月亮你是否擁有哀愁 是否掏心掏肺對誰你都毫無保留』【動態歌詞】", "https://www.youtube.com/watch?v=FVGFH3JOUS0");
addSongToTable("一千零一個夜晚-魏晗（懋懋）/ATK『最後是合適的人躺在了身邊 最愛的人藏進黑名單裡面 說起還會喜歡提起全是遺憾』#一千零一個夜晚 #ATK /魏晗（懋懋） #Guozhanmusicchannel", "https://www.youtube.com/watch?v=QaY-skxAiEY");
addSongToTable("呂口口 - 失憶『好像是每個人都拖著舊行李』【動態歌詞】", "https://www.youtube.com/watch?v=WyhXA6cRrKU");
addSongToTable("游山恋 | 遊山戀 - 海伦【我欲迎风在留住几步 怎舍寒风吹动我痛处】古风 中国风 抖音 中文歌曲 华语歌曲 | Chinese Song, Chinese Music", "https://www.youtube.com/watch?v=lpeAF7i3svw");
addSongToTable("梓蕙 - 不是錯過是路過「我有什麼錯分手都是你說 離開你是被迫痛我閉口不說」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=91EQ3t5av_E");
addSongToTable("K.D 翻唱《給我一首歌時間》【能不能給我一首歌的時間，把故事聽到最後才說再見...】♫", "https://www.youtube.com/watch?v=srepAgPQ9Vw");
addSongToTable("| Minecraft | 苦力怕「你突然出現就像苦力怕帶給我驚喜，雖然早知會受傷但我還是願意和你」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=6AahdPRYFUE");
addSongToTable("周星星 - 毒藥『這次我不想逃 喝掉失憶毒藥，腦海倒敘你的微笑 。』【高音質|動態歌詞Lyrics】♫ · 翻唱歌曲 (原唱:皮卡潘)", "https://www.youtube.com/watch?v=l5iZK7w309Y");
addSongToTable("薛之謙 Joker Xue【像風一樣】HD 高清官方完整版 MV", "https://www.youtube.com/watch?v=YKqy1cAurRY");
addSongToTable("袁小葳 - 你這個人『怪我讓你一次次一次次放任，最終讓我們 由愛到生恨。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=LKXEz-XNN7I");
addSongToTable("郭頂《淒美地 The Fog Space》官方版 MV", "https://www.youtube.com/watch?v=NXpIQSdX_wQ");
addSongToTable("One Direction - What Makes You Beautiful (Lyrics)", "https://www.youtube.com/watch?v=nXNdaMnEQDs");
addSongToTable("梁靜茹 - 情歌『你寫給我 我的第一首歌，你和我 十指緊扣 默寫前奏可是那然後呢。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=Gp845TjBuF8");
addSongToTable("盧盧快閉嘴 - 我走後【原唱:小咪】【動態歌詞】「我走了 你別再難過 心裹有話都不想再說」♪", "https://www.youtube.com/watch?v=iBh74i1k09k");
addSongToTable("薛之謙 Joker Xue【違背的青春】HD 高清官方完整版 MV", "https://www.youtube.com/watch?v=zirEKcNH9LE");
addSongToTable("《违背的青春》#薛之谦#锤娜丽莎 — 被锤锤的声音惊艳到了！加入循环播放列表~【百视TV音乐频道】", "https://www.youtube.com/watch?v=JVA3uKxNHpI");
addSongToTable("林宝馨 - 让风告诉你 (原唱：花玲 / 喵☆酱 / 宴宁 / kinsen)「当你的天空突然下起了大雨，那是我在为你炸乌云」(4k Video)【動態歌詞/pīn yīn gē cí】#林宝馨 #让", "https://www.youtube.com/watch?v=-P_0HU1BfEk");
addSongToTable("安蘇羽 - 缺氧【動態歌詞】", "https://www.youtube.com/watch?v=n8GXI3MNOQs");
addSongToTable("纯享：单依纯《不值得》尝试抒情rap全新挑战 人间清醒纯姐潇洒挥别感情中的“不值得” | 爆裂舞台 EP09 | Stage Boom | iQiyi精选", "https://www.youtube.com/watch?v=Df3v6u2nZTY");
addSongToTable("Backstreet Boys - I Want It That Way (Lyrics)", "https://www.youtube.com/watch?v=qjlVAsvQLM8");
addSongToTable("DP 龍豬/王雲宏/陷阱表哥 - 翠花「沒收到你的消息我會傷心聽了村長說你要相親 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=fbFucBKdiwA");
addSongToTable("谭维维 - 与你 (《斗罗大陆》OST动画插曲) 『世间万千，不及你的一切』♫【无损高音质｜动态歌词字幕Lyrics】", "https://www.youtube.com/watch?v=KS7rPekaaWM");
addSongToTable("封茗囧菌 & 洛少爺 - 不得不愛（Cover：潘瑋柏）【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=MutvQFicfBA");
addSongToTable("Lemon Tree - Fools Garden", "https://www.youtube.com/watch?v=Va0vs1fhhNI");
addSongToTable("关键词 林俊杰 (歌词版)", "https://www.youtube.com/watch?v=vQhNsoGlJSg");
addSongToTable("【MV】張碧晨《籠》（電影【消失的她】主題曲）", "https://www.youtube.com/watch?v=gPqfGpLxVIU");
addSongToTable("林小珂 - 你給的雨那麼大『淋濕我剛癒合的傷疤，然後用傷害我的方式教會我長大。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=1bUcLGGaHLQ");
addSongToTable("承桓 - 耳光『多想你能回來給我一耳光，再順理成章的把我原諒。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=hdSd7zEUsrk");
addSongToTable("【延禧攻略】片尾曲 《雪落下的聲音》李千那 Cover", "https://www.youtube.com/watch?v=UuTBI3MY_ic");
addSongToTable("【纯享版】张碧晨王赫野深情对唱《字字句句》太好哭了！独特的嗓音搭配悠扬的曲调 “字字句句”都唱进了心里！ #天赐的声音4 EP3", "https://www.youtube.com/watch?v=lnXn6sblxB8");
addSongToTable("【纯享版】张碧晨&伯远唱跳改编《热爱105°C 的你》 欢快旋律搭配热力全开的舞蹈瞬间点燃全场！ #天赐的声音4 EP4", "https://www.youtube.com/watch?v=JcjYZ6xjYtI");
addSongToTable("【MV】毛不易 - 给你给我 《一生一世》暖心插曲 #给你我微不足道所有的所有", "https://www.youtube.com/watch?v=0r1ct8L_i_A");
addSongToTable("旺仔小喬 - 桃花諾「一寸土一年木一花一樹一貪圖 情是種愛偏開在迷途」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=FKN1k6B02VM");
addSongToTable("棉子 - 勇氣『我愛你 無畏人海的擁擠，只為能靠近你。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=6n2nAp_bfSk");
addSongToTable("晴天 周杰伦 (歌词版)", "https://www.youtube.com/watch?v=3-DteAHyRnI");
addSongToTable("李玟 CoCo Lee - 戰歌 [Official Music Video] 官方完整版MV（動畫《斗羅大陸雙神戰雙神》主題曲）", "https://www.youtube.com/watch?v=DWm14Asb0Y0");
addSongToTable("《璀璨冒险人》周深 斗罗大陆Ⅱ绝世唐门（Soul Land 2 Peerless Tangmen）动画主题曲 |【动态歌词/CC歌词】", "https://www.youtube.com/watch?v=rtbTbOANVbI");
addSongToTable("【MV】破繭 Break the Cocoon - 張韶涵 (Angela Zhang)  (Soul Land OST《斗罗大陆》动画2020年新主题曲MV)", "https://www.youtube.com/watch?v=e1_4y8RJ5xU");
addSongToTable("《不抛弃不放弃》ONER 斗罗大陆（Soul Land）史莱克七怪曲 | CC歌词", "https://www.youtube.com/watch?v=Gh4g84D9bik");
addSongToTable("初月 - 雨是神的煙花「 你看啊 雨是神明賜在 世間的煙花」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=OEYI3DOJEOw");
addSongToTable("火羊瞌睡了 - 夏天的风【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=hN7hpdQWS1E");
addSongToTable("汪蘇瀧&徐良 - 後會無期【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=i2N8ap31B0I");
addSongToTable("5zqian -《始終放不下》(Official Audio)", "https://www.youtube.com/watch?v=24KJa0nHMI0");
addSongToTable("薛之謙 Joker Xue【紳士】官方完整版 MV", "https://www.youtube.com/watch?v=Ndp0sZ5LyvI");
addSongToTable("张子豪 Wiz_H - 一般的一天 『一般的一天一般的一晚，一般的失眠到一栋楼的灯只下剩一盏。』【动态歌词/Pinyin Lyrics】[说唱听我的2]", "https://www.youtube.com/watch?v=tIPP18Q0r08");
addSongToTable("YangChill - 星空 (official audio)", "https://www.youtube.com/watch?v=ipfhZHRtTGc");
addSongToTable("K.D 翻唱《軌跡》【我會發著呆然後忘記你，接著緊緊閉上眼...】♫Cover周杰伦、周杰倫", "https://www.youtube.com/watch?v=kdKdup_EIsU");
addSongToTable("余又/李尖尖 - 治愈『我化作一束光一陣風圍繞著你，那些受的傷全都將被我治愈。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=brZlUFaxsEo");
addSongToTable("Just Say Hello - Melo D (Official Lyric Video)", "https://www.youtube.com/watch?v=rGUFyxxoBo4");
addSongToTable("[MV] 陳華 HuaChen【想和你看五月的晚霞 Sunset In May】feat. LCY呂植宇 | Official Music Video", "https://www.youtube.com/watch?v=ljd9ISixsWo");
addSongToTable("吳大文 - 安靜的稻草人『我到過你的世界與你遇見，一個期限趕走我所有的一切。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=AqxqdxpVGdY");
addSongToTable("李浩然 - 愛丫愛丫「愛我的話 愛我的話 給我回答」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=FQgUHSaqu6M");
addSongToTable("皮卡丘多多Cover - 我和你【動態歌詞】「我和你 飛到藍藍的天邊」♪", "https://www.youtube.com/watch?v=PDJFb377N0c");
addSongToTable("The Chainsmokers, Coldplay - Something Just Like This (Lyrics / Lyric Video)", "https://www.youtube.com/watch?v=jdDa1wv22o0");
addSongToTable("蘇打綠 當我們一起走過 歌詞", "https://www.youtube.com/watch?v=1lZnwDZuFJM");
addSongToTable("最後一堂課_歌詞版", "https://www.youtube.com/watch?v=hnRLKPb3-tE");
addSongToTable("泰勒絲 Taylor Swift - Love Story《歌詞》", "https://www.youtube.com/watch?v=n8b2nmHz11Q");
addSongToTable("曲肖冰 -  誰「在你眼中我是誰 你想我代替誰」【動態歌詞】♪", "https://www.youtube.com/watch?v=Ccr8t6-qTZo");
addSongToTable("你从未离去 - 白挺【我不再迷茫 思念是唯一的行囊 满天的星光 有一颗是你的愿望】（动感歌词/pīn yīn gē cí）", "https://www.youtube.com/watch?v=IaaMtyLboYM");
addSongToTable("队长YoungCaptain/黄礼格 - 11 『Cause you know 爱意就像大雨落下怎么能让人不牵挂。』【動態歌詞】♪", "https://www.youtube.com/watch?v=EQHM-KBR1bo");
addSongToTable("王恩信Est、二胖u - 飛『風浪沒平息，我宣告奔跑的意義！』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=5NFWs1DQgLc");
addSongToTable("芝麻Mochi Cover - 下雨天【動態歌詞】「怎樣的雨 怎樣的夜 怎樣的我能讓你更想念」♪", "https://www.youtube.com/watch?v=OqmkthmPBSw");
addSongToTable("盧盧快閉嘴 - 情歌「你寫給我 我的第一首歌 你和我 十指緊扣 默寫前奏」【動態歌詞】♪", "https://www.youtube.com/watch?v=yn3js31DDzg");
addSongToTable("蘇打綠 sodagreen -【小情歌】Official Music Video", "https://www.youtube.com/watch?v=in8NNzwFa-s");
addSongToTable("是珊珊阿/劉志遠 - 原來你「原來你的愛 是場意外原來早就該明白 只怪自己活該」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=SOvrchJmwOA");
addSongToTable("Starling８/MoreLearn27/FIVESTARBABY - 苦茶子「有天晚上我好像見到了上帝 對著他的臉放了個響屁 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=mflqGxkrZr0");
addSongToTable("不是花火呀/桶 - 心引力（原唱：王俊凱 / 蔡依林）「心引力的定律 找到你想對你說」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=P33CG2JC1zk");
addSongToTable("林小珂/BayBoy - 翻轉星空「你是我翻轉星空想要留住的風 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=0QAT3xO3qkw");
addSongToTable("Zic子晨 - 日出日落「日出日落在我的肩 一邊在冒險 一邊在長大」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=Kr_peNbWPj0");
addSongToTable("貝貝 - 求成「 現在我只喜歡有結果的人 不再享受飛蛾撲火的興奮」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=A0ERse0ETSQ");
addSongToTable("不是花火呀 - 惡作劇（青春版）「我想我會開始想念你可是我剛剛才遇見了你」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=GBrZ0T991Ww");
addSongToTable("你的上好佳 - 爱，存在「我要的爱，只在你身上存在」【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=f9tHlbwHv-s");
addSongToTable("en - 回忆交错『你的爱淡了淡了淡了淡了是谁的错，而我忘了忘了忘了挣脱枷锁。』【动态歌词 | Pinyin Lyrics】【十二月新歌】【AWALK MUSIC】", "https://www.youtube.com/watch?v=4SfpYenJDEc");
addSongToTable("en - 為你我受冷風吹『我會試著放下往事 管它過去有多美，也會試著不去想起 你如何用愛將我包圍。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=gm-WLFsXwMU");
addSongToTable("李潤祺 - 茫【動態歌詞】「我試著把孤獨藏進耳機 用琴鍵代替」♪", "https://www.youtube.com/watch?v=MHUJyDOzCzc");
addSongToTable("蜡笔小心 - 不普通的普通女孩「我是个平凡但不普通的普通女孩」【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=hq2urbekvk8");
addSongToTable("空城 - 楊坤 - 『超高无损音質』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=mgmJ_0_DL38");
addSongToTable("池魚 - 誰家「誰家的枝頭鳥兒成雙對 蝴蝶翩翩飛」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=ENEFZWrmmq4");
addSongToTable("蓋君炎 - 我想要『我想要天上的月亮 和地上的霜，想要雪白的姑娘 和漆黑的床。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=NLV8-GKS5HU");
addSongToTable("無人之島 - 任然『如果雲層是天空的一封信 能不能再聽一聽 聽你的聲音』【動態歌詞】", "https://www.youtube.com/watch?v=bWIEbwBtMV0");
addSongToTable("Selena Gomez, Marshmello - Wolves (Lyrics)", "https://www.youtube.com/watch?v=xrbY9gDVms0");
addSongToTable("小阿七 - 致最愛的人『走過的春秋冬夏 是你啊 都是你的影子啊，我要怎麼忘了你啊。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=RSGM7MvalSI");
addSongToTable("Morris赖仔 - 非酋 (抖音版)【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=f22FqAtkOLE");
addSongToTable("尹昔眠 - 落在生命裡的光『你是落在我世界裡的一束光，點點滴滴 都讓我嚮往。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=F2nd69GiShc");
addSongToTable("蘇星婕 - 一直很安靜（釋懷版）「給你的愛一直很安靜 來交換你偶爾給的關心」【動態歌詞】♪", "https://www.youtube.com/watch?v=VtZaIn2Co9c");
addSongToTable("en - 收尾「你全身而退 留我收場結尾 如此乾脆 防線被慢慢擊潰」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=qijDpOebKdI");
addSongToTable("六哲 - 畢竟深愛過 歌詞", "https://www.youtube.com/watch?v=ZBML_zoTMhA");
addSongToTable("「抖音音乐」尚士達-- --生而為人歌詞 ‘尚士达 生而为人’", "https://www.youtube.com/watch?v=4R0-E8-BCCs");
addSongToTable("阿辰(閻辰)/陳小滿 - 傷你「又一次 傷了你的心 傷你的 點點滴滴 都是我」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=oGN75QMWfg4");
addSongToTable("cici_ - 落空(吉他版)「你說完了的話還在心頭洶湧 笑著揮手 還沒回頭」【動態歌詞】♪", "https://www.youtube.com/watch?v=Tor6wU4CVUE");
addSongToTable("独行侠  YKEY Namunong ♬『我在空荡荡的房间里 拖着疲惫不堪的身体』《動態歌詞Lyrics》", "https://www.youtube.com/watch?v=piNG47X-1pY");
addSongToTable("Capper Ft. 羅言 - 雪 Distance『可是雪 飄進雙眼 看不見你橋牌的謊言』【Lyrics Video】", "https://www.youtube.com/watch?v=NCuVko5Hw6w");
addSongToTable("艾辰 - 不愛了「那天你說我從來不懂你 連天氣也預知了你不愛的訊息」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=beRtMwyEN14");
addSongToTable("劉大壯 - 秋天不回來（原唱：王強）『就讓秋風帶走我的思念帶走我的淚。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=MyOLtVpSFBk");
addSongToTable("【Sick Enough To Die】__MC Mong feat. Mellow", "https://www.youtube.com/watch?v=Kp1PibFB0qk");
addSongToTable("洛先生 - 孤城『月照入心頭 世間的愛恨情仇，漂泊天涯回首懷念她眼眸。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=r2sCy9ZOToA");
addSongToTable("yihuik苡慧 - 如果可以「」【動態歌詞】♪", "https://www.youtube.com/watch?v=wcT8OgGBTVk");
addSongToTable("Dx - 十三月的雨『等待雨過天晴 將壞情緒刪去，讓一切停在十三月的雨。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=se0Jtfs4nmU");
addSongToTable("打擾一下樂團 - 預言 (回憶版)「我可以不愛他 也可以忘了他 可那該死的回憶 拉扯我放不下」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=Q6KjKmV0WDo");
addSongToTable("小何 - 上輩子求來的相遇 「萬一我們相遇是上輩子求來的呢 所以 答應我 這輩子 不要走散好麼」【動態歌詞】♪", "https://www.youtube.com/watch?v=BvL0H8km1EA");
addSongToTable("吴东旭 - 差點 （吉他男聲版)「我差點就 我差點就碰到夜空的星 可天亮了」【動態歌詞】♪", "https://www.youtube.com/watch?v=tHtEkGM9hLQ");
addSongToTable("薛之謙 - 認真的雪『愛上你我失去了我自己。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=Un8kwjcpKZA");
addSongToTable("陳奕迅 十年 歌詞", "https://www.youtube.com/watch?v=Jr71SQssRR4");
addSongToTable("柯柯柯啊 - 舊夢一場（男生版）「早知驚鴻一場 何必情深一往 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=2i_lqbpFDHo");
addSongToTable("以冬 - 停步 (歌词) 💗♫", "https://www.youtube.com/watch?v=eBQgynZRjsw");
addSongToTable("落笛| 七叔（叶泽浩）[在回忆深处又响起你来时的笛音]【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=cVWMSF6O_7E");
addSongToTable("祥嘞嘞 - 新鴛鴦蝴蝶夢「昨日像那東流水 昨日像那東流水離我遠去不可留」【動態歌詞】♪", "https://www.youtube.com/watch?v=0hAqPpPCtvE");
addSongToTable("解语花. - 天空之外 【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=7oBzg2103x0");
addSongToTable("承桓 - 我會等「我會等枯樹生出芽 開出新的花 等著陽光刺破黑暗 第一縷朝霞」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=yaNPy3xKw1M");
addSongToTable("蛋蛋老弟 - 為情所傷(熱播男版)「你說不會在愛情裡犯錯 也說過會永遠的愛我」【動態歌詞】♪", "https://www.youtube.com/watch?v=WVL8tlLJpuc");
addSongToTable("Sub Urban - Cradles (Lyrics)", "https://www.youtube.com/watch?v=OE140zsQ08I");
addSongToTable("24kGoldn - Mood (Lyrics) ft. Iann Dior", "https://www.youtube.com/watch?v=0jSpCxmb2VQ");
addSongToTable("Billie Eilish, Khalid - lovely (Official Music Video)", "https://www.youtube.com/watch?v=V1Pl8CzNzCw");
addSongToTable("KKECHO / 那奇沃夫 - 苦咖啡·唯一「BABY 你就是我的唯一 兩個世界都變形」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=8vTsI1rIDQw");
addSongToTable("容祖兒 - 就讓這大雨全都落下『經歷的美好都要付一點代價，會後悔嗎？會懷念嗎？對你都不痛不癢吧。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=hHC208KAZLo");
addSongToTable("池鱼 - 如果这就是爱情「如果你听到这里 如果你依然放弃」【動態歌詞】♪", "https://www.youtube.com/watch?v=xxOKKGJ3klw");
addSongToTable("sea蕊 & 吳炳文Cookie - 獨行俠+愛如潮水(Remix)【動態歌詞/Pinyin Lyrics】", "https://www.youtube.com/watch?v=YKY6lVokTLs");
addSongToTable("陳壹千 - 仗着『你就仗著我對你 那麼愛 那麼好，所以你才面對我 那麼驕傲。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=s2CJv-wxs4k");
addSongToTable("雷雨心 - 記念『在心中刻下你們的笑臉，讓現在成為永遠。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=1UzxDbdjWQk");
addSongToTable("陳勢安 Andrew Tan + 畢書盡 Bii - 勢在必行 (官方版MV)", "https://www.youtube.com/watch?v=BhHdmugCPjo");
addSongToTable("周興哲-《如果雨之後》歌詞版", "https://www.youtube.com/watch?v=c_lcz4Nt7SY");
addSongToTable("周興哲 - 以後別做朋友 【歌詞版】", "https://www.youtube.com/watch?v=QuwjKdZnE0o");
addSongToTable("司南 - 冬眠【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=cxBZzf8lzqo");
addSongToTable("梁靜茹 分手快樂 歌詞", "https://www.youtube.com/watch?v=aUaoL8mdV4U");
addSongToTable("她說 徐薇「他靜悄悄地來過 他慢慢帶走沉默」【動態歌詞/Lyrics】 ( 原唱 : 林俊杰  )", "https://www.youtube.com/watch?v=8Uzaq-TWopY");
addSongToTable("Eric周興哲《你，好不好？ How Have You Been?》Official Music Video《遺憾拼圖》片尾曲", "https://www.youtube.com/watch?v=wSBXfzgqHtE");
addSongToTable("【光的方向 - 张碧晨】 《长歌行》电视剧主题曲『循着光照的方向 把你遗忘 回忆折旧成我倔强的模样』|热门歌曲|歌曲排行|抖音歌曲|kkbox|动态歌词Lyrics", "https://www.youtube.com/watch?v=a4s8hCotcjU");
addSongToTable("是七叔呢 - 踏山河【動態歌詞】「長槍刺破雲霞 放下一生牽掛」♪", "https://www.youtube.com/watch?v=1v1CiLQXho8");
addSongToTable("任然 - 疑心病『讓你愛上我 要多久，我已經愛上你 已走不動。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=YkLyTXJYwgI");
addSongToTable("【蕭憶情】一拜天地【虐心！】", "https://www.youtube.com/watch?v=RwCwoh1V61c");
addSongToTable("一隻白羊 － 賜我『賜我一場相愛 怎麼你又匆匆地離開』（動態歌詞/Lyrics Video/4k）", "https://www.youtube.com/watch?v=hKBvOJTcvMs");
addSongToTable("Zyboy忠宇 - 媽媽的話『從小的時候就經常聽我媽媽講 童年的夢境可笑的，就像是烏雲隱藏著。』【動態Lyrics|高音質】♫", "https://www.youtube.com/watch?v=GRdWU8gsvT8");
addSongToTable("小阿七《从前说》【高音质 动态歌词Lyrics】", "https://www.youtube.com/watch?v=hEMRM6J7LlY");
addSongToTable("IN-K/安蘇羽/傅夢彤 - 潮汐(Natural)『藍色的海底，遠山的風景，我們的距離遙不可及。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=bNWw58ippik");
addSongToTable("走馬-曲肖冰『過了很久終於我願抬頭看你就在對岸走的很慢』【動態歌詞/Vietsub/Pinyin Lyrics】流行歌曲", "https://www.youtube.com/watch?v=9Ily0UKeBTw");
addSongToTable("en - 間距『這一次我狠心決定放棄，你世界根本沒有我面積。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=0AZ5LnzSDQw");
addSongToTable("Little Do You Know || Alex & Sierra (Lyrics)", "https://www.youtube.com/watch?v=GP4okspbfMM");
addSongToTable("Let Her Go - Passenger ( Cover Lost & HoneyFox & Pop Mage ) Lirik Lagu | Lyrics - Acoustic", "https://www.youtube.com/watch?v=oPMmiACqQPY");
addSongToTable("劉可 - 寂寞才說愛「高音質 x 動態歌詞 Lyrics」♪ SDPMusic ♪", "https://www.youtube.com/watch?v=DW71-43DV2I");
addSongToTable("劉大壯 《後來/后来》『後來 我總算學會了如何去愛』 動態歌詞", "https://www.youtube.com/watch?v=dcIFiz8u84I");
addSongToTable("顏人中 - 晚安『迂回一句晚安，多情人卻自找難堪』【中文動態歌詞Lycris】完整版", "https://www.youtube.com/watch?v=FcyP7sIeWaE");
addSongToTable("space x - 圍繞『旋轉著 圍繞你，愛你到下個世紀，為你遮風又擋雨。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=6cYSksp-f2A");
addSongToTable("就是南方凯 - 求佛 (新版)『我们还能不能能不能再见面，我在佛前苦苦求了几千年。』【動態歌詞 】", "https://www.youtube.com/watch?v=fhbHnQ065n4");
addSongToTable("一首好聽的日文歌--絆(Miu-clips)【中日字幕】", "https://www.youtube.com/watch?v=uqT806ZVAE8");
addSongToTable("【英繁中字】Keep Your Head Up Princess by Anson Seabra", "https://www.youtube.com/watch?v=E5zxOHMgmJE");
addSongToTable("【抖音】林童學Cover - 迷人的危險【完整版&動態歌詞】【原唱:Dance Flow】♪", "https://www.youtube.com/watch?v=vFv8ExYiD-Q");
addSongToTable("K.D 翻唱《楓》【緩緩飄落的楓葉像思念，我點燃燭火溫暖歲末的秋天...】♫Cover周杰倫", "https://www.youtube.com/watch?v=oEeRcN_kq78");
addSongToTable("K.D 翻唱《不在》【穿過了熙攘的人海，想找誰能把你取代...】 ♫", "https://www.youtube.com/watch?v=cxzZ8cd9o-M");
addSongToTable("井朧-囚鳥-男生版（Cover：彭羚）『我是被妳囚禁的鳥 已經忘了天有多高』原唱: 彭羚『Chinese Music』", "https://www.youtube.com/watch?v=jD-Ly-9Tt2Q");
addSongToTable("於冬然 - 能不能放過我『痛到無法再癒合的傷口 傷了我卻還說捨不得』【Lyrics Video】", "https://www.youtube.com/watch?v=RIQwPp_XD3c");
addSongToTable("K.D 重制翻唱《病變》【有天我睡醒看到我的身邊沒有你...】♫", "https://www.youtube.com/watch?v=ibRSot4tt2U");
addSongToTable("麥小兜 - 9420『我只想說，就是愛你。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=HJ54P8T9m8U");
addSongToTable("［小海灘］cover ft. 帝仰🐑", "https://www.youtube.com/watch?v=w2Mf1qeCRxU");
addSongToTable("Corki - 下墜Falling『喝醉後的夢裡，我往前 你退後。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=-M4CUPBH5bg");
addSongToTable("動力火車-我很好騙【歌詞】", "https://www.youtube.com/watch?v=efmtFFnZOGA");
addSongToTable("王大毛 - 去年夏天 (DRT Remix)【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=v1jVH2yIcHg");
addSongToTable("space x - 0321【動態歌詞】「在看不到的夜裡 我時刻在想你 你是否能聽清」♪", "https://www.youtube.com/watch?v=MBnU0k25O8I");
addSongToTable("封茗囧菌 - 靜悄悄 (女聲版)【動態歌詞】", "https://www.youtube.com/watch?v=W1aT20Hp-M0");
addSongToTable("陳雪凝 - 假裝「故事開始總是很甜，歲月流逝人心轉變」動態歌詞版", "https://www.youtube.com/watch?v=4C9_kSakeec");
addSongToTable("烟(许佳豪)- 再见，我的女孩『就再见吧 我的女孩，见证我的失败 没能给你一个未来』【動態歌詞Lyrics】2022 热门歌曲 | 2022 新歌推送 | 抖音十大热门歌曲 | 最火最热门洗脑抖音歌曲", "https://www.youtube.com/watch?v=xMIaB7gGMG8");
addSongToTable("Avicii - The Nights (Lyrics) 'my father told me'", "https://www.youtube.com/watch?v=H78YW7ycuwI");
addSongToTable("Justin Bieber - Baby ft. Ludacris (Lyrics Video)", "https://www.youtube.com/watch?v=q8hdSF60U0A");
addSongToTable("Crash Adams - Destination (Lyrics)", "https://www.youtube.com/watch?v=2jEIugrVZe8");
addSongToTable("1個球 - 大雨還在下「猶如我最愛的你呀，三天三夜都不接電話」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=MNGtsOct75M");
addSongToTable("CORSAK - 溯（Reverse） Feat. 馬吟吟『Alan Walker 鼎力推薦的中國電音製作人！』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=lrDlTEbHw3g");
addSongToTable("薛明媛、朱賀 - 非酋『我知道有一個人會守護着我。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=yTDnFHKZcBI");
addSongToTable("岑寧兒 追光者 歌詞", "https://www.youtube.com/watch?v=GIKmtqjlvuA");
addSongToTable("Lizm Ladyhao - 紙短情長『我的故事都是關於你呀。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=FuDdstaZXdw");
addSongToTable("周筆暢 - 最美的期待『不用再徘徊，你就是我最美的期待。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=y90qkLAn5So");
addSongToTable("晚風告白 - 星野『我詞不達意的錶白，飽含真誠喜感，快餐式的戀愛年代，太多人麻木愛個大概』【動態歌詞】", "https://www.youtube.com/watch?v=XWr7TpRyfQQ");
addSongToTable("柏松 - 世間美好與你環環相扣『此時已鶯飛草長，愛的人正在路上。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=Kca3ndEpG0s");
addSongToTable("耗子 - 呼吸定律『你就像一隻魚離開水就不能呼吸，而我潛入海底為尋覓你寧願窒息。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=PiYqLxBVepQ");
addSongToTable("Shawn Mendes - Stitches (Lyrics)", "https://www.youtube.com/watch?v=EByFZdw4wEA");
addSongToTable("一玟 - 最甜情歌 (Cover: 红人馆&红人馆馆长&WayMen)【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=ILGX4d-7aGA");
addSongToTable("陳雪凝 - 那個傻瓜【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=dUuCWX_kb_0");
addSongToTable("杨胖雨 - 这就是爱吗【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=jeWT8v8oXXo");
addSongToTable("魏新雨 - 百花香【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=W70gjC2bOzQ");
addSongToTable("曾沛慈 一個人想著一個人 歌詞", "https://www.youtube.com/watch?v=_9Sb7mGsu1Q");
addSongToTable("yihuik苡慧 - 清醒【動態歌詞】「螢火再微弱 也會擁有迷人的顏色」♪", "https://www.youtube.com/watch?v=jQhwkdT95FE");
addSongToTable("Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack", "https://www.youtube.com/watch?v=RgKAFK5djSk");
addSongToTable("寒城-洛先生【寒风似刀锋 切断人间的相逢与君一别 多少往事风雪中】", "https://www.youtube.com/watch?v=rCOfB5UNHmc");
addSongToTable("Aioz - 22秒『你二十二秒的語音我收藏了三年，被反覆聽過一萬遍 生了繭。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=F8yhujq5ytY");
addSongToTable("薛之謙 Joker Xue【演員】官方完整版 MV", "https://www.youtube.com/watch?v=XKuL5xaKZHM");
addSongToTable("于冬然 - 聽說你『聽說你為她做的，件件是我曾經求而不得 你卻已握緊別的溫柔。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=wqxVUTGoFmU");
addSongToTable("Kinkis - Too Much「babe我總是想太多 學不會在你的面前說」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=N3WaxrruEs4");
addSongToTable("阿冗 - 你的答案『也許我只能沉默，眼淚濕潤眼眶可又不甘懦弱。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=ye4jAQ0uxcQ");
addSongToTable("XMASwu - 7%【動態歌詞】「你操縱我的時空 撲入我懷中」♪", "https://www.youtube.com/watch?v=08v_Ri81DlE");
addSongToTable("張紫豪 - 可不可以『不希望我的未來不是你，只願意和你永遠不分離。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=hgIDXTmmgDg");
addSongToTable("劉大拿 / Aioz - 罵醒我·2022「Babe能不能抓住我 當我的心被搞亂了」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=8p1zvkXhxT4");
addSongToTable("夏婉安 - 習慣『最怕沒有結果的拉扯....』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=P2DRc-94INo");
addSongToTable("于冬然 - 故事很短『我們的故事很短 有點傷感，你走的那麼坦然 無法談判。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=Hc0-QTO25H8");
addSongToTable("劉大壯 - 後來（Cover劉若英）（翻自 劉若英） 『後來終於在眼淚中明白』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=uLsycA9fKXc");
addSongToTable("一口神探 － 分界『你和我之間 彷彿有條分界』（動態歌詞/Lyrics Video/4k）", "https://www.youtube.com/watch?v=WOY5xYr0KLM");
addSongToTable("239188#黄小琥#没那么简单黃小琥 - 沒那麼簡單『沒那麼簡單 相愛沒有那麼容易』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=ZZxorgnfvCc");
addSongToTable("【易忘先生】David Kushner - Mr. Forgettable 中英歌詞", "https://www.youtube.com/watch?v=pH5Qw_Faj6c");
addSongToTable("yihuik苡慧/嘿人李逵Noisemakers/十七草 Cover - 小雨天氣【動態歌詞】「月亮眨眨眼睛我把你放在手心」♪", "https://www.youtube.com/watch?v=RQsLZDoRhMw");
addSongToTable("蓝心羽 - 寂寞烟火『时光的岸上人来了又走 离开时你不用说我都懂，感谢你曾让我 留在你眼中。』【動態歌詞】♪", "https://www.youtube.com/watch?v=wpmDFtuvr5c");
addSongToTable("白小白 - 我愛你不問歸期『就像風走了千萬里從不問歸期，像太陽升了落去無論朝夕。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=oDvJjrjHbu4");
addSongToTable("【心牆】郭靜 Claire Kuo《歌詞》", "https://www.youtube.com/watch?v=IxFZurBc79Q");
addSongToTable("Lewis Capaldi - Someone You Loved (Lyrics)", "https://www.youtube.com/watch?v=FGGo8LFmbjs");
addSongToTable("朴樹 平凡之路 歌詞", "https://www.youtube.com/watch?v=e52evW0p1Ag");
addSongToTable("K.D 翻唱《來遲》【我這一次終究還是來得太遲...】♫", "https://www.youtube.com/watch?v=lhl2AebADZg");
addSongToTable("F＊yy - 浪漫爱（原唱：江语晨）「牵我的手 我知道你会带着我向前走，我不需要天长地久的承诺」(4k Video)【動態歌詞/pīn yīn gē cí】#Fyy #浪漫爱 #江语晨 #動態歌詞", "https://www.youtube.com/watch?v=bhO3SdqI3l0");
addSongToTable("沈彥宇 - 刪了又加『原諒我 一次次 一遍遍 刪了又加，發出去 每個字 每句話 心亂如麻。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=tymyT0Rf_M0");
addSongToTable("旺仔小喬 - 愛丫愛丫 (女版)「愛我的話 給我回答 我的愛丫愛丫沒時差」【動態歌詞】♪", "https://www.youtube.com/watch?v=TTomWAJbXSY");
addSongToTable("楊小壯 - 孤芳自賞 [ Something Just Like This ]【動態歌詞Lyrics】『我承認我自卑，我真的很怕黑。』", "https://www.youtube.com/watch?v=jlw8qRqARd4");
addSongToTable("白小白 - 愛不得忘不捨 | 高音質動態歌詞", "https://www.youtube.com/watch?v=dsBbKG17nU4");
addSongToTable("Kirsty劉瑾睿 - 若把你「若把你比作歌 你便是那高山流水」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=QkEpD6oTNnI");
addSongToTable("阿泱 - 怎麼了(女聲版) (Cover：周興哲)【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=CweKWha8N6Y");
addSongToTable("七元 - 老鼠爱大米 (完整版)『我听见你的声音，有种特别的感觉，让我不断想，不敢再忘记你。』【动态歌词】抖音 翻唱", "https://www.youtube.com/watch?v=-MulS374s9E");
addSongToTable("cici_ - 把回憶拼好給你「你對我說的情話 像轉瞬即逝的煙花」【動態歌詞】♪", "https://www.youtube.com/watch?v=KbC790eH55I");
addSongToTable("蘇星婕 - 把回憶拼好給你『我們之間的回憶 全部都小心地收集，我總是偷偷地哭泣。』【高音質|動態歌詞Lyrics】♫ 原曲 願い~あの頃のキミへ~", "https://www.youtube.com/watch?v=0Q2ruFK7N4k");
addSongToTable("樹澤 - 後來的你在哪『牽著誰的手 陪在誰左右，可是現在的我 獨自一人在回憶停留。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=CnbIdhF-kYQ");
addSongToTable("ycccc - 滿天星辰不及你『星際閃耀光影 落入你的眼睛，我們共赴一場 光年的旅行。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=_BshMLSUsW8");
addSongToTable("再見莫妮卡 - 彭席彥 / Franky弗蘭奇『一個人想想想想到心痛「怎麽能夠不懂」，情緒一點點點點到失控「變得有恃無恐」』【動態歌詞】", "https://www.youtube.com/watch?v=2GcrsVIrYck");
addSongToTable("刘大壮 - 忘不了的是你「忘不掉的是你，我快不能呼吸」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=F6HPAHib4n0");
addSongToTable("尹昔眠 - 旁觀者『別人的故事總是讓我找出問題，旁觀的時候誰都比誰更加清醒。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=PPplg_qcMQQ");
addSongToTable("旺仔小喬 - 墮「她是踏碎星河落入我夢境的幻想 環遍星係為你尋找的力量」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=rc6S8ebioMA");
addSongToTable("Faye詹雯婷 - 訣愛【電視劇《蒼蘭訣 Love Between Fairy and Devil》燃愛主題曲】「無處安放靈魂 只能降落」♪【動態歌詞】♪", "https://www.youtube.com/watch?v=I4lonGT1PYM");
addSongToTable("IN-K & 王忻辰 - 迷失幻境 (DJ版)「没来得及说抱歉，你已经不在身边」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=TkaGkTb_Twg");
addSongToTable("程響 - 世界這麼大還是遇見你【原曲：清新的小女孩】【動態歌詞】「天南地北 別忘記我們之間的情誼」♪", "https://www.youtube.com/watch?v=0E3NkpqjYbI");
addSongToTable("不够 - 收敛【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=h_yzjScjYMI");
addSongToTable("王靖雯不胖 - 不知所措【動態歌詞】「最燦爛的煙火總是先墜落 越是暖的經過反而越折磨」♪", "https://www.youtube.com/watch?v=PBRW0GY6bfY");
addSongToTable("井迪 - 失控【動態歌詞】「我們啊 愛得沉重 一路懵懂 磕磕碰碰」♪", "https://www.youtube.com/watch?v=0swKZBxTNEQ");
addSongToTable("王靖雯不胖 - 忘了沒有『每一個失眠夜晚你的晚安變成孤單，只能在回憶中擁抱我。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=xv5iT3M8na4");
addSongToTable("韋禮安-如果可以【歌詞】", "https://www.youtube.com/watch?v=E7oRotpNfAo");
addSongToTable("阿冗 - 與我無關【動態歌詞】「望眼欲穿 等不到你的晚安」♪", "https://www.youtube.com/watch?v=8tuzFSXeKI0");
addSongToTable("李飄飄 - 真的不快樂「可是媽媽 我好像沒有避風港」【動態歌詞】♪", "https://www.youtube.com/watch?v=euSYJ_LSuzk");
addSongToTable("yihuik苡慧 - 銀河與星斗【高音質|動態歌詞Lyrics】♫『晚風依舊很溫柔，一個人慢慢走。』", "https://www.youtube.com/watch?v=_RkqB_efI2o");
addSongToTable("cici_ - 至少還有你(溫柔版)「如果全世界我也可以放棄至少還有你值得我去珍惜」【動態歌詞】♪", "https://www.youtube.com/watch?v=7phWxa291qQ");
addSongToTable("鞠文嫻 - BINGBIAN病變 (女聲版) Feat. Deepain【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=ZFw6rTEw1hA");
addSongToTable("王心凌 大眠 歌詞", "https://www.youtube.com/watch?v=qdPGYYtP5Cc");
addSongToTable("The Chainsmokers - Closer (Lyrics) ft. Halsey", "https://www.youtube.com/watch?v=25ROFXjoaAU");
addSongToTable("The Kid LAROI, Justin Bieber - Stay (Lyrics)", "https://www.youtube.com/watch?v=yWHrYNP6j4k");
addSongToTable("姚六一 - 霧裡【動態歌詞】「彩色的世界我在我的霧裡多麽清晰 他們黑白的心」♪", "https://www.youtube.com/watch?v=TbOhwtHtmF0");
addSongToTable("王靖雯不胖 - 永不失联的爱「你给我 这一辈子都不想失联的爱，相信爱的征途就是星辰大海」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=PJ9zdll1Lyc");
addSongToTable("陳雪凝 - 你的酒館對我打了烊【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=ynaARgs_yvQ");
addSongToTable("G.E.M.鄧紫棋【句號 Full Stop】Official Music Video", "https://www.youtube.com/watch?v=7XlqcS6B7WA");
addSongToTable("G.E.M.【再見 GOODBYE】Official MV [HD] 鄧紫棋", "https://www.youtube.com/watch?v=Lhel0tzHE08");
addSongToTable("Ayo97 - 感謝你曾來過 ft.阿涵「高音質 x 動態歌詞 Lyrics」♪ SDPMusic ♪", "https://www.youtube.com/watch?v=hVlmlDwhpWY");
addSongToTable("告五人 - 愛人錯過『』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=2JSDVQy6xAs");
addSongToTable("接個吻，開一槍、沈以誠、薛明媛 - 失眠飛行【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=a4eR-5OJ-7Q");
addSongToTable("彈棉花的小花 - 捨不得又如何『我知道你根本沒愛過，你的近況我已經聽說，其實你已經開始了新的生活。』【動態歌詞/Vietsub/Pinyin Lyrics】", "https://www.youtube.com/watch?v=7LFZqXZYu18");
addSongToTable("林小珂 - 要不你先說〖榕樹上 的枝椏 都枯了 你怎麼不回頭看一下〗動態歌詞", "https://www.youtube.com/watch?v=K3ITweXm9NA");
addSongToTable("蜡笔小心 - MOM【動態歌詞/Lyrics Video】", "https://www.youtube.com/watch?v=othQVXxFd6I");
addSongToTable("張遠 - 嘉賓【高音質|動態歌詞Lyrics】♫『感謝你特別邀請，來見證你的愛情。』Zhang Yuan-Khách", "https://www.youtube.com/watch?v=jPzkNvWOcGc");
addSongToTable("王靖雯 - 玫瑰少年「哪朵玫瑰沒有荊棘 最好的 報復是 美麗 最美的 盛開是 反擊」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=8jTEXhG7toA");
addSongToTable("艾辰 - 錯位時空『我吹過你吹過的晚風，那我們算不算相擁。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=mXf3Klcn-sM");
addSongToTable("大天蓬 - 女聲版「怕什麼天道輪迴，什麼魄散魂飛」【動態歌詞 Lyrics】", "https://www.youtube.com/watch?v=2bvb-Ql8Pb4");
addSongToTable("曾沛慈 Pets Tseng【今天陽光就是特別耀眼特別和諧 feat.韋禮安 Memorable Moments feat. WeiBird】Official Music Video", "https://www.youtube.com/watch?v=J-pT68WQt_Q");
addSongToTable("不如 - 也可『不如我们拥抱后分手 不如眼泪有空偷偷流 不如这次就还你自由 不如擦肩而过别回头』~动态歌词 Lyrics ~", "https://www.youtube.com/watch?v=jTZTGUYPBio");
addSongToTable("TA-不是花火呀｜動態歌詞 『 她站在地球的另一邊看月亮 他躺在巴黎島海灘上曬太陽 』", "https://www.youtube.com/watch?v=WJAbJ1vyasw");
addSongToTable("苦茶 (心動版) - yihuik苡慧 / Aioz『不用等你開口先說我愛你(我愛你),在那之前想對你說我願意(我願意)』【動態歌詞】", "https://www.youtube.com/watch?v=pND0MdEXrH4");
addSongToTable("赵希予 - 落日星空「因为落日和星空，只能在黄昏相拥」(4k Video)【動態歌詞/pīn yīn gē cí】#赵希予 #落日星空 #動態歌詞", "https://www.youtube.com/watch?v=ZH7RrC310SQ");
addSongToTable("yihuik苡慧 - 熱戀冰淇淋「咬一口熱戀冰淇淋，牽你手漫步夏夜裡」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=pT3J_HGYsfM");
addSongToTable("張葉蕾 / Jady - 暴雨之後「我們的愛已經回不到從前 仰望黑暗的天」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=z3QaXh2PtWA");
addSongToTable("陸傑awr - 後來我們的愛「後來我們的愛從認真變得敷衍 後來我們的愛從誓言變成謊言」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=G_NKYDSI574");
addSongToTable("Cindy大蟠桃子 - 天气预报『天气预报今天有雨，如果幸运会在路上遇见你，万万没想到天气很晴。』【動態歌詞】♪", "https://www.youtube.com/watch?v=n4mCDCo-xxM");
addSongToTable("夏婉安 - 時間打了個X『記憶覆蓋著沙，想問句你還好嗎? 想忘記你卻沒有辦法。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=WIEZodMxZa8");
addSongToTable("賀子玲 - 在等風「我在等一場風 等你靠近我 你是風掠過我 也只是路過」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=VUeJMyfkujo");
addSongToTable("【李常超/Lao乾媽】《盜墓筆記·十年人間》八一七稻米節主題推廣曲 Official Music Video", "https://www.youtube.com/watch?v=y9I32szTGuQ");
addSongToTable("Uu - 那女孩對我說（原唱：黃義達）『遍體鱗傷的我，一天也沒再愛過。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=A8N_sQ_kK48");
addSongToTable("胖虎 - 白月光與朱砂痣「白月光在照耀，你才想起她的好」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=aIxF_2wtPwc");
addSongToTable("[Proud Of You][揮著翅膀的女孩](HD重製)", "https://www.youtube.com/watch?v=qfMoGBz26Fo");
addSongToTable("闻人听书 《虞兮叹》 【创作MV - Lyrics】 「蔡文姬：以后别让我奶了，我男(澜)朋友回来了」 【王者荣耀】", "https://www.youtube.com/watch?v=bUjuowPASe0");
addSongToTable("(女聲版)心如止水 - 于晴「愛著誰的她，能否將你接受」動態歌詞版", "https://www.youtube.com/watch?v=9WlAtEx1TR0");
addSongToTable("田馥甄 - 小幸運【歌詞】", "https://www.youtube.com/watch?v=XIYTWH_iUqU");
addSongToTable("【HD】逃跑計劃 - 夜空中最亮的星 [歌詞字幕][完整高音質] Escape Plan - Brightest Star In The Night Sky", "https://www.youtube.com/watch?v=GPnymcrXgX0");
addSongToTable("旺仔小乔-年轮【原唱：张碧晨】【数着一圈圈年轮 我认真将心事都封存，密密麻麻是我的自尊】【动态歌词】", "https://www.youtube.com/watch?v=eRpUTR5VssM");
addSongToTable("傅梦彤 - 潮汐「蓝色的海底，远山的风景」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=ch6gKkmQbF4");
addSongToTable("王貳浪 - 此類生物『有人說笑掩飾自己多無助，平靜接受被利用的反面照顧。』【高音質|動態歌詞Lyrics】♫", "https://www.youtube.com/watch?v=vi6MtHV_rIY");
addSongToTable("jia en-是你『相見的那天,身上帶著香味,挑起了媚眼,害羞的對到眼』【動態歌詞/Lyrics】", "https://www.youtube.com/watch?v=8YB-E37FzPA");
addSongToTable("小陸 - 寫完這首歌我就會放下你了 (Official Audio)", "https://www.youtube.com/watch?v=0KMqq10rTrM");
addSongToTable("蓝心羽 - 星空剪影「夜晚拥有星星，云朵拥有雨滴」【動態歌詞/pīn yīn gē cí】", "https://www.youtube.com/watch?v=euwpeHyWwTI");
addSongToTable("一路生花 - 溫奕心『我希望許過的願望一路生花，護送那時的夢抵擋過風沙』【動態歌詞】", "https://www.youtube.com/watch?v=F7R1Y7_W45c");
addSongToTable("隊長YoungCaptain - 哪裡都是你【動態歌詞】「你想要的是現在 而不是那遙遠的未來」♪", "https://www.youtube.com/watch?v=R46qc7jopF4");
addSongToTable("賀敬軒 - 羅曼蒂克的愛情『請你帶上我的心, 踏上這段愛的旅行。』【動態歌詞Lyrics", "https://www.youtube.com/watch?v=pUTqs4c1mSA");
addSongToTable("王靖雯不胖 - 善變【動態歌詞】「從前你穿越風雨都會倉促見一面 後來連傘的邊緣你都懶得分一點」♪", "https://www.youtube.com/watch?v=KWRwlTyV-qU");
addSongToTable("Zyboy忠宇 - 墮「她是踏碎星河落入我夢境的幻想」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=507hQiAHaDU");
addSongToTable("張齊山DanieL - 熒光天堂「你像一道微光 透進我的心房」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=M7MVrI9insY");
addSongToTable("pro - 愛墜入深海「最後的最後你帶著落日離開 最後的最後愛墜入藍色深海」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=CZRcoZXNMqs");
addSongToTable("Max Lee - 得體 (也許我說的話不得體)「也許我說的話 不得體傷害了你」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=a0Y7noXEA6I");
addSongToTable("蘇星婕·王忻辰 - 61秒 [ 我們在星期八碰面好不好  地點在十三月的荒島 ]【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=iSQn7LwYaNg");
addSongToTable("韓瞳 - 孤單地癒合吧（Stellaluna）「 我們孤單的癒合 還要幾遍是你是我是從前」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=tMP5ibXEwzM");
addSongToTable("於冬然 - 聽說你「聽說你輕描淡寫 安慰她說從來沒愛過我」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=N7DNRtJ6AE4");
addSongToTable("Li 敖 - 對你說 (完整版) 「你也會愛上一個人付出很多很多 你也會守著秘密不肯告訴我」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=kjp7VpdoQfE");
addSongToTable("艾辰 - 他他他「我比不上他他他他啊啊啊」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=QcjMppXPH4c");
addSongToTable("含大仙兒 - 你是恩賜也是劫「終是那周莊夢了蝶 你是恩賜也是劫」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=LIUC5bPAjf4");
addSongToTable("給你呀（又名：for ya）- 蔣小呢『我欣賞日出和日落的靜謐，愛著天空也深愛著你』【動態歌詞】", "https://www.youtube.com/watch?v=QxBdx0P6GyU");
addSongToTable("九三 - 反方向的钟 (原唱：周杰伦)『穿梭时间的画面的钟，从反方向开始移动』【动态歌词】抖音 翻唱", "https://www.youtube.com/watch?v=DDyn8HJju1g");
addSongToTable("虎二 Tiger Wang - 原來 Turns Out『原來我們的起點，是放開彼此走遠。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=Dp7qwj89e3s");
addSongToTable("【tk極推薦】雙笙   心做し × 這樣的事我不懂啊 不要讓我獨自一人  High Quality Lyrics  中日字幕  虐心系列  GUMI Best Cover", "https://www.youtube.com/watch?v=BuH6eYkZ6nU");
addSongToTable("好きだから。/ 『ユイカ』【MV】", "https://www.youtube.com/watch?v=eYAd4uDotF0");
addSongToTable("ロクデナシ「ただ声一つ」/ Rokudenashi - One Voice【Official Music Video】", "https://www.youtube.com/watch?v=5GUaMOpfmr8");
addSongToTable("李尖尖 - 氧化氫「化學裡面的反應你是氧來我是氫」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=iY_2zs9eAMg");
addSongToTable("忘川彼岸-(零一九零贰)", "https://www.youtube.com/watch?v=n7CvL_oMD54");
addSongToTable("小樂哥 - 執迷不悟【原唱：鐵腦袋mp3】【動態歌詞】「我對你又何止是執迷不悟 眼淚偶爾會莫名的光顧」♪", "https://www.youtube.com/watch?v=CGBwt-uDjm4");
addSongToTable("WiFi歪歪 - 就忘了吧 (完整版)「在那些和你錯開的時間裡 我騙過我自己 以為能忘了你 」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=qOZ2OnN6kTk");
addSongToTable("程響 - 四季給你『送你三月的風 六月的雨 九月的風景大雪漫天飄零 做你的嫁衣 多美麗』【動態歌詞Lyrics Video】", "https://www.youtube.com/watch?v=WZiSPQBY3d8");
addSongToTable("深海魚子醬 - 千千萬萬【動態歌詞】「這是千千萬萬萬萬千千個日夜 是我對你說不盡的思念」♪", "https://www.youtube.com/watch?v=qulV2n_5uho");
addSongToTable("王忻辰/蘇星婕 - 清空【動態歌詞】「是我愛的太蠢太過天真 才會把你的寂寞當作契合的靈魂」♪", "https://www.youtube.com/watch?v=U2URlwurXNw");
addSongToTable("蘇星婕 - 時空縫隙【動態歌詞】「可不可以讓我穿越時空縫隙 能按下暫停鍵就可以去見你」♪", "https://www.youtube.com/watch?v=WIkuc2bV-Es");
addSongToTable("是七叔呢 - 半生雪【動態歌詞】「半生風雪 吹不散歲月留下的眼淚」♪", "https://www.youtube.com/watch?v=lAZc4uOsSxo");
addSongToTable("虎二 - 一百萬個可能Cover『該向前走或者繼續等...你讓我徘徊在千里之外。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=AwoxYyTA0Gc");
addSongToTable("刪了吧 - 煙(許佳豪)『要不你還是把我刪了吧，我咬緊牙關命令我發出這句話』【動態歌詞】", "https://www.youtube.com/watch?v=Kt-zQIJTHy0");
addSongToTable("KeyKey - 當想你成為習慣【動態歌詞】「當想你成為遺憾 一個人也算圓滿」♪", "https://www.youtube.com/watch?v=LacrKg00f_w");
addSongToTable("【新版】F*yy Cover - 萬有引力【原唱:汪蘇瀧】【動態歌詞】♪", "https://www.youtube.com/watch?v=rUt5gnQjj04");
addSongToTable("葉瓊琳/sea蕊 - 哪裡都是你（原唱：隊長）【動態歌詞】「你想要的是現在 而不是那遙遠的未來」♪", "https://www.youtube.com/watch?v=RhIvnfIATNY");
addSongToTable("pro - 等不來花開「我們的愛 就像秋葉等不到花開」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=OFdAYrQLMJ4");
addSongToTable("大泫 - 靜悄悄『我害怕這是夢境，不小心會驚醒。』【動態歌詞Lyrics】", "https://www.youtube.com/watch?v=FnV5wmmU0JM");
addSongToTable("一顆狼星 - 海市蜃樓 (完整版)「So calm down 夢里海市雲霞 夢外羽化成她」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=qyhu1xEauQo");
addSongToTable("梨香JZH - 劍魂 (Cover)  (抖音完整版)「山外還有山比山高 半山腰 一聲驚雷搖晃樹梢」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=U7D-UEnW_pU");
addSongToTable("不知名選手Au/馬也_Crabbit - 陷落Falling「Did u see that snow is falling from the sky」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=R0my89b3AxA");
addSongToTable("星野 - 假性親密 「只是種假性親密 以為彼此最熟悉」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=OjsfaryuB50");
addSongToTable("蘇星婕/吳岱林 - 梨花樹下「你還記得嗎 有一個孩子 說他這輩子 就只會愛一次」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=ckbcRFObIys");
addSongToTable("楊博然 - 黎明的光「在黎明之前 驅散襲來黑夜」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=fkALostD7lc");
addSongToTable("蘇星婕/吳瑭  - 活該「我想逃 逃不掉繞不過 你設下的圈套」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=a_c5RT-M7nU");
addSongToTable("SHAUN feat. Conor Maynard - Way Back Home (Lyrics) Sam Feldt Edit", "https://www.youtube.com/watch?v=1kehqCLudyg");
addSongToTable("柯柯柯啊 - 櫻花樹下的約定 (熱搜版)「那時的我和你 常常相約在櫻花下」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=PhJyRBkmpHQ");
addSongToTable("音格概念/逸霄 - 逃開 「放手離開 默念幾遍拜拜 如何來去 趕走那些傷害」【動態歌詞/PinyinLyrics】♪", "https://www.youtube.com/watch?v=qGed4CrXC4k");
addSongToTable("藍心羽 - 阿拉斯加海灣【原唱：菲道爾】【動態歌詞】「上天啊 難道你看不出我很愛她...」♪", "https://www.youtube.com/watch?v=9AHvMtDwu6M");
