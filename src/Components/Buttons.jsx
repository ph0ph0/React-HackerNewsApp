import React from 'react';
import PropTypes from 'prop-types'

export const PlusButton = ({ clickAction, clickValue }) => {
    return (
      <button 
      onClick = {() => {clickAction(clickValue)}}
      >
        +{clickValue}
      </button>
    )
  }

  PlusButton.propTypes = {
    clickAction: PropTypes.func.isRequired,
    clickValue: PropTypes.number.isRequired
  }

export const ResetButton = ({clickAction}) => {
    return (
      <button onClick = {clickAction}>
        Reset
      </button>
    )
  }
  
  ResetButton.propTypes = {
    clickAction: PropTypes.func.isRequired
  }

export function Button({ onClick, className, children }) {

    return (
      <button 
        onClick = {onClick}
        className = {className}
        type = "button" 
      >
        {children}
      </button>
    )
}

Button.propTypes = {
onClick: PropTypes.func.isRequired,
className: PropTypes.string,
children: PropTypes.node
}