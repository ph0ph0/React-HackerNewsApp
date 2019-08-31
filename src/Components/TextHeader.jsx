import React, {Component} from 'react'

export class TextHeader extends Component {

    render() {
  
      const { text } = this.props
  
      return (
        <h1>
          {text}
        </h1>
      )
    }
  }