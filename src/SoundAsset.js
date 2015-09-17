import { soundManager } from 'soundmanager2';

let _setupOnce = null;
const setup = () => {
  if (!_setupOnce) {
    _setupOnce = new Promise((resolve) => {
      soundManager.setup({
        'useHTML5Audio': true,
        'preferFlash': false,
        'debugMode': !process.env.production,
        onready() {
          resolve(true);
        }
      });
    });
  }
  return _setupOnce;
};

const states = {
  LOADING: 'LOADING',
  READY: 'READY',
}

export default class SoundAsset {
  constructor({ id, whenLoaded, ...rest }) {
    this._sound = setup().then(() => {
      if (id) {
        const sound = soundManager.getSoundById(id);
        if (sound) {
          return sound;
        }
      }
      return soundManager.createSound({
        id,
        ...rest,
      });
    });
  }

  getSound() {
    return this._sound;
  }

  whenLoaded(rate, interval = 250) {
    const hasLoaded = (sound) =>  {
      const { bytesLoaded, bytesTotal } = sound;
      if (!bytesLoaded) {
        return false;
      }
      return bytesLoaded / bytesTotal >= rate;
    };
    return this._sound
      .then((sound) => {
        if (hasLoaded(sound)) {
          return sound;
        }
        return new Promise((resolve) => {
          const timedCheck = () => {
            if (hasLoaded(sound)) {
              return resolve(sound);
            }
            setTimeout(timedCheck, interval);
          };
          setTimeout(timedCheck, interval);
        });
      });
  }

}
