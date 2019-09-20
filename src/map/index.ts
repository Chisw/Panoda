// import MapStyle from './custom_map.json'

const G = window as any
const BMap = G.BMap

const PANO_COVER = new BMap.PanoramaCoverageLayer()

let map: any

interface MapState {
  init: () => void
  panoCover: {
    show: () => void
    hide: () => void
  },
  listen: () => void
  unlisten: () => void
  getPanoId: (point: any, cb?: () => void) => void
}

const Map: MapState = {
  init() {
    map = new BMap.Map('map', {enableMapClick: false});
    map.centerAndZoom(new BMap.Point(120.616675, 31.338262), 14);
    map.enableScrollWheelZoom(true);
    // map.setMapStyleV2({styleJson: MapStyle});
    
    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    });

    map.addControl(navigationControl);

    G.map = map;
  },

  panoCover: {
    show() {
      map.addTileLayer(PANO_COVER)
    },
    hide() {
      map.removeTileLayer(PANO_COVER)
    }
  },

  listen() {
    Map.panoCover.show()
    map.addEventListener('click', Map.getPanoId)
  },

  unlisten() {
    Map.panoCover.hide()
    map.removeEventListener('click', Map.getPanoId)
  },
  
  getPanoId(event: any) {
    const { point: { lng, lat } } = event
    const p = new BMap.Point(lng, lat)
    const marker = new BMap.Marker(p)
    map.clearOverlays()
    map.addOverlay(marker)
    map.panTo(p)
  },
}

export default Map
