import React from 'react'
import { NonIdealState } from '@blueprintjs/core'

export function EmptyTask() {
  return (
    <NonIdealState
      className="bg-gray-100"
      icon="plus"
      title="No Task Here"
      description="Create task by clicking 'New Task' button above"
    />
  )
}