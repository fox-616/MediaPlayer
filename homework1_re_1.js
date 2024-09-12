var audio = document.getElementById("audio");
//var changeVol = document.getElementById("changeVol");
//var volChangeBar = document.getElementById("volChangeBar");
var musicMuted = document.getElementById("musicMuted");
var volController = document.getElementById("volController");
var volChangeBar = volController.children[0];
//var musicVolume = document.getElementById("musicVolume")
var musicVolume = volController.children[3];
//var volReduce = document.getElementById("volReduce");
//var volPlus = document.getElementById("volPlus");
var tolProGress = document.getElementById("tolProGress");
var musicPool = document.getElementById("musicPool");

var songBook = document.getElementById("songBook");
var songBookSource = songBook.children[0];
var songBookTarget = songBook.children[1];


//初始設定
audio.volume = 1;
//tolProGress = 0;
var proGressTaskID;
audio.loop = false;
InitMusicPool();

//初始化音樂池
function InitMusicPool() {
    for (var i = 0; i < songBookSource.children.length; i++) {
        var option = document.createElement("option");
        songBookSource.children[i].id = "song" + (i + 1);
        songBookSource.children[i].draggable = "true";
        songBookSource.children[i].ondragstart = drag;

        option.value = songBookSource.children[i].title;
        option.innerText = songBookSource.children[i].innerText;

        musicPool.appendChild(option);
    }
    changeMusic(0);
}

function showSongBoook() {
    songBook.style.display = songBook.style.display == "flex" ? "none" : "flex";
}

//更新音樂池
function updateMusicPool() {
    //清空音樂池
    for (var i = musicPool.children.length - 1; i >= 0; i--) {
        musicPool.remove(i);
    }

    //讀取 songBookTarget 的歌曲音樂池
    for (var i = 0; i < songBookTarget.children.length; i++) {
        var option = document.createElement("option");

        option.value = songBookTarget.children[i].title;
        option.innerText = songBookTarget.children[i].innerText;

        musicPool.appendChild(option);
    }
    changeMusic(0);
}


// ===== drag & drop 的功能區開始 ======

function allowDrop(ev) {
    ev.preventDefault();    ///放棄物件預設行為
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);  //抓取正在拖曳的物件
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(ev.target);

    if (ev.target.id == "") {
        ev.target.appendChild(document.getElementById(data));
    } else {
        ev.target.parentNode.appendChild(document.getElementById(data));
    }
}

// ===== drag & drop 的功能區結束 ======

//播放音樂
function playMusic() {
    audio.play();
    play.innerText = ";";
    play.onclick = pauseMusic;
    play.title = "暫停音樂";
    proGressTaskID = setInterval(function () {
        getProgress();
        getProTime();
        getMusicStatus();
    }, 100);
    info.children[0].innerText = audio.title;

}

//暫停音樂
function pauseMusic() {
    audio.pause();
    play.innerText = "4";
    play.onclick = playMusic;
    play.title = "播放音樂";
    info.children[0].innerText = "歌曲暫停";
}

//停止音樂
function stopMusic() {
    pauseMusic();
    audio.currentTime = 0;
    clearInterval(proGressTaskID);
    info.children[0].innerText = "歌曲停止";

}

//音樂倒退或快進
function changePro(t) {
    audio.currentTime += t;
}

//靜音
function muted() {
    audio.muted = true;
    musicMuted.innerText = "V";
    musicMuted.onclick = unmuted;

}

//解除靜音
function unmuted() {
    audio.muted = false;
    musicMuted.innerText = "U";
    musicMuted.onclick = muted;

}

function getProTime() {
    info.children[1].innerText = getTimeFormat(audio.currentTime) + "/" + getTimeFormat(audio.duration);

}

//時間格式轉換
function getTimeFormat(t) {
    m = parseInt(t / 60);
    s = parseInt(t % 60);

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    return m + ":" + s;
}

//設定音量
function setVolumeByRangBar() {
    audio.volume = volChangeBar.value / 100;
    musicVolume.value = parseInt(audio.volume * 100);
    
    w=musicVolume.value;
    volController.children[0].style.backgroundImage = `-webkit-linear-gradient(left,blue ${w}%,blanchedalmond ${w}%)`;
}
function changeVolume(v) {
    volChangeBar.value = parseInt(volChangeBar.value) + v;

    setVolumeByRangBar();

}
/* 
function reduceVolumeByBtn(){
    audio.volume -= 1/100;
}

function plusVolumeByBtn(){
    audio.volume += 1/100;
}
 */

