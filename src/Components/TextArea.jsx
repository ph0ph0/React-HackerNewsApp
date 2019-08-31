import React from 'react'
import PropTypes from 'prop-types'

export const TextArea = ({ rows, columns, placeholder, value, onChange }) => {
    return (
      <textarea 
          rows = {rows} 
          columns = {columns} 
          placeholder={placeholder}
          value = {value}
          onChange = {onChange} 
          />
    )
  }
  
  TextArea.propTypes = {
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }