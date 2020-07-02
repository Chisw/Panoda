import { DateTime } from 'luxon'
import { pick, values } from 'lodash'
import { IPano } from './type'
import store from './store'

// getPreviewSrc
export const getPreviewSrc = (id: string) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=0_0&z=1`
}

// getPanoTileSrc
export const getPanoTileSrc = (id: string, row: number, col: number) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=${row}_${col}&z=4`
}

// getDateStamp
export const getDateStamp = (str?: string, format?: string) => {
  if ( str ) {
    const list = str.split('')
    list.splice(4, 0, '/')
    list.splice(7, 0, '/')
    return list.join('')
  } else {
    return DateTime.local().toFormat(format || 'yyyyMMdd_hhmmss')
  }
}

// copyStr
export const copyStr = (str: string) => {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = str
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}

// getBaseSize
export const getBaseSize = (base64String: string) => {

  if (!base64String) return

  let padding, inBytes, base64StringLength
  if (base64String.endsWith('==')) padding = 2
  else if (base64String.endsWith('=')) padding = 1
  else padding = 0

  base64StringLength = base64String.length
  inBytes = (base64StringLength / 4) * 3 - padding
  const kbytes = inBytes / 1000;
  if (kbytes >= 1000) {
    return (kbytes / 1024).toFixed(1) + ' MB';
  } else {
    return kbytes.toFixed(1) + ' KB';
  }
}

// getExifedBase64
const piexif = (window as any).piexif
export const getExifedBase64 = (base64: string, pano: IPano) => {
  const { id, lng, lat, date, rname } = pano

  const exifObj = {
    "0th": {
      [piexif.ImageIFD.Artist]: 'map.baidu.com',
      [piexif.ImageIFD.Software]: 'Panoda - panoda.jisuowei.com',
      [piexif.ImageIFD.DateTime]: getDateStamp('', 'yyyy/MM/dd hh:mm:ss'),
      [piexif.ImageIFD.ImageDescription]: id + '-' + encodeURIComponent(rname),
    },
    "Exif": {
      [piexif.ExifIFD.DateTimeOriginal]: date,
    },
    "GPS": {
      [piexif.GPSIFD.GPSLongitudeRef]: lng < 0 ? 'W' : 'E',
      [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(lng),
      [piexif.GPSIFD.GPSLatitudeRef]: lat < 0 ? 'S' : 'N',
      [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(lat),
    }
  }

  return piexif.insert(piexif.dump(exifObj), base64)
}

// fillWatermark
export const fillWatermark = (ctx: any, pano: IPano) => {
  const { id, lng, lat, date, rname } = pano
  const link = 'Generated by Panoda - panoda.jisuowei.com'

  const WM = {
    '1id': 'PanoID: ' + id,
    '2position': 
      'Position: ' +
        lng + (lng < 0 ? 'W, ' : 'E, ') + 
        lat + (lat < 0 ? 'S' : 'N'),
    '3date': 'Date: ' + date,
    '4rname': 'RoadName: ' + rname,
    '5link': link
  }

  const text = 
    values(
      pick(
        WM, 
        // ['1id', '2position', '3date', '4rname', '5link']
        store.get('PANO_SETTING_WATERMARK').sort()
      )
    ).join('  |  ')
  
  ctx.font = '24px font-mono'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000'
  ctx.fillText(text, 20, 2021)
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 20, 2020)
}

// CMD
const spaces: string[] = []
for (var i = 0; i < 24; i++) { spaces.push('&nbsp;') }

export const CMD = {
  echo(label: string, value?: string | number) {

    const cmd = document.getElementById('cmd')
    if (!cmd) return

    if ( label === 'br' ) {
      const br = document.createElement('br')
      cmd.appendChild(br)
      return
    }

    const index = label.length + 1
    const space = spaces.slice(index).join('')
    const _label = space + label
    const _value = value || ''

    const p = document.createElement('p')
    p.innerHTML = _label + '&nbsp;&nbsp;' + _value

    cmd.appendChild(p)

    const scroll = document.getElementById('cmd-scroll')
    scroll && scroll.scrollTo({ top: 1e4, behavior: 'smooth' })
  },
}
