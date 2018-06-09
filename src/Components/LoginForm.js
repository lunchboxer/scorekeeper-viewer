import React, { Component } from 'react'
import client from '../feathers.js'

// here do the logic and server connected stuff

class LoginFormLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  updateField(name, ev) {
    this.setState({ [name]: ev.target.value })
  }
  login() {
    const { email, password } = this.state

    return client
      .authenticate({
        strategy: 'local',
        email,
        password
      })
      .catch(error => this.setState({ error }))
  }
  signup() {
    const { email, password } = this.state

    return client
      .service('users')
      .create({ email, password })
      .then(() => this.login())
  }

  render() {
    return (
      <div>
        <input
          type="text"
          name="email"
          onChange={ev => this.updateField('email', ev)}
        />
        <input
          type="password"
          name="password"
          onChange={ev => this.updateField('password', ev)}
        />
        <button onClick={() => this.login()}>Log in</button>
        <button onClick={() => this.signup()}>Sign up</button>
      </div>
    )
  }
}

export default LoginFormLoader
