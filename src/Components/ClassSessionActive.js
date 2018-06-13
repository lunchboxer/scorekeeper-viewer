import React, { Component } from 'react'
import openingSoundFile from '../sounds/heavenly-glissando-choir.wav'

class ClassSessionActive extends Component {
  constructor(props) {
    super(props)
    const timeToStart = this.getTimeToStart()
    this.state = { timeToStart }
    this.openingSound = new Audio(openingSoundFile)
    this.getTimeToStart = this.getTimeToStart.bind(this)
    this.timeForClassFanfare = this.timeForClassFanfare.bind(this)
    this.updateTimeToStart = this.updateTimeToStart.bind(this)
  }
  getTimeToStart() {
    const { startsAt } = this.props.session
    const startTime = new Date(startsAt)
    let now = new Date()
    let diffTotal = startTime - now
    var diffMins = Math.floor((diffTotal % 3600000) / 60000)
    var diffSecs = Math.round(((diffTotal % 3600000) % 60000) / 1000)
    return { diffMins, diffSecs, diffTotal }
  }
  updateTimeToStart() {
    const timeToStart = this.getTimeToStart()
    this.setState({ timeToStart })
  }
  timeForClassFanfare() {
    this.openingSound.play()
  }
  componentDidMount() {
    if (this.state.timeToStart.diffTotal > 0) {
      setTimeout(
        this.timeForClassFanfare,
        this.state.timeToStart.diffTotal + 1000
      )
    }
    setInterval(this.updateTimeToStart, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.getTimeToStart)
    clearTimeout(this.timeForClassFanfare)
  }

  render() {
    return (
      <div>
        {!this.state.timeToStart ? null : this.state.timeToStart.diffTotal <
        0 ? (
          <h1>Time for class!</h1>
        ) : (
          <div>
            <h2>Class will start soon. Get ready!</h2>
            <h1>
              {this.state.timeToStart.diffMins > 0
                ? `${this.state.timeToStart.diffMins} minutes and `
                : null}
              {this.state.timeToStart.diffSecs} seconds to go
            </h1>
          </div>
        )}
      </div>
    )
  }
}

export default ClassSessionActive
