export const getPreviewSrc = (id: string) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=0_0&z=1`
}

export const getPanoTileSrc = (id: string, row: number, col: number) => {
  return `https://mapsv1.bdimg.com/?qt=pdata&sid=${id}&pos=${row}_${col}&z=4`
}

export const getBaseSize = (base64String: string) => {
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

export const getExifedBase64 = (base64: string) => {
  const lng = 131.43553989213321;
  const lat = 34.73842144012451;
  const exifObj = {
    "0th": {
      [piexif.ImageIFD.Artist]: 'Baidu.com',
      [piexif.ImageIFD.Software]: 'Panoda - panoda.jisuowei.com',
      [piexif.ImageIFD.DateTime]: '2018:08:08 00:00:00',
      [piexif.ImageIFD.ImageDescription]: '009059595952568415552H - ' + encodeURIComponent('沿河路'),
    },
    "GPS": {
      [piexif.GPSIFD.GPSLongitudeRef]: lng < 0 ? 'W' : 'E',
      [piexif.GPSIFD.GPSLongitude]: piexif.GPSHelper.degToDmsRational(lng),
      [piexif.GPSIFD.GPSLatitudeRef]: lat < 0 ? 'S' : 'N',
      [piexif.GPSIFD.GPSLatitude]: piexif.GPSHelper.degToDmsRational(lat),
    }
  }

  const exifStr = piexif.dump(exifObj);
  return piexif.insert(exifStr, base64)
}