import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { SortHeader } from './SortHeader'
import {Button } from './Buttons'
import { SORTS } from '../Constants/Constants.js'

export class Table extends Component {

    constructor(props) {
      super(props)
  
      this.state = {
        sortKey: "NONE",
        isSortReversed: false
      }
      this.onSort = this.onSort.bind(this)
    }
  
    onSort(sortKey) {
  
      const isSortReversed = (sortKey === this.state.sortKey) && !this.state.isSortReversed
      this.setState({sortKey, isSortReversed})
    }
  
    render() {
  
      const {hits, onDismiss} = this.props
  
      const sortedList = SORTS[this.state.sortKey](hits)
      const reverseSortedList = (this.state.isSortReversed) ? sortedList.reverse() : sortedList
  
      return (
        <div className="table">
          <div className="table-header">
            <span style={{width: '40%'}}>
              <SortHeader
                sortKey = {'TITLE'}
                onSort = {this.onSort}
                activeSortKey = {this.state.sortKey}
              >
                Title
              </SortHeader>
            </span>
            <span style={{width: '30%'}}>
              <SortHeader
                sortKey = {'AUTHOR'}
                onSort = {this.onSort}
                activeSortKey = {this.state.sortKey}
              >
                Author
              </SortHeader>
            </span>
            <span style={{width: '10%'}}>
              <SortHeader
                sortKey = {'COMMENTS'}
                onSort = {this.onSort}
                activeSortKey = {this.state.sortKey}
              >
                Comments
              </SortHeader>
            </span>
            <span style={{width: '10%'}}>
              <SortHeader
                sortKey = {'POINTS'}
                onSort = {this.onSort}
                activeSortKey = {this.state.sortKey}
              >
                Points
              </SortHeader>
            </span>
            <span style={{width: '10%'}}>
              Archive
            </span>
          </div>
          {reverseSortedList.map(item => 
            <div key={item.objectID} className="table-row">
              <span style = {{ width: '40%'}}>
                <a href={item.url}>
                  {item.title} 
                </a>
              </span>
              <span style = {{ width: '30%'}}>
                {item.author}
              </span>
              <span style = {{ width: '10%'}}>
                {item.num_comments}
              </span>
              <span style = {{ width: '10%'}}>
                {item.points}
              </span>
              <span style = {{ width: '10%'}}>
                <Button 
                  onClick={() => 
                  onDismiss(item.objectID)}
                  className="button-inline"
                  >
                  Dismiss
                </Button>
              </span>
            </div>
          
        )}
        </div>
      )
    }
  }
  
    Table.propTypes = {
      hits: PropTypes.arrayOf(PropTypes.object).isRequired,
      onDismiss: PropTypes.func
    }