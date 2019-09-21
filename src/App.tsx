import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@blueprintjs/core'

import SelectGuider from './components/SelectGuider'
import Header from './components/Header'
import ProgressMask from './components/ProgressMask'
import Task from './components/panels/Task'
import History from './components/panels/History'

import MAP from './map'
import store from './store'

const App: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [tabId, setTabId] = useState('task')
  const [taskFrom, setTaskFrom] = useState('')
  const [mapSelect, setMapSelect] = useState(false)
  const [selectWith, setSelectWith] = useState('point')
  const [panos, setPanos] = useState(store.get('PANODA_TASKS') || [])

  MAP.parent.setLoading = setLoading
  MAP.parent.panos = panos
  MAP.parent.setPanos = setPanos

  useEffect(() => {
    MAP.init()
  }, [])

  useEffect(() => {
    setMapSelect(taskFrom === 'map')
    MAP.clear()
  }, [taskFrom])

  useEffect(() => {
    if ( mapSelect ) {
      MAP.listen()
    } else {
      MAP.unlisten()
    }
  }, [mapSelect])

  useEffect(() => {
    store.set('PANODA_TASKS', panos)
  }, [panos])

  return (
    <div className={`panoda-container ${taskFrom === 'map' ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div className="panoda-map absolute top-0 right-50 bottom-0 left-0">
        <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
        <SelectGuider
          setTaskFrom={setTaskFrom}
          selectWith={selectWith}
          setSelectWith={setSelectWith}
        />
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <div className="panel-inner relative h-full">
          <Header />
          <Tabs large animate 
            className="border-t border-b mb-4"
            id="navi" 
            key="horizontal"
            selectedTabId={tabId}
            onChange={(id: string) => {
              setTabId(id)
            }}
          >
            <Tab id="task" title="Task" />
            <Tab id="history" title="History" />
            <Tab id="setting" title="Setting" />
          </Tabs>
          {
            [
              <Task
                panos={panos}
                setPanos={setPanos}
                setTaskFrom={setTaskFrom}
              />,
              <History />
            ][['task', 'history'].indexOf(tabId)]
          }
        </div>
      </div>

      <ProgressMask loading={loading} />

    </div>
  );
}

export default App
