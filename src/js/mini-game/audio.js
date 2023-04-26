"use strict";
const soundArray = [];
const soundArray2 = [];
const soundArray3 = [];
function soundSetting(soundArray, soundSrc) {
  for (let i = 0; i < 10; i++) {
    const sound = new Audio();
    sound.src = soundSrc;
    sound.volume = 0.5;
    // 크롬 예외 처리: audio 재생이 끝나면, 다시 로드해준다
    sound.addEventListener("ended", function () {
      if (window.chrome) {
        this.load();
      }
      this.pause();
    });

    soundArray.push(sound);
  }
}

function playSound(sound) {
  for (let i = 0; i < sound.length; i++) {
    if (sound[i].paused) {
      // 재생중이 아닌 Audio객체를 찾아서
      sound[i].play(); // 1회만 재생하고
      break; // 반복문을 나간다.
    }
  }
}

function stopSound(sound) {
  for (let i = 0; i < sound.length; i++) {
    sound[i].pause();
  }
}

function resetSound() {
  stopSound(soundArray);
  stopSound(soundArray2);
  stopSound(soundArray3);
  soundArray.splice(0);
  soundArray2.splice(0);
  soundArray3.splice(0);
}
export {
  playSound,
  soundSetting,
  resetSound,
  soundArray,
  soundArray2,
  soundArray3,
};
