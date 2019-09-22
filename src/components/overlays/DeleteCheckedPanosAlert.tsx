import React from 'react'
import { Alert, Toaster } from '@blueprintjs/core'

import { IPano } from '../../type'

const toaster = Toaster.create({ position: 'top-left' })

interface DeleteCheckedPanosAlertProps {
  checkedIds: string[]
  panos: IPano[]
  setPanos(panos: IPano[] | []): void
  isOpen: boolean
  onClose(): void
}

export default function DeleteCheckedPanosAlert(props: DeleteCheckedPanosAlertProps) {

  const { checkedIds, panos, setPanos, isOpen, onClose } = props

  return (
    <Alert
      icon="trash"
      intent="danger"
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}
      cancelButtonText="Cancel"
      confirmButtonText="Yes"
      onConfirm={() => {
        const _panos: IPano[] = []
        panos.forEach(pano => {
          if ( !checkedIds.includes(pano.id) ) {
            _panos.push(pano)
          }
        })
        setPanos(_panos)
        toaster.show({
          message: `Deleted`,
          intent: 'success',
          timeout: 2000,
          icon: 'tick'
        })
      }}
    >
      <p className="text-base text-gray-800">
        Delete 
        <span> {checkedIds.length} </span> 
        checked pano{checkedIds.length === 1 ? '' : 's'}?
      </p>
    </Alert>
  )
}