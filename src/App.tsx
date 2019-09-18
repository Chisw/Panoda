import React, { useState, useEffect } from 'react'
import './App.css'
import Panoda from './components/Panoda'
import MapStyle from './custom_map.json'

const App: React.FC = () => {

  let map: any = null
  const G = window as any
  const PANO_LINE = new G.BMap.PanoramaCoverageLayer()
  const [mapExpand, setMapExpand] = useState(false)

  useEffect(() => {
    map = new G.BMap.Map('map', {enableMapClick: false});
    map.centerAndZoom(new G.BMap.Point(120.616675, 31.338262), 14);
    map.enableScrollWheelZoom(true);
    
    const navigationControl = new G.BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    });

    map.addControl(navigationControl);

    // map.addEventListener('click', (event) => {
    //   $('#pano-id-user').val('').trigger('input').blur();
    //   this.pano_id_user = '';
    //   this.getPanoID(event.point);
    // })
    // this.map = map;

    map.setMapStyleV2({styleJson: MapStyle});
  }, [])

  useEffect(() => {
    // map && map.panTo(new G.BMap.Point(120,31))
    console.log(map)
    mapExpand && map
      ? map.addTileLayer(PANO_LINE)
      : map.removeTileLayer(PANO_LINE)
  }, [])


  return (
    <div className={`panoda-container ${mapExpand ? 'map-expand' : ''} w-full h-full absolute top-0 right-0 bottom-0 left-0`}>

      <div id="map" className="panoda-map absolute top-0 right-50 bottom-0 left-0">
      
      </div>

      <div className="panoda-panel absolute top-0 right-0 bottom-0 left-50 px-10 shadow">
        <div className="pt-8 pb-4">
          <h3 className="text-4xl font-hairline">Panoda</h3>
          <a
            onClick={() => {
              setMapExpand(!mapExpand)
            }}
          >expand</a>
        </div>
        <Panoda />
        <div className="pt-12 pb-4">
          <h3 className="text-xs font-hairline">i@jisuowei.com</h3>
        </div>
      </div>

    </div>
  );
}

export default App
