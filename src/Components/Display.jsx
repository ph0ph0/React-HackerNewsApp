import React from 'react'
import PropTypes from 'prop-types'

export const Display = ({ content }) => {
    return (
      <pre>
        {content}
      </pre>
    )
  }
  
  Display.propTypes = {
    content: PropTypes.number
  }