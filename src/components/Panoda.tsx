import React from 'react'
import { Tabs, Tab } from '@blueprintjs/core'
import Fetcher from './panels/Fetcher'

export default function Panoda() {
  return (
    <>
      <Tabs
        large
        className="font-thin text-center"
        animate={true}
        id="navi"
        key="horizontal"
        // renderActiveTabPanelOnly={this.state.activePanelOnly}
      >
        <Tab id="task-list" title="Task" panel={<Fetcher />} />
        <Tab id="fetched-history" title="History" panel={<Fetcher />} />
      </Tabs>
    </>
  )
}