import React from 'react'
import { Tabs, Tab } from '@blueprintjs/core'
import Task from './panels/Task'

export default function Panoda() {
  return (
    <>
      <Tabs
        large
        className="font-thin text-center"
        animate={true}
        id="navi"
        key="horizontal"
      >
        <Tab id="task" title="Task" panel={<Task />} />
        <Tab id="history" title="History" panel={<Task />} />
      </Tabs>
    </>
  )
}