//tolProGress = audio.duration;

//設定進程
function setProgress() {
    //tolProGress = audio.duration;
    audio.currentTime = parseInt(progressBar.value) * audio.duration / progressBar.max;
}

//讀取進程
function getProgress() {
    progressBar.value = audio.currentTime / audio.duration * progressBar.max;
    w = audio.currentTime / audio.duration * 100;
    progressBar.style.backgroundImage = `-webkit-linear-gradient(left,red ${w}%,blanchedalmond ${w}%)`;
}

//切換歌單音樂
function changeMusic(n) {
    var i = musicPool.selectedIndex + n;

    i = setOverRange(i);
    audio.src = musicPool.children[i].value;
    audio.title = musicPool.children[i].innerText;
    musicPool.children[i].selected = true;

    //如果音樂播放時，點擊下一首，音樂從下一首音樂從頭播放
    play.innerText == ";" ? playMusic() : "";
    //如果音樂暫停時，點擊下一首，音樂切換到下一首，不播放
    //如果音樂停止時，點擊下一首，音樂切換到下一首，不播放
    //play.innerText == "4" ? stopMusic():"";

}

//處理超過歌曲範圍的上一首與下一首
function setOverRange(i) {
    i = (i + musicPool.children.length) % musicPool.children.length;
    return i;
}

//單曲,隨機與全部播放狀態
function setLoopFunc() {
    clearBtnColor();
    event.target.className = info.children[2].innerText != event.target.title ? "btnBColor" : "";
    info.children[2].innerText = info.children[2].innerText != event.target.title ? event.target.title : "正常";
}


//檢查歌曲是否結束
function getMusicStatus() {
    if (audio.currentTime == audio.duration) {
        //alert("歌曲播放結束")
        if (info.children[2].innerText == "單曲循環") {
            changeMusic(0);
        } else if (info.children[2].innerText == "隨機播放") {

            r = Math.floor(Math.random() * (musicPool.children.length));
            r -= musicPool.selectedIndex;
            //隨機到下一首的防呆
            console.log(r, musicPool.selectedIndex);
            r = r == musicPool.selectedIndex ? setOverRange(r + 1) : r;
            console.log(r, musicPool.selectedIndex);
            //r = r-musicPool.selectedIndex;
            //i = musicPool.selectedIndex + (r-musicPool.selectedIndex);
            changeMusic(r);
        } else if (info.children[2].innerText == "全曲播放" && musicPool.selectedIndex == musicPool.children.length - 1) {
            changeMusic(0 - musicPool.selectedIndex);
        } else if (musicPool.selectedIndex == musicPool.children.length - 1) {
            stopMusic();
        } else {
            changeMusic(1);
        }
    }
}

//清除按鈕顏色
function clearBtnColor() {
    for (i = 9; i < controlPanel.children.length; i++) {
        controlPanel.children[i].className = "";
    }
}

//啟動功能之後，如果歌曲結束，則重新播放同一支歌曲
//單曲循環
/*     function setSingleLoop() {
        clearBtnColor();
        //audio.loop = !audio.loop;
        //event.target.className = audio.loop ? "btnBColor" : "";
        event.target.className = info.children[2].innerText != "單曲循環" ? "btnBColor" : "";
        info.children[2].innerText = info.children[2].innerText != "單曲循環" ? "單曲循環" : "單曲播放";
    }

    //啟動功能之後，如果歌曲結束，則依據歌單，播放下一支歌曲
    //隨機播放
    function setRandom() {
        clearBtnColor();
        event.target.className = info.children[2].innerText != "隨機播放" ? "btnBColor" : "";
        info.children[2].innerText = info.children[2].innerText != "隨機播放" ? "隨機播放" : "單曲播放";
    }

    //啟動功能之後，如果歌曲結束，則依據歌單，播放下一支歌曲
    //全曲循環
    function setMutitudeLoop() {
        clearBtnColor();
        event.target.className = info.children[2].innerText != "全曲播放" ? "btnBColor" : "";
        info.children[2].innerText = info.children[2].innerText != "全曲播放" ? "全曲播放" : "單曲播放";
    }
 */
