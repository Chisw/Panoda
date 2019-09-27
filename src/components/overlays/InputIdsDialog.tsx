import React, { useState } from 'react'
import { Dialog, TextArea, Button, Classes } from '@blueprintjs/core'

import { PANO_ID_REG } from '../../ts/constant'
import MAP from '../../ts/map'
import TOAST from './EasyToast'

interface InputIdsDialogProps {
  isOpen: boolean
  onClose(): void
  setLoading(loading: boolean): void
}

export default function InputIdsDialog(props: InputIdsDialogProps) {

  const { isOpen, onClose, setLoading } = props

  const [inputIds, setInputIds] = useState('')

  const importing = () => {

    const idList = 
      inputIds
        .replace(/\n/g, '')
        .split(',')
        .filter(id => {
          return id !== ''
        })

    let err: boolean = false
    idList.forEach( id => {
      if ( !PANO_ID_REG.test(id) ) err = true
    })

    if (err) {
      TOAST.danger('Invalid pano id.')

      const _idList = 
        idList
          .filter(id => {
            return id !== ''
          })
          .map(id => {
            return !PANO_ID_REG.test(id)
              ? `!!> ${id} <!!`
              : id
          })

      setInputIds(_idList.join(',\n'))
      return
    }

    setInputIds('')
    onClose()

    setLoading(true)
    const _recursion = () => {
      if (idList.length) {
        setTimeout(() => {
          MAP.getPanoInfoByIdAndAppendDom(idList.shift() || '')
          _recursion()
        }, 500)
      } else {
        setLoading(false)
        TOAST.success('Finished')
      }
    }
    _recursion()

  }

  return (
    <Dialog
      title="New Pano"
      icon="text-highlight"
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      isOpen={isOpen}
      onClose={() => {
        setInputIds('')
        onClose() 
      }}
    >
      <div className={Classes.DIALOG_BODY}>
        <TextArea
          className="w-full"
          style={{ height: '8rem', resize: 'none' }}
          intent="primary"
          placeholder="Paste pano id(s) here, separate values by commas"
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
            onClick={importing}
          >
            Continue
          </Button>
        </div>
      </div>
    </Dialog>
  )
}