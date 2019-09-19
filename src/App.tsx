import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import map, { PANO_COVER } from './map/map'
import { Tabs, Tab } from '@blueprintjs/core'
import Task from './components/panels/Task'
import History from './components/panels/History'

const App: React.FC = () => {

  const G = window as any
  const [mapExpand, setMapExpand] = useState(false)
  const [mapCollect, setMapCollect] = useState(false)

  useEffect(() => {
    map.init()
  }, [])

  useEffect(() => {
    mapCollect 
      ? G.map.addTileLayer(PANO_COVER)
      : G.map.removeTileLayer(PANO_COVER)
  }, [mapCollect, G.map])

  return (
    <div className={`panoda-container ${mapExpand ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div id="map" className="panoda-map absolute top-0 right-50 bottom-0 left-0" />

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <Header />
        <Tabs large animate id="navi" key="horizontal">
          <Tab id="task" title="Task" panel={<Task />} />
          <Tab id="history" title="History" panel={<History />} />
        </Tabs>
        <span
            onClick={() => {
              setMapExpand(!mapExpand)
            }}
          >expand</span>

          <span
            onClick={() => {
              setMapCollect(!mapCollect)
            }}
          >mapCollect</span>
      </div>

    </div>
  );
}

export default App
