import { Toaster } from "@blueprintjs/core"

import { SVG_PIN, PANO_ID_REG, /*CUSTOM_MAP*/ } from './constant'
import { IPano } from './type'
import { getDateStamp } from "./util"

const toaster = Toaster.create({ position: 'top-left' })

const G = window as any
const BMap = G.BMap
const PANO_COVER = new BMap.PanoramaCoverageLayer()
const PANO_SERVER = new BMap.PanoramaService()

let map: any

interface MAPState {
  parent: any
  init(): void
  clear(): void
  listen(): void
  unlisten(): void
  getPinIcon(point: { lng: number, lat: number }): any
  getPanoIdByClicking(point: any, cb?: () => void): void
  getPanoInfoByIdAndAppendDom(
    id: string,
    success?: (data: any) => void,
    failed?: () => void,
  ): void
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
    // map.setMapStyleV2({styleJson: CUSTOM_MAP});

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      (res: any) => {
        if(geolocation.getStatus() === 0){
          // map.panTo(res.point);
        }      
      },
      {
        enableHighAccuracy: true
      }
    )
    
    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    });
    map.addControl(navigationControl);
  },

  clear() {
    map.clearOverlays();
  },

  listen() {
    MAP.panoCover.show()
    map.addEventListener('click', MAP.getPanoIdByClicking)
  },

  unlisten() {
    MAP.panoCover.hide()
    map.removeEventListener('click', MAP.getPanoIdByClicking)
  },

  getPinIcon(point) {
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
  },
  
  getPanoIdByClicking(event: any) {
    const { point: { lng, lat } } = event

    MAP.parent.setLoading(true)
    PANO_SERVER.getPanoramaByLocation(new BMap.Point(lng, lat), (data: any) => {
      map.clearOverlays()
      if (data !== null) {
        MAP.getPanoInfoByIdAndAppendDom(
          data.id,
          (data) => {
            const { position: { lng, lat } } = data
            const p = new BMap.Point(lng, lat)
            map.panTo(p)
            map.addOverlay(MAP.getPinIcon(p))

            MAP.parent.setLoading(false)
            toaster.show({
              message: `Get pano ${data.id}`,
              intent: 'success',
              timeout: 2000,
              icon: 'tick'
            })
          },
          () => {
            toaster.show({
              message: `Get pano ${data.id} info failed`,
              intent: 'warning',
              timeout: 0,
              icon: 'error'
            })
            MAP.parent.setLoading(false)
          }
        )
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

  getPanoInfoByIdAndAppendDom(id, success, failed) {

    if ( !id || !PANO_ID_REG.test(id) ) {
      toaster.show({
        message: `Invalid pano id ${id}`,
        intent: 'danger',
        timeout: 0,
        icon: 'error'
      })
      return
    }

    const { panos, setPanos } = MAP.parent

    if ( panos.map( (pano: IPano) => pano.id).includes(id) ) {
      toaster.show({
        message: `Pano ${id} already exist`,
        intent: 'warning',
        timeout: 0,
        icon: 'error'
      })
      return
    }

    PANO_SERVER.getPanoramaById(id, (data: any) => {

      if ( data !== null ) {
        const {
          id,
          position: {
            lng,
            lat
          },
          copyright: {
            photoDate,
            roadName
          }
        } = data

        panos.unshift({ id, lng, lat, date: getDateStamp(photoDate), rname: roadName })
        const _panos = Array.from(panos)
        setPanos(_panos)

        success && success(data)
      } else {
        failed && failed()
      }
    })
  },

  panToPoint(point) {
    const { lng, lat } = point
    const p = new BMap.Point(lng, lat)
    map.panTo(p)
    map.clearOverlays()
    map.addOverlay(MAP.getPinIcon(p))
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