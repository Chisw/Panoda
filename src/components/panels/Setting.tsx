import { useState, useEffect } from 'react'
import { Switch, Popover, RadioGroup, Radio, Checkbox, InputGroup, Button } from '@blueprintjs/core'
import { DateRangeInput } from '@blueprintjs/datetime'
import store from '../../ts/store'
import MAP from '../../ts/map'
import { DateTime } from 'luxon'

export default function Setting() {

  const storeCenterPoint = store.get('PANO_SETTING_CENTERPOINT') || ''
  const storeStartDate = store.get('PANO_SETTING_STARTDATE')
  const storeEndDate = store.get('PANO_SETTING_ENDDATE')
  const storeUseAlert = store.get('PANO_SETTING_USEALERT')
  const storeInsertEXIF = store.get('PANO_SETTING_INSERTEXIF')
  const storeWaterMark = store.get('PANO_SETTING_WATERMARK') || ['1id', '2position', '3date', '4rname', '5link']
  const storeImageQuality = store.get('PANO_SETTING_IMAGEQUALITY') || '.92'

  const [centerPoint, setCenterPoint] = useState(storeCenterPoint)
  const [startDate, setStartDate] = useState<Date | null>(storeStartDate ? new Date(storeStartDate) : null)
  const [endDate, setEndDate] = useState<Date | null>(storeEndDate ? new Date(storeEndDate) : null)
  const [useAlert, setUseAlert] = useState(storeUseAlert === null ? false : storeUseAlert)
  const [insertEXIF, setInsertEXIF] = useState(storeInsertEXIF === null ? false : storeInsertEXIF)
  const [watermarkList, setWatermarkList] = useState(storeWaterMark)
  const [imageQuality, setImageQuality] = useState(storeImageQuality)

  useEffect(() => {
    store.set('PANO_SETTING_CENTERPOINT', centerPoint)
    store.set('PANO_SETTING_STARTDATE', startDate)
    store.set('PANO_SETTING_ENDDATE', endDate)
    store.set('PANO_SETTING_USEALERT', useAlert)
    store.set('PANO_SETTING_INSERTEXIF', insertEXIF)
    store.set('PANO_SETTING_WATERMARK', watermarkList)
    store.set('PANO_SETTING_IMAGEQUALITY', imageQuality)
  }, [centerPoint, startDate, endDate, useAlert, insertEXIF, watermarkList, imageQuality])

  const handleSet = () => {
    const center = MAP.getCenter()
    setCenterPoint(JSON.stringify(center))
  }

  return (
    <div>
      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Map Center</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Set the current center point of the map as default when Panoda initializes.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4">
          <InputGroup
            readOnly
            className="w-72"
            placeholder="No point set"
            value={centerPoint}
          />
          <div className="my-2">
            <Button small intent="primary" onClick={handleSet}>Set</Button>
            <Button small className="ml-2" disabled={!centerPoint} onClick={() => setCenterPoint('')}>Clear</Button>
          </div>
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Date range limit</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Limit the date range for importing panos.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4">
          <div className="mb-2">Start and end date</div>
          <DateRangeInput
            reverseMonthAndYearMenus
            shortcuts={false}
            startInputProps={{
              leftIcon: 'calendar',
              rightElement: (
                startDate ? <Button minimal icon="cross" onClick={() => setStartDate(null)} /> : undefined
              )
            }}
            endInputProps={{
              leftIcon: 'calendar',
              rightElement: (
                endDate ? <Button minimal icon="cross" onClick={() => setEndDate(null)} /> : undefined
              )
            }}
            formatDate={(date: Date) => DateTime.fromJSDate(date).toFormat('yyyy/MM/dd')}
            parseDate={(str: string) => str ? DateTime.fromFormat(str, 'yyyy/MM/dd').toJSDate() : null}
            minDate={new Date('2012-01-01T00:00:00.000Z')}
            value={[startDate, endDate]}
            onChange={range => {
              const [start, end] = range
              setStartDate(start)
              setEndDate(end)
            }}
          />
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Fetcher Alert</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Alert when you close fetcher.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4">
          <Switch 
            label="Use alert" 
            checked={useAlert}
            onChange={() => setUseAlert(!useAlert)}
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
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4 pb-4">
          <Switch 
            label="Insert"
            checked={insertEXIF}
            onChange={() => setInsertEXIF(!insertEXIF)}
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
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4">
          {[
            { label: 'Pano ID', value: '1id' },
            { label: 'Position', value: '2position' },
            { label: 'Date', value: '3date' },
            { label: 'Road name', value: '4rname' },
            { label: 'Panoda link', value: '5link' },
          ].map(({ label, value }) => (
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
          ))}
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Image quality</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            The quality of generated image.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pb-1 px-4">
          <RadioGroup
            selectedValue={imageQuality}
            onChange={({ target: { value } }: any) => setImageQuality(value)}
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