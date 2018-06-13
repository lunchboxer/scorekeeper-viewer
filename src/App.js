import React, { Component } from 'react'
import './App.css'
import client from './feathers.js'
import LoginForm from './Components/LoginForm'
import ScoreboardLoader from './Components/ScoreboardLoader'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { sessions: [] }
    this.authenticatedListener = this.authenticatedListener.bind(this)
    this.sessionCreatedListener = this.sessionCreatedListener.bind(this)
    this.sessionPatchedListener = this.sessionPatchedListener.bind(this)
    this.sessionRemovedListener = this.sessionRemovedListener.bind(this)
    this.getSessions = this.getSessions.bind(this)
  }

  getSessions() {
    const now = new Date()
    const recently = new Date(now.valueOf() - 15 * 6e4).toISOString()
    const soon = new Date(now.valueOf() + 15 * 6e4).toISOString()
    client
      .service('class-sessions')
      .find({
        query: {
          startsAt: { $lte: soon },
          endsAt: { $gte: recently }
        }
      })
      .then(sessions => {
        this.setState({ sessions: sessions.data })
      })
  }

  authenticatedListener(login) {
    this.setState({ login })
    this.getSessions()
    setInterval(this.getSessions, 24e4)
  }

  logoutListener() {
    this.setState({
      login: null,
      sessions: null
    })
    clearInterval(this.getSessions)
  }

  isCurrent(session) {
    const now = new Date()
    const recently = new Date(now.valueOf() - 15 * 6e4).toISOString()
    const soon = new Date(now.valueOf() + 15 * 6e4).toISOString()
    if (session.startsAt <= soon && session.endsAt >= recently) {
      return true
    }
    return false
  }

  sessionCreatedListener(session) {
    if (this.isCurrent(session)) {
      this.setState({
        sessions: this.state.sessions.concat(session)
      })
    }
  }

  sessionRemovedListener(removedSession, context) {
    this.setState({
      sessions: this.state.sessions.filter(
        session => session.id !== removedSession.id
      )
    })
  }

  sessionPatchedListener(patchedSession) {
    const { sessions } = this.state
    var found = false
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].id === patchedSession.id) {
        if (this.isCurrent(patchedSession)) {
          sessions[i] = patchedSession
        } else {
          sessions.splice(i, 1)
        }
        this.setState({ sessions })
        found = true
        break
      }
    }
    if (!found && this.isCurrent(patchedSession)) {
      this.setState({ sessions: this.state.sessions.concat(patchedSession) })
    }
  }

  componentDidMount() {
    client.authenticate().catch(() => this.setState({ login: null }))
    client.on('authenticated', this.authenticatedListener)
    client.on('logout', this.logoutListener)
    client.service('class-sessions').on('created', this.sessionCreatedListener)
    client.service('class-sessions').on('removed', this.sessionRemovedListener)
    client.service('class-sessions').on('patched', this.sessionPatchedListener)
  }

  render() {
    return (
      <div className="App">
        {!this.state.login ? (
          <LoginForm />
        ) : (
          <ScoreboardLoader sessions={this.state.sessions} />
        )}
      </div>
    )
  }
}

export default App
