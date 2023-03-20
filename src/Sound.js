const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export class Sound {
  constructor(frequency, volume, duration, type) {
    this.frequency = frequency
    this.volume = volume
    this.duration = duration
    this.type = type
  }
  async play() {

    audioCtx.resume()

    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    gainNode.gain.value = this.volume
    oscillator.frequency.value = this.frequency
    oscillator.type = this.type

    oscillator.start()

    setTimeout(
      () => oscillator.stop(),
      this.duration
    )
  }
}