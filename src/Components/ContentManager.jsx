import React, { useState } from 'react'
import {Display} from './Display.jsx'
import {PlusButton} from './Buttons.jsx'
import {ResetButton} from './Buttons'

export const ContentManager = () => {

    var [count, setCount] = useState(0)
  
    const incrementCounter = (incrementValue) => {
      setCount(count + incrementValue)
    }
  
    const resetCounter = () => {
      setCount(count = 0)
    }
  
    return (
      <>
      <PlusButton 
      clickAction = {incrementCounter}
      clickValue = {1}
       />
      <PlusButton
      clickAction = {incrementCounter}
      clickValue = {5}
      />
      <PlusButton 
      clickAction = {incrementCounter} 
      clickValue = {10}
      />
      <Display content= {count} />
      <ResetButton clickAction = {resetCounter} />
      </>
    )
  }