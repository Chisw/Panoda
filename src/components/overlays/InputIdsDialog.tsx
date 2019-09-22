import React, { useState } from 'react'
import { Dialog, TextArea, Button, Classes, Toaster } from '@blueprintjs/core'

import { PANO_ID_RE } from '../../data'
import MAP from '../../map'

const toaster = Toaster.create({ position: 'top-left' })

interface InputIdsDialogProps {
  isOpen: boolean
  onClose(): void
}

export default function InputIdsDialog(props: InputIdsDialogProps) {

  const { isOpen, onClose } = props

  const [inputIds, setInputIds] = useState('')

  const generate = () => {

    const idList = inputIds.replace(/\n/g, '').split(',')

    let err: boolean = false
    idList.forEach( id => {
      if ( !PANO_ID_RE.test(id) ) err = true
    })

    if (err) {
      toaster.show({
        message: 'Exist invalid pano id',
        intent: 'danger',
        timeout: 3000,
        icon: 'error'
      })

      const _idList = 
        idList
          .filter(id => {
            return id !== ''
          })
          .map(id => {
            return !PANO_ID_RE.test(id)
              ? `!!> ${id} <!!`
              : id
          })

      setInputIds(_idList.join(',\n'))
      return
    }

    MAP.getPanoInfoByIdAndAppendDom(idList[0])

    setInputIds('')
    onClose()
  }

  return (
    <Dialog
      title="New Pano"
      icon="text-highlight"
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      isOpen={isOpen}
      onClose={() => { onClose() }}
    >
      <div className={Classes.DIALOG_BODY}>
        <TextArea
          className="w-full"
          style={{ height: '8rem', resize: 'none' }}
          intent="primary"
          placeholder="Paste pano id(s) here, separated by commas"
          onChange={(value: any) => { 
            setInputIds(value.target.value) 
          }}
          value={inputIds}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button minimal className="text-xs">How to get pano id(s)?</Button>
          <Button 
            intent="primary" 
            disabled={inputIds.length === 0}
            onClick={generate}
          >
            Generate
          </Button>
        </div>
      </div>
    </Dialog>
  )
}