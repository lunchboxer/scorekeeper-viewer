import React, { Component } from 'react'
import './App.css'
import client from './feathers.js'
import LoginForm from './Components/LoginForm'
import ScoreboardLoader from './Components/ScoreboardLoader'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    client.authenticate().catch(() => this.setState({ login: null }))
    client.on('authenticated', login => {
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
          this.setState({ sessions: sessions.data, login })
        })
    })
    client.service('class-sessions').on('created', session =>
      this.setState({
        sessions: this.state.sessions.concat(session)
      })
    )
    client
      .service('class-sessions')
      .on('removed', (removedSession, context) => {
        this.setState({
          sessions: this.state.sessions.filter(
            session => session.id !== removedSession.id
          )
        })
      })
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
