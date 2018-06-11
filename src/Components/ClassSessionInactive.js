import React from 'react'

const ClassSessionInactive = ({ session }) => {
  return (
    <div>
      <h3>Waiting for controller to activate class session</h3>
      <p>Starts at: {session.startsAt}</p>
      <p>Ends at: {session.endsAt}</p>
    </div>
  )
}

export default ClassSessionInactive
