import React from 'react';
import PropTypes from 'prop-types'
import { Button } from './Buttons'

export const SortHeader = ({ sortKey, onSort, children, activeSortKey }) => {

    const sortClass = ["button-inline"]
  
    if (activeSortKey === sortKey) {
      sortClass.push("button-active")
    }
  
    return (
      <Button
      onClick = {() => onSort(sortKey)}
      className= {sortClass.join(' ')}
      >
        {children}
      </Button>
    )
  }

SortHeader.propTypes = {
    sortClass: PropTypes.string,
    onSort: PropTypes.func,
    children: PropTypes.node,
    activeSortKey: PropTypes.string
}