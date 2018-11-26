import React, { Component } from 'react'
import $ from 'jquery';
import Recorder from 'react-mp3-recorder'
import ReactAudioPlayer from 'react-audio-player'

import blobToBuffer from 'blob-to-buffer'

export default class App extends Component {
  state = {
    url: ''
  }

  render () {
    const {
      url
    } = this.state

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '100vh'
          }}
        >
          <div>
            <Recorder
              onRecordingComplete={this._onRecordingComplete}
              onRecordingError={this._onRecordingError}
              style={{
                margin: '0 auto'
              }}
            />

            <p>
              Click and hold to start recording.
            </p>

            {url && (
              <div>
                <ReactAudioPlayer
                  src={url}
                  controls
                  style={{
                    minWidth: '500px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  _onRecordingComplete = (blob) => {
    blobToBuffer(blob, (err, buffer) => {
      if (err) {
        console.error(err)
        return
      }

      console.log('recording', blob)

      $.ajax({
        type: 'POST',
        url: 'https://api.wit.ai/speech?v=20181126',
        headers: {
          'Authorization': 'Bearer VZE6UQD4FZJQZZ65CJCSNMC23EGEJ7N7',
          'Content-Type': 'audio/mpeg3'
        },
        data: blob,
        processData: false,
        success: function(json) {
          console.log(json);
        },
        error: function(error) {
          console.log('ERR: ');
          console.log(error);
        }
      });

      if (this.state.url) {
        window.URL.revokeObjectURL(this.state.url)
      }

      this.setState({
        url: window.URL.createObjectURL(blob)
      })
    })
  }

  _onRecordingError = (err) => {
    console.log('error recording', err)

    if (this.state.url) {
      window.URL.revokeObjectURL(this.state.url)
    }

    this.setState({ url: null })
  }
}
