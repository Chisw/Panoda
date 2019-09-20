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
  const [panos, setPanos] = useState([])

  Map.parent.setLoading = setLoading
  
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
    Map.clear()
  }, [taskFrom])

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
            className="border-t border-b mb-4"
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

      <div className={`${loading ? 'block' : 'hidden'} fixed z-50 top-0 right-0 bottom-0 left-0`}>
        <ProgressBar className="shadow-lg" />
      </div>

    </div>
  );
}

export default App
