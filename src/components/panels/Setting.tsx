import React, { useState, useEffect } from 'react'
import { Switch, Popover, RadioGroup, Radio, Checkbox } from '@blueprintjs/core'
import store from '../../ts/store'

export default function Setting() {

  const storeUseAlert = store.get('PANO_SETTING_USEALERT')
  const [useAlert, setUseAlert] = useState(storeUseAlert === null ? false : storeUseAlert)

  const storeInsertEXIF = store.get('PANO_SETTING_INSERTEXIF')
  const [insertEXIF, setInsertEXIF] = useState(storeInsertEXIF === null ? false : storeInsertEXIF)
  
  const [watermarkList, setWatermarkList] = useState(
    store.get('PANO_SETTING_WATERMARK') || 
    ['1id', '2position', '3date', '4rname', '5link']
  )
  const [imageQuality, setImageQuality] = useState(store.get('PANO_SETTING_IMAGEQUALITY') || '.92')

  useEffect(() => {
    store.set('PANO_SETTING_USEALERT', useAlert)
    store.set('PANO_SETTING_INSERTEXIF', insertEXIF)
    store.set('PANO_SETTING_WATERMARK', watermarkList)
    store.set('PANO_SETTING_IMAGEQUALITY', imageQuality)
  }, [useAlert, insertEXIF, watermarkList, imageQuality])

  return (
    <div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Fetcher Alert</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Alert when you close fetcher.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 pl-4">
          <Switch 
            label="Use alert" 
            checked={useAlert}
            onChange={() => {
              setUseAlert(!useAlert)
            }}
          />
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">EXIF</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Insert the&nbsp;
            <Popover
              position="top"
              interactionKind="hover"
            >
              <span className="text-blue-500"> info </span>
              <div className="px-4 py-2">
                <code className="text-xs text-gray-900">
                  Artist: 'map.baidu.com'<br />
                  Software: 'Panoda - panoda.jisuowei.com'<br />
                  DateTime: [generated datetime]<br />
                  ImageDescription: [pano id]-[roadname]<br />
                  DateTimeOriginal: [pano date]<br />
                  GPSLongitudeRef: ['W' or 'E']<br />
                  GPSLongitude: [lng value]<br />
                  GPSLatitudeRef: ['S' or 'N']<br />
                  GPSLatitude: [lat value]<br />
                </code>
              </div>
            </Popover>
            &nbsp;into image file.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 pl-4 pb-4">
          <Switch 
            label="Insert"
            checked={insertEXIF}
            onChange={() => {
              setInsertEXIF(!insertEXIF)
            }}
          />
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Watermark</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            The pano info will be filled on the bottom-left of each generated pano image.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 pl-4">
          {
            [
              { label: 'Pano ID', value: '1id' },
              { label: 'Position', value: '2position' },
              { label: 'Date', value: '3date' },
              { label: 'Road name', value: '4rname' },
              { label: 'Panoda link', value: '5link' },
            ].map( item => {
              const { label, value } = item
              return (
                <Checkbox
                  key={value}
                  label={label}
                  value={value}
                  checked={watermarkList.includes(value)}
                  onChange={({ target: { checked } }: any) => {
                    let _list = [...watermarkList]
                    if (checked) {
                      _list.push(value)
                    } else {
                      _list = _list.filter(item => item !== value)
                    }
                    setWatermarkList(_list)
                  }}
                />
              )
            })
          }
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Image quality</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            The quality of generated image.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 pl-4">
          <RadioGroup
            selectedValue={imageQuality}
            onChange={({ target: { value }}: any) => {
              setImageQuality(value)
            }}
          >
            <Radio label="High" value=".92" />
            <Radio label="Middle" value=".64" />
            <Radio label="Low" value=".46"/>
          </RadioGroup>
        </div>
      </div>

    </div>
  )
}