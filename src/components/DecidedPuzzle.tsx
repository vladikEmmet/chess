import React from 'react'
import { Link } from 'react-router-dom'

const DecidedPuzzle = () => {
  return (
    <div className="puzzle-popup decided-puzzle-container">
        <h1>Decided!</h1>
        <Link to="/" className="puzzle-back-to-menu-link">Back to menu</Link>
    </div>
  )
}

export default DecidedPuzzle