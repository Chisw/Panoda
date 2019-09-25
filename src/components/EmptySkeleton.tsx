import React from 'react'
import { NonIdealState } from '@blueprintjs/core'

export function EmptyPano() {
  return (
    <NonIdealState
      icon="path-search"
      title="No Pano Here"
      description="Create pano by clicking 'New Pano' button above"
    />
  )
}