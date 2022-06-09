const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const progress = $("#progress");
const player = $(".player");
const playBtn = $(".btn-toggle-play");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat")
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      ep: "What do you mean",
      singer: "Justin Bieber",
      path: "./assets/music/WDYM.mp3",
      image: "./assets/img/JB.png",
    },
    {
      ep: "Goodbyes",
      singer: "Post Malone",
      path: "./assets/music/Goodbyes.mp3",
      image: "./assets/img/Posty.jfif",
    },
    {
      ep: "Mặt trời của em",
      singer: "Phương Ly",
      path: "./assets/music/MatTroiCuaEm.mp3",
      image: "./assets/img/PhuongLy.jfif",
    },
    {
      ep: "Perfect",
      singer: "One Direction",
      path: "./assets/music/Perfect.mp3",
      image: "./assets/img/1D.jfif",
    },
    {
      ep: "Style",
      singer: "Taylor Swift",
      path: "./assets/music/Style.mp3",
      image: "./assets/img/TS.jfif",
    },
    {
      ep: "Chạy Ngay Đi",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/ChayNgayDi.mp3",
      image: "./assets/img/ST.jfif",
    },
    {
        ep: "Như anh mơ",
        singer: "PC",
        path: "./assets/music/Nhuanhmo.mp3",
        image: "./assets/img/PC.jfif",
    },
    {
        ep: "Ngày tận thế",
        singer: "Tóc Tiên",
        path: "./assets/music/Ngaytanthe.mp3",
        image: "./assets/img/TocTien.jfif",
    },
    {
        ep: "Thanh xuân",
        singer: "Da LAB",
        path: "./assets/music/Thanhxuan.mp3",
        image: "./assets/img/DaLAB.jpg",
    },
    {
      ep: "Thinking out loud",
      singer: "Ed Sheeran",
      path: "./assets/music/Thinkingoutloud.mp3",
      image: "./assets/img/Ed.jfif",
  },

  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `  
        <div class="song ${index === this.currentIndex ? 'active' : ''}">
        <div class="thumb" 
          style="background-image: url('${song.image}')">
        </div>
        <div class="body">
        <h3 class="title">${song.ep}</h3>
        <p class="author">${song.singer}</p>
        </div>
        <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>
    `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "CurrentSong", {
      get:() =>{
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    //xử lý cd quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      interations: Infinity,
    });
    cdThumbAnimate.pause();
    //xử lý phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const NewcdWidth = cdWidth - scrollTop;

      cd.style.width = NewcdWidth > 0 ? NewcdWidth + "px" : 0;
      cd.style.opacity = NewcdWidth / cdWidth;
    };
    //xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //khi bài hát chạy
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
      console.log(player);
    };
    //khi bài hát dừng
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //Xử lý khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render()
    };
    prevBtn.onclick = function () {
        if (_this.isRandom) {
            _this.playRandomSong();
          } else {
            _this.prevSong();
          }
      audio.play();
      _this.render()
    };
    //Xử lý bật/tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //Xử lý lặp lại bài hát
    repeatBtn.onclick = function(e){
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
    }
     //Xử lý next song khi audio ended
     audio.onended = function(){
        if(_this.isRepeat){
            audio.play()
        } else{
            nextBtn.click()
        }
    }
  },
  scrollToActiveSong: function(){
    setTimeout(()=>{
        $('.song.active').scrollIntoview({
            behavior:'smooth',
            block: 'nearest',
        })
    },300)
  },
  loadCurrentSong: function () {
      console.log(this.CurrentSong);
    heading.textContent = this.CurrentSong.ep;
    cdThumb.style.backgroundImage = `url('${this.CurrentSong.image}')`;
    audio.src = this.CurrentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //Định nghĩa thuộc tính object
    this.defineProperties();

    //xử lý các sự kiện
    this.handleEvents();

    //tải thông tin bài hát đầu tiên vào ứng dụng
    this.loadCurrentSong();

    //render playlist
    this.render();
  },
};
app.start();
console.log(app);