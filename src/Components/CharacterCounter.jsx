import React from 'react'
import PropTypes from 'prop-types'

export const CharacterCounter = ({ input, maxCount }) => {

  console.log(`CharNo: ${input.length}`)

  const outputVal = () => {
    return (input.length < maxCount) ? maxCount - input.length : `Over by ${Math.abs(maxCount - input.length)} characters`
  }

  return (
    <div>
      Characters remaining: {outputVal()}
    </div>
  )
}

CharacterCounter.propTypes = {
  input: PropTypes.string.isRequired,
  maxCount: PropTypes.number.isRequired
}