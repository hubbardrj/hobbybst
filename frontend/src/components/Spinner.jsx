import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
export default function Spinner() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress color="primary" />
    </div>
  )
}
