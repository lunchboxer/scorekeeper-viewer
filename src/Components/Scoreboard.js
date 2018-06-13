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
    this.attendanceCreatedListener = this.attendanceCreatedListener.bind(this)
    this.attendanceUpdatedListener = this.attendanceUpdatedListener.bind(this)
  }

  studentAttendanceStatus(student) {
    if (!this.state.attendances) {
      return 'absent'
    }
    const studentAttendance = this.state.attendances.find(
      attendance => attendance.studentId === student.id
    )
    if (studentAttendance) {
      return studentAttendance.status
    } else {
      return 'absent'
    }
  }

  attendanceCreatedListener(attendance) {
    if (attendance.classSessionId === this.props.session.id) {
      this.setState({
        attendances: this.state.attendances.concat(attendance)
      })
    }
  }

  attendanceUpdatedListener(updatedAttendance) {
    const attendances = this.state.attendances
    for (var i = 0; i < attendances.length; i++) {
      if (attendances[i].id === updatedAttendance.id) {
        attendances[i].status = updatedAttendance.status
        this.setState({ attendances })
        break
      }
    }
  }

  componentDidMount() {
    client
      .service('student-groups')
      .get(this.props.session.studentGroupId)
      .then(group => {
        this.setState({ group })
      })
    client
      .service('attendances')
      .find({ query: { classSessionId: this.props.session.id } })
      .then(attendances => {
        this.setState({ attendances: attendances.data })
      })
    client.service('attendances').on('created', this.attendanceCreatedListener)
    client.service('attendances').on('patched', this.attendanceUpdatedListener)
  }

  componentWillUnmount() {
    client
      .service('attendances')
      .removeListener('created', this.attendanceCreatedListener)
    client
      .service('attendances')
      .removeListener('patched', this.attendanceUpdatedListener)
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
                status={this.studentAttendanceStatus(student)}
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
