import { useState } from 'react'
import { Dialog, TextArea, Button, Classes, Tooltip } from '@blueprintjs/core'
import { PANO_ID_REG } from '../../ts/constant'
import MAP from '../../ts/map'
import TOAST from './EasyToast'
import { uniq } from 'lodash'

interface InputIdsDialogProps {
  isOpen: boolean
  onClose(): void
  setTabId(id: string): void
}

export default function InputIdsDialog(props: InputIdsDialogProps) {

  const { isOpen, onClose, setTabId } = props

  const [inputIds, setInputIds] = useState('')

  const importPanos = (isSelfExclude?: boolean) => {

    const idList = 
      inputIds
        .replace(/\n/g, '')
        .split(',')
        .filter(id => id !== '')

    let err: boolean = false
    idList.forEach(id => {
      if ( !PANO_ID_REG.test(id) ) err = true
    })

    if (err) {
      TOAST.danger('Invalid pano id.')

      const _idList = 
        idList
          .filter(id => id !== '')
          .map(id => !PANO_ID_REG.test(id) ? `!!> ${id} <!!` : id)

      setInputIds(_idList.join(',\n'))
      return
    }

    setInputIds('')
    onClose()

    isSelfExclude
      ? MAP.importSelfExcludePanosByIdList(uniq(idList))
      : MAP.importPanosByIdList(uniq(idList))
  }

  return (
    <Dialog
      title="Import from input"
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
          value={inputIds}
          onChange={(value: any) => setInputIds(value.target.value)}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button
            minimal
            className="text-xs"
            onClick={() => {
              onClose()
              setTabId('about')
            }}
          >
            How to get pano id(s)?
          </Button>
          <Tooltip content="Get other panos at the same position based on each id" position="bottom">
            <Button
              disabled={inputIds.length === 0}
              onClick={() => importPanos(true)}
            >
              Import other
            </Button>
          </Tooltip>
          <Button 
            intent="primary" 
            disabled={inputIds.length === 0}
            onClick={() => importPanos()}
          >
            Import
          </Button>
        </div>
      </div>
    </Dialog>
  )
}