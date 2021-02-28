import { NonIdealState } from '@blueprintjs/core'

export function EmptyPano() {
  return (
    <NonIdealState
      icon="path-search"
      title="No Pano Here"
      description="Create pano by clicking 'Import' button above"
    />
  )
}