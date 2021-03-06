
  let volume = 0.8
  let muted = false
  let backOff = false

  const playSound = (mp3, loop, volumeOverride) => {
    if(muted || backOff)
      return
   
    var sound = new Audio(require(`../assets/sounds/${mp3}`))
    sound.volume = volumeOverride ? volumeOverride : volume


    if (loop)
      sound.loop = true

    const playedPromise = sound.play()
    if (playedPromise) {
      backOff = true
      setTimeout(() => {backOff = false}, 100)
      playedPromise.catch((e) => {
        if (e.name === 'NotAllowedError' ||
          e.name === 'NotSupportedError') {
          console.log('Audio play not supported')
        }
      })
    }
  }

const setVolume = (newVolume) => {
    volume = newVolume
}

const getVolume = () => {
    return volume
}

const getMuteStatus = () => {
  return muted
}

const muteSwitch = () => {
  muted = !muted
  localStorage.setItem('sound', muted)
}

module.exports = {
    playSound,
    getVolume,
    getMuteStatus,
    setVolume,
    muteSwitch,
}