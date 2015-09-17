import React, {PropTypes as T} from 'react';
import { SoundAsset } from './SoundAsset';

function noop() {}

const playStatuses = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
};

export default class Sound extends React.Component {
  static status = playStatuses;

  static propTypes = {
    asset: T.instanceOf(SoundAsset),
    playStatus: T.oneOf(Object.keys(playStatuses)).isRequired,
    playFromPosition: T.number,
    stopAt: T.number,
    volume: T.number,

  };

  static defaultProps = {
    playFromPosition: 0,
    volume: 50,
  };

  constructor() {
    super();
    this.state = {
      sound: null,
    };
  }

  componentDidMount() {
    this.loadAsset();
  }

  loadAsset() {
    return this.props.asset.getSound()
      .then((sound) => this.setState({ sound }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.asset !== prevProps.asset) {
      this.loadAsset();
    }

    if (!this.state.sound) {
      if (prevState.sound) {
        prevState.sound.stop();
      }
      return;
    }

    const { sound } = this.state;

    if (sound && !prevState.sound) {
      if (this.props.playStatus === playStatuses.PLAYING) {
        sound.play();
      }
      if (this.props.volume) {
        sound.setVolume(this.props.volume);
      }
    }

    if (this.props.volume !== prevProps.volume) {
      if (this.props.volume) {
        sound.setVolume(this.props.volume);
      }
    }

    if (this.props.playStatus === playStatuses.PLAYING) {
      if (prevProps.playStatus === playStatuses.STOPPED) {
        sound.play();
      } else if (prevProps.playStatus === playStatuses.PAUSED) {
        sound.resume();
      }
    } else if (this.props.playStatus === playStatuses.STOPPED && prevProps.playStatus !== playStatuses.STOPPED) {
      sound.stop();
    } else {// 'PAUSED'
      if (prevProps.playStatus === playStatuses.PLAYING) {
        sound.pause();
      }
    }

    if (this.props.playFromPosition !== prevProps.playFromPosition) {
      sound.setPosition(this.props.playFromPosition);
    }
  }

  render() {
    return <noscript />;
  }
}
