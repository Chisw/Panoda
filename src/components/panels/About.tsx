import React from 'react'
import { GET_PANO_ID_CODE } from '../../ts/constant'
import { Tag } from '@blueprintjs/core'
import TOAST from '../overlays/EasyToast'

export default function About() {
  return (
    <div>
      <h3 className="pt-4 text-base font-light mb-2">Get pano id(s)</h3>
      <p className="text-sm text-gray-500">
        Copy the following code and paste it to the console of Baidu map page.
        <Tag
          minimal
          interactive
          className="float-right"
          onClick={() => {
            const el: any = document.getElementById('get-pano-id-code')
            el.select()
            document.execCommand('Copy')
            el.blur()
            TOAST.success('Copy successfully')
          }}
        >
          Copy
        </Tag>
      </p>
      <textarea
        id="get-pano-id-code"
        className="my-2 w-full overflow-y-scroll p-2 rounded resize-none font-mono"
        style={{
          height: 200,
          color: '#3ddc84',
          background: '#0a1d1a',
          fontSize: 12
        }}
        defaultValue={GET_PANO_ID_CODE}
      />

      <h3 className="pt-4 text-base font-light mb-2">Thanks</h3>
      <div className="pt-1 pb-2">
        {
          [
            { label: 'BaiduMap', link: 'http://lbsyun.baidu.com/' },
            { label: 'Blueprint', link: 'https://blueprintjs.com/' },
            { label: 'JSZip', link: 'https://github.com/Stuk/jszip' },
            { label: 'FileSaver', link: 'https://github.com/eligrey/FileSaver.js' },
            { label: 'Piexifjs', link: 'https://github.com/hMatoba/piexifjs' },
          ].map((a, index) => {
            return <Tag minimal interactive key={index} className="mr-2" onClick={() => { window.open(a.link) }} >{a.label}</Tag>
          })
        }
      </div>
    </div>
  )
}