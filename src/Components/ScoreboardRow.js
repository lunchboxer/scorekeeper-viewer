import React, { Component } from 'react'
import Star from './Star.js'
import './ScoreboardRow.css'
import client from '../feathers.js'
import goodSoundFile from '../sounds/ui-confirmation-alert-a5min.wav'
import badSoundFile from '../sounds/quick-fart.wav'

const glowTimeout = 4000

class ScoreboardRow extends Component {
  constructor(props) {
    super(props)
    this.goodsound = new Audio(goodSoundFile)
    this.badsound = new Audio(badSoundFile)
    this.state = { glow: false }
  }
  highlightPointsChange = value => {
    if (value > 0) {
      this.goodsound.play()
    } else {
      this.badsound.play()
    }
    this.setState({ glow: true })
    setTimeout(() => {
      this.setState({ glow: false })
    }, glowTimeout)
  }
  sumOfPointValues = points => {
    return points.reduce((sum, point) => {
      return sum + point.value
    }, 0)
  }

  rangeOfPointValues = points => {
    const sum = this.sumOfPointValues(points)
    return [...Array(sum).keys()]
  }

  componentDidMount() {
    // connect to the student service and subscribe to point changes
    client
      .service('points')
      .find({
        query: {
          studentId: this.props.student.id,
          classSessionId: this.props.classSessionId
        }
      })
      .then(points => {
        this.setState({ points: points.data })
      })
    client.service('points').on('created', point => {
      // only deal with points relevant to this student and classSession
      // perhaps istead of having every row process every point, move the state up to scoreboard instead.
      if (
        point.studentId === this.props.student.id &&
        point.classSessionId === this.props.classSessionId
      ) {
        this.setState({ points: this.state.points.concat(point) })
        this.highlightPointsChange(point.value)
      }
    })
  }
  render() {
    const { student } = this.props
    const { points } = this.state
    return (
      <div>
        <div className={this.state.glow ? 'glow' : 'container'}>
          <div className="name">
            <span>{student.englishName}</span>
          </div>
          {points ? (
            <div className="stars">
              {this.rangeOfPointValues(points).map((point, index) => (
                <Star index={index} key={index} />
              ))}
            </div>
          ) : (
            <div>
              <p>loading</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default ScoreboardRow
