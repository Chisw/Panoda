import { DateTime } from 'luxon'
import { pick, values } from 'lodash'
import { IPano } from './type'

export const getPreviewSrc = (id: string) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=0_0&z=1`
}

export const getPanoTileSrc = (id: string, row: number, col: number) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=${row}_${col}&z=4`
}

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

export const getBaseSize = (base64String: string) => {

  if (!base64String) return

  let padding, inBytes, base64StringLength
  if (base64String.endsWith("==")) padding = 2
  else if (base64String.endsWith("=")) padding = 1
  else padding = 0

  base64StringLength = base64String.length
  inBytes = (base64StringLength / 4) * 3 - padding
  const kbytes = inBytes / 1000;
  return (kbytes / 1024).toFixed(2) + ' MB';
}

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

export const fillWatermark = (ctx: any, pano: IPano) => {
  const { id, lng, lat, date, rname } = pano
  const link = 'Generated by Panoda - panoda.jisuowei.com'

  const WM = {
    id: 'PanoID: ' + id,
    position: 
      'Position: ' +
        lng + (lng < 0 ? 'W, ' : 'E, ') + 
        lat + (lat < 0 ? 'S' : 'N'),
    date: 'Date: ' + date,
    rname: 'RoadName: ' + rname,
    link: link
  }

  const text = 
    values(
      pick(
        WM, 
        ['id', 'position', 'date', 'rname', 'link']
      )
    ).join('  |  ')

  ctx.font = '24px monospace'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#000'
  ctx.fillText(text, 20, 2021)
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 20, 2020)
}