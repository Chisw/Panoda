import { Toaster } from "@blueprintjs/core"

import SVG_PIN from '../images/pin.svg'
import SVG_RECT from '../images/rect.svg'

import { PANO_ID_REG, /*CUSTOM_MAP*/ } from './constant'
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
  listen(selectWith: string): void
  unlisten(): void
  locate(): void
  getPinMarker(point: { lng: number, lat: number }): any
  getRectMarker(point: { lng: number, lat: number }): any
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
    map = new BMap.Map('map', {enableMapClick: false})
    map.centerAndZoom(new BMap.Point(120.64, 31.31), 14)
    map.enableScrollWheelZoom(true)
    // map.setMapStyleV2({styleJson: CUSTOM_MAP})
    
    const navigationControl = new BMap.NavigationControl({
      anchor: G.BMAP_ANCHOR_TOP_LEFT,
      type: G.BMAP_NAVIGATION_CONTROL_LARGE,
    })
    map.addControl(navigationControl)
    map.setMinZoom(5)
  },

  clear() {
    map.clearOverlays();
  },

  listen(selectWith) {
    map.clearOverlays()

    MAP.panoCover.show()
    // point
    if (selectWith === 'point') {
      map.addEventListener('click', MAP.getPanoIdByClicking)
    // area
    } else if (selectWith === 'area' ){
      map.removeEventListener('click', MAP.getPanoIdByClicking)

      map.addEventListener('click', (e: any) => {
        console.log(e.point)
        console.log(map.getZoom())
      })

      const marker = MAP.getRectMarker(map.getCenter())
      map.addOverlay(marker)
      marker.enableDragging()
      marker.addEventListener('dragend', (e: any) => {
        // console.log(e)
      })
    }
  },

  unlisten() {
    MAP.panoCover.hide()
    map.clearOverlays();
    map.removeEventListener('click', MAP.getPanoIdByClicking)
  },

  locate() {
    MAP.parent.setLoading(true)
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      (res: any) => {
        MAP.parent.setLoading(false)
        if (geolocation.getStatus() === 0) {
          map.panTo(res.point);
          toaster.show({
            message: 'Locate successfully',
            icon: 'tick',
            intent: 'success',
            timeout: 2000
          })
        } else {
          toaster.show({
            message: 'Locate failed, try later',
            icon: 'tick',
            intent: 'danger',
            timeout: 2000
          })
        }
      },
      {
        enableHighAccuracy: true
      }
    )
  },

  getPinMarker(point) {
    const size = { width: 18, height: 24 }
    return new BMap.Marker(point, {
      offset: {
        width: 0,
        height: - size.height / 2
      },
      icon: new BMap.Icon(
        SVG_PIN,
        size,
        { imageSize: size }
      )
    });
  },

  getRectMarker(point) {
    const size = { width: 200, height: 200 }
    return new BMap.Marker(point, {
      draggingCursor: 'move',
      icon: new BMap.Icon(
        SVG_RECT,
        size,
        { imageSize: size }
      )
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
            map.addOverlay(MAP.getPinMarker(p))

            MAP.parent.setLoading(false)
            toaster.show({
              message: `Get pano successfully`,
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
      MAP.parent.setLoading(false)
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

        panos.unshift({ id, lng, lat, date: getDateStamp(photoDate), rname: roadName || '无道路信息' })
        const _panos = [...panos]
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
    map.addOverlay(MAP.getPinMarker(p))
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