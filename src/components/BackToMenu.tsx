import React from 'react'

interface BackToMenuProps {
    handleClick: () => void;
}

const BackToMenu = ({handleClick}: BackToMenuProps) => {
  return (
    <button className="goback-btn" onClick={handleClick}>
        <span>Back to menu</span>
    </button>
  )
}

export default BackToMenu