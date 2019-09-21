import React, { useState } from 'react'
import { Alert } from '@blueprintjs/core'

export default function DeleteAllPanosAlert() {

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  return (
    <Alert
      icon="trash"
      intent="danger"
      className={''}
      isOpen={deleteDialogOpen}
      onClose={() => {
        setDeleteDialogOpen(false)

      }}
      cancelButtonText="Cancel"
      onCancel={() => {

      }}
      confirmButtonText="Yes"
      onConfirm={() => {

      }}
    >
      <p className="text-base">Are you sure to delete all panos?</p>
    </Alert>
  )
}