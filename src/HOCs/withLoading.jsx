import React from 'react'
import { LoadingComponent } from '../Components/LoadingComponent.jsx'

export const withLoading = (Component) => ({isLoading, ...rest}) => {
    return (
      isLoading ?
      <LoadingComponent/> :
      <Component {...rest} />
    )
  }