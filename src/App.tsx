import React, { useState, useEffect } from 'react'
import './App.css'
import MapSelectGuider from './components/MapSelectGuider'
import Header from './components/Header'
import { Tabs, Tab } from '@blueprintjs/core'
import Task from './components/panels/Task'
import History from './components/panels/History'
import Map from './map'

const App: React.FC = () => {

  const [tabId, setTabId] = useState('task')
  const [taskFrom, setTaskFrom] = useState('')
  const [selectWith, setSelectWith] = useState('point')
  const [mapCollect, setMapCollect] = useState(false)

  useEffect(() => {
    Map.init()
  }, [])

  useEffect(() => {
    if ( mapCollect ) {
      Map.listen()
    } else {
      Map.unlisten()
    }
  }, [mapCollect])

  useEffect(() => {
    setMapCollect( taskFrom === 'map' )
  }, [taskFrom])

  return (
    <div className={`panoda-container ${taskFrom === 'map' ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div className="panoda-map absolute top-0 right-50 bottom-0 left-0">
        <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
        <MapSelectGuider
          selectWith={selectWith}
          setSelectWith={setSelectWith}
        />
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <div className="panel-inner">
          <Header />
          <Tabs 
            large 
            animate 
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
          </Tabs>
          {
            tabId === 'task' && (
              <Task 
                setTaskFrom={setTaskFrom}
              />
            )
          }
          {
            tabId === 'history' && (
              <History />
            )
          }
        </div>
      </div>

    </div>
  );
}

export default App
