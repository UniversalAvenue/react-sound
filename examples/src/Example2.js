import React, { Component } from 'react';
import { Sound, SoundAsset } from 'react-sound';

const url = 'https://raw.githubusercontent.com/scottschiller/SoundManager2/master/demo/_mp3/bass.mp3';
// const url = 'https://api.soundcloud.com/tracks/224131662/stream?secret_token=s-7gQIB&client_id=4d0f4f08f09c7886ae92d3ef878bc3c6';


export default class Example2 extends Component {
  constructor() {
    super();
    this.state = {
      playStatus: Sound.status.STOPPED,
      volume: 10,
      asset: new SoundAsset({
        autoLoad: true,
        id: 'bass',
        url,
        onfinish: () => this.setState({ playStatus: Sound.status.STOPPED })
      })
    }
  }
  componentDidMount() {
  }
  render() {
    const isPaused = this.state.playStatus !== Sound.status.PLAYING;
    return (<div>
      <button onClick={() => this.setState({ playStatus: isPaused ? Sound.status.PLAYING : Sound.status.PAUSED })}>{isPaused ? 'Play' : 'Pause' } Bass</button>
      <Sound
        volume={this.state.volume}
        asset={this.state.asset}
        playStatus={this.state.playStatus}
        playFromPosition={0}
        onLoading={({bytesLoaded, bytesTotal}) => console.log(`${bytesLoaded / bytesTotal * 100}% loaded`)}
        onPlaying={({position}) => console.log(position)}
        onFinishedPlaying={() => this.setState({playStatus: Sound.status.STOPPED})} />
    </div>);
  }
}
