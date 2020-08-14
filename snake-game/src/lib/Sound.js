
  let volume = 0.8
  const playSound = (sound, loop, volumeOverride) => {
    var sound = new Audio(require(`../assets/sounds/${sound}`))
    sound.volume = volumeOverride ? volumeOverride : volume


    if (loop)
      sound.loop = true

    const playedPromise = sound.play()
    if (playedPromise) {
      playedPromise.catch((e) => {
        if (e.name === 'NotAllowedError' ||
          e.name === 'NotSupportedError') {
          console.log('Audio play not supported')
        }
      });
    }
  }

const setVolume = (newVolume) => {
    volume = newVolume
}

const getVolume = () => {
    return volume
}

module.exports = {
    playSound,
    getVolume,
    setVolume,
}