import React, { Component } from 'react'
import Scoreboard from './Scoreboard'
import ClassSessionInactive from './ClassSessionInactive'
import ClassSessionEnded from './ClassSessionEnded'
import ClassSessionActive from './ClassSessionActive'

class ScoreboardLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  switchStage = session => {
    switch (session.stage) {
      case 'Active':
        return <ClassSessionActive session={session} />
      case 'Started':
        return <Scoreboard session={session} />
      case 'Ended':
        return <ClassSessionEnded session={session} />
      default:
        return <ClassSessionInactive session={session} />
    }
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
            this.switchStage(sessions[0])
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
