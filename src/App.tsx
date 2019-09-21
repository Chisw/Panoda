import React, { useState, useEffect } from 'react'
import './App.css'
import SelectGuider from './components/map/SelectGuider'
import Header from './components/Header'
import { Tabs, Tab, ProgressBar } from '@blueprintjs/core'
import Task from './components/panels/Task'
import History from './components/panels/History'
import Map from './map'

const App: React.FC = () => {

  const [loading, setLoading] = useState(false)
  const [taskFrom, setTaskFrom] = useState('')
  const [selectWith, setSelectWith] = useState('point')
  const [mapCollect, setMapCollect] = useState(false)
  const [panos, setPanos] = useState(JSON.parse(localStorage.getItem('PANODA_PANOS') || '[]'))

  Map.parent.setLoading = setLoading
  Map.parent.panos = panos
  Map.parent.setPanos = setPanos

  useEffect(() => {
    Map.init()
  }, [])

  useEffect(() => {
    setMapCollect(taskFrom === 'map')
    Map.clear()
  }, [taskFrom])

  useEffect(() => {
    if ( mapCollect ) {
      Map.listen()
    } else {
      Map.unlisten()
    }
  }, [mapCollect])

  useEffect(() => {
    localStorage.setItem('PANODA_PANOS', JSON.stringify(panos))
  }, [panos])

  return (
    <div className={`panoda-container ${taskFrom === 'map' ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div className="panoda-map absolute top-0 right-50 bottom-0 left-0">
        <div id="map" className="absolute top-0 right-0 bottom-0 left-0"></div>
        <SelectGuider
          selectWith={selectWith}
          setSelectWith={setSelectWith}
        />
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <div className="panel-inner">
          <Header />
          <Tabs large animate 
            className="border-t"
            id="navi" 
            key="horizontal" 
          >
            <Tab id="task" title="Task" 
              panel={
                <Task
                  setTaskFrom={setTaskFrom}
                  panos={panos}
                />
              } 
            />
            <Tab id="history" title="History" 
              panel={
                <History />
              }
            />
          </Tabs>
        </div>
      </div>

      <div className={`${loading ? 'block' : 'hidden'} fixed z-50 top-0 right-0 bottom-0 left-0 cursor-wait`}>
        <ProgressBar className="shadow-lg" />
      </div>

    </div>
  );
}

export default App
