/* global define:true Howl:true */

define([], () => {
  class Sounds {
    constructor() {
      this.sources = [
        { name: 'gunshot', url: './sound/sfx/guns/gunshot.wav' },
        { name: 'rifle', url: './sound/sfx/guns/rifle.wav' },
        { name: 'rifle2', url: './sound/sfx/guns/rifle2.wav' },
        { name: 'rifle3', url: './sound/sfx/guns/rifle3.wav' },
        { name: 'rifle4', url: './sound/sfx/guns/rifle4.wav' },
        { name: 'shotgun', url: './sound/sfx/guns/shotgun.wav' },
        { name: 'shotgun2', url: './sound/sfx/guns/shotgun2.wav' },
        { name: 'yes-sir', url: './sound/sfx/voice/sir.wav' },
        { name: 'break-1-9', url: './sound/sfx/voice/break-1-9.wav' },
        { name: 'bug-out', url: './sound/sfx/voice/bug-out.wav' },
        { name: 'rock-n-roll', url: './sound/sfx/voice/rock-n-roll.wav' },
        { name: 'mortar', url: './sound/sfx/explosions/mortar.wav' },
      ];
      this.sounds = [];
      for (let h = 0; h < this.sources.length; h += 1) {
        const audio = new Howl({
          src: [this.sources[h].url],
        });
        this.sounds.push({
          name: this.sources[h].name,
          audio,
        });
      }
    }

    play(name) {
      const sound = this.sounds.find(item => item.name === name);
      sound.audio.play();
    }

    /*
    * Play random audio file from provided array
    *
    */
    playRandom(arr) {
      const random = Math.floor(Math.random() * arr.length);
      this.play(arr[random]);
    }
  }

  return Sounds;
});
