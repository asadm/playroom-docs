export const audios = {
  car_start: new Audio("/audios/car_start.mp3"),
};

export const playAudio = (audio) => {
  audio.currentTime = 0;
  audio.play();
};
