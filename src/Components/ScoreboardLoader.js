import React, { Component } from 'react'
import Scoreboard from './Scoreboard'

class ScoreboardLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { sessions } = this.props
    if (!sessions || sessions.length === 0) {
      return (
        <div>
          <h2>No current class sessions</h2>
          <p>
            Add a new session or wait until it's time for an existing scheduled
            class session.
          </p>
        </div>
      )
    }
    if (sessions.length === 1) {
      return (
        <div>
          {sessions[0].studentGroupId ? (
            <Scoreboard session={sessions[0]} />
          ) : (
            <h3>
              The class session starting at {sessions[0].startsAt} doesn't have
              student group associated yet.
            </h3>
          )}
        </div>
      )
    }
    return (
      <div>
        <h2>There's more than one class session available</h2>
        <ul>
          {sessions.map(session => (
            <li key={session.id}>{session.startsAt}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ScoreboardLoader
