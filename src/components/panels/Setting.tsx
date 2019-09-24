import React from 'react'
import { Switch, Popover } from '@blueprintjs/core'

export default function Setting() {
  return (
    <div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Fetcher Alert</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Open an alert when you close data-fetched fetcher.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pl-4">
          <Switch checked disabled label="Use confirm"></Switch>
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">EXIF</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            Fill the&nbsp;
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
                  ImageDescription: [pano id] - [roadname]<br />
                  DateTimeOriginal: [pano date]<br />
                  GPSLongitudeRef: ['W' or 'E']<br />
                  GPSLongitude: [lng value]<br />
                  GPSLatitudeRef: ['S' or 'N']<br />
                  GPSLatitude: [lat value]<br />
                </code>
              </div>
            </Popover>
            &nbsp;in image file.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pl-4 pb-4">
          <Switch checked disabled label="Fill"></Switch>
        </div>
      </div>

      <div className="flex border-b">
        <div className="setting-left pt-4 pr-2">
          <p className="text-base text-gray-800 font-light">Watermark</p>
          <p className="text-sm text-gray-500 mt-2 leading-snug">
            The pano info will be recorded on the bottom-left of each generated pano image.
          </p>
        </div>
        <div className="flex-grow bg-gray-100 pt-4 pl-4">
          <Switch checked disabled label="PanoID"></Switch>
          <Switch checked disabled label="Position"></Switch>
          <Switch checked disabled label="Date"></Switch>
          <Switch checked disabled label="RoadName"></Switch>
          <Switch checked disabled label="Link"></Switch>
        </div>
      </div>

    </div>
  )
}