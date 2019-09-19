import React, { useState, useEffect } from 'react'
import './App.css'
import Panoda from './components/Panoda'
import map, { PANO_COVER } from './map/map'

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
  }, [mapCollect])

  return (
    <div className={`panoda-container ${mapExpand ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div id="map" className="panoda-map absolute top-0 right-50 bottom-0 left-0">
      
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow-md">
        <div className="pt-8 pb-4 border-b">
          <h3 className="text-4xl font-hairline">
            Panoda
          </h3>
          <h3 className="text-sm text-gray-500 font-hairline">
            Fetch Baidu panoramic photo easily!
          </h3>
        </div>
        <Panoda />
        <a
            onClick={() => {
              setMapExpand(!mapExpand)
            }}
          >expand</a>

          <a
            onClick={() => {
              setMapCollect(!mapCollect)
            }}
          >mapCollect</a>
        <div className="pt-12 pb-4">
          <h3 className="text-xs font-hairline">i@jisuowei.com</h3>
        </div>
      </div>

    </div>
  );
}

export default App
