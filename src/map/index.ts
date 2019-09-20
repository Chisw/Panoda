import { Toaster } from "@blueprintjs/core"
// import MapStyle from './custom_map.json'

const toaster = Toaster.create()

const G = window as any
const BMap = G.BMap
const PANO_COVER = new BMap.PanoramaCoverageLayer()

let map: any

interface MapState {
  parent: any
  init: () => void
  clear: () => void
  listen: () => void
  unlisten: () => void
  getPanoId: (point: any, cb?: () => void) => void
  panoCover: {
    show: () => void
    hide: () => void
  },
}

const Map: MapState = {
  parent: {},
  init() {
    map = new BMap.Map('map', {enableMapClick: false});
    map.centerAndZoom(new BMap.Point(120.64, 31.31), 14);
    map.enableScrollWheelZoom(true);
    // map.setMapStyleV2({styleJson: MapStyle});

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(res: any){
      if(geolocation.getStatus() === 0){
        // map.panTo(res.point);
      }      
    },{enableHighAccuracy: true})
    
    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    });
    map.addControl(navigationControl);

    G.map = map;
  },

  clear() {
    map.clearOverlays();
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

    Map.parent.setLoading(true)
    const panoramaService = new BMap.PanoramaService();
    panoramaService.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      Map.parent.setLoading(false)
      Map.clear()
      if (data !== null) {
        // $('#pano-posi').val(data.position.lng + ',' + data.position.lat );
        // this.setThumbnail(data.id);
        const p = new BMap.Point(data.position.lng, data.position.lat)
        map.panTo(p)
        const marker = new BMap.Marker(p)
        map.addOverlay(marker)
      } else {
        toaster.show({
          message: 'No point matched, try again',
          intent: 'danger',
          timeout: 3000,
          icon: 'error'
        })
      }
    });
  },

  panoCover: {
    show() {
      map.addTileLayer(PANO_COVER)
    },
    hide() {
      map.removeTileLayer(PANO_COVER)
    }
  },
}

export default Map