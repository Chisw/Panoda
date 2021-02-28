import { ProgressBar } from '@blueprintjs/core'

interface ProgressMaskProps {
  loading: boolean
}

export default function ProgressMask(props: ProgressMaskProps) {
  const { loading } = props

  return (
    <div className={`${loading ? 'block' : 'hidden'} fixed z-50 top-0 right-0 bottom-0 left-0 cursor-wait`}>
      <ProgressBar className="shadow-lg" intent="primary" />
    </div>
  )
}