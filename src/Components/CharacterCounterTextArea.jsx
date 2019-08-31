import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextArea } from './TextArea'
import { CharacterCounter } from './CharacterCounter'


export const CharacterCounterTextArea = ({ rows, columns, placeholder, maxCount }) => {

    // useState react hook provides state for function components via a getter and setter
    var [inputValue, setInputValue] = useState("")
  
    // called each time the onChange event handler of the text area is called ie each time characters are entered
    const handleChange = (event) => {
      const element = event.target
      setInputValue(element.value)
    }
  
      return (
        <div>
          <TextArea 
          rows = {rows} 
          columns={columns} 
          placeholder={placeholder}
          value = {inputValue}
          onChange = {handleChange} 
          />
          <div>
            <CharacterCounter
            input = {inputValue}
            maxCount = {maxCount}
            />
          </div>
        </div>
      )
    }
  
    CharacterCounterTextArea.propTypes = {
      rows: PropTypes.number.isRequired,
      columns: PropTypes.number.isRequired,
      placeholder: PropTypes.string.isRequired,
      maxCount: PropTypes.number.isRequired
    }