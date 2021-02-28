import { Alert } from '@blueprintjs/core'
import { IPano } from '../../ts/type'
import TOAST from './EasyToast'
import MAP from '../../ts/map'

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
      onClose={onClose}
      cancelButtonText="Cancel"
      confirmButtonText="Yes"
      onConfirm={() => {
        const _panos: IPano[] = []
        panos.forEach(pano => {
          if (!checkedIds.includes(pano.id)) _panos.push(pano)
        })
        setPanos(_panos)
        MAP.clear()
        TOAST.success('Deleted')
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