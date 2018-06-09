import React, { Component } from 'react'
import client from '../feathers.js'
import ScoreboardRow from './ScoreboardRow'

const styles = {
  root: {
    width: '100%'
  },
  stretch: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    margin: 0,
    paddingBottom: '12px',
    fontSize: '2.5em',
    fontWeight: 'bold'
  }
}

class Scoreboard extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    client
      .service('student-groups')
      .get(this.props.session.studentGroupId)
      .then(group => {
        this.setState({ group })
        console.log(this.state.group.name)
      })
  }
  render() {
    if (!this.state.group) {
      return <h2>Loading group</h2>
    }
    return (
      <div style={styles.root}>
        <h2 style={styles.title}>{this.state.group.name}</h2>
        {!this.state.group.students ? (
          <p>There are no students in this class</p>
        ) : (
          <div style={styles.stretch}>
            {this.state.group.students.map(student => (
              <ScoreboardRow
                key={student.id}
                student={student}
                classSessionId={this.props.session.id}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default Scoreboard
