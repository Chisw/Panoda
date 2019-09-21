import { Toaster } from "@blueprintjs/core"
import { SVG_PIN } from '../data'
// import MapStyle from '../data/custom_map.json'

const toaster = Toaster.create({ position: 'top-left' })

const G = window as any
const BMap = G.BMap
const PANO_COVER = new BMap.PanoramaCoverageLayer()

const getPinIcon = (point: {lng: number, lat: number}) => {
  return new BMap.Marker(point, {
    offset: {
      width: -16,
      height: -32
    },
    icon: new BMap.Symbol(SVG_PIN, {
      rotation: 0,
      fillColor: '#ea2323',
      fillOpacity: 1,
      strokeColor: '#dd2323',
      strokeWeight: 1,
      scale: .05
    })
  });
}

let map: any

interface MAPState {
  parent: any
  init(): void
  clear(): void
  listen(): void
  unlisten(): void
  getPanoId(point: any, cb?: () => void): void
  panToPoint(point: {lng: number, lat: number}): void
  panoCover: {
    show: () => void
    hide: () => void
  },
}

const MAP: MAPState = {
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
    MAP.panoCover.show()
    map.addEventListener('click', MAP.getPanoId)
  },

  unlisten() {
    MAP.panoCover.hide()
    map.removeEventListener('click', MAP.getPanoId)
  },
  
  getPanoId(event: any) {
    const { point: { lng, lat } } = event

    MAP.parent.setLoading(true)
    const panoramaService = new BMap.PanoramaService();
    panoramaService.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      map.clearOverlays()
      if (data !== null) {
        // $('#pano-posi').val(data.position.lng + ',' + data.position.lat );
        // this.setThumbnail(data.id);

        const { id, position: { lng, lat }} = data
        const { panos, setPanos } = MAP.parent

        fetch(`https://mapsv0.bdimg.com/?qt=sdata&sid=${id}`)
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            const info = json.content[0]

            panos.unshift({ id, lng, lat, date: info.Date, rname: info.Rname })
            const _panos = Array.from(panos)
            setPanos(_panos)

            const p = new BMap.Point(data.position.lng, data.position.lat)
            map.panTo(p)
            map.addOverlay(getPinIcon(p))

            MAP.parent.setLoading(false)
          })
          .catch( e => {
            toaster.show({
              message: 'Get pano info failed',
              intent: 'danger',
              timeout: 2000,
              icon: 'error'
            })
            MAP.parent.setLoading(false)
          })

      } else {
        MAP.parent.setLoading(false)
        toaster.show({
          message: 'No point matched, try again',
          intent: 'danger',
          timeout: 2000,
          icon: 'error'
        })
      }
    });
  },

  panToPoint(point) {
    const { lng, lat } = point
    const p = new BMap.Point(lng, lat)
    map.panTo(p)
    map.clearOverlays()
    map.addOverlay(getPinIcon(p))
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

export default MAP