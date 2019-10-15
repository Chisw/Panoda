import React from 'react'
import { GET_PANO_ID_CODE } from '../../ts/constant'
import { Tag, Button, Icon } from '@blueprintjs/core'
import TOAST from '../overlays/EasyToast'

export default function About() {
  return (
    <div>
      <h3 className="pt-4 text-base font-light mb-2"><Icon icon="console" className="w-6" />Get pano id(s)</h3>
      <div className="pl-6 mb-4">
        <p className="text-sm text-gray-500">
          1. From Baidu: copy the following code and paste it to the console of Baidu map.
          <Tag
            intent="primary"
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
          className="mt-1 mb-3 w-full overflow-y-scroll p-2 rounded resize-none font-mono"
          style={{
            height: 60,
            color: '#3ddc84',
            background: '#0a1d1a',
            fontSize: 12
          }}
          defaultValue={GET_PANO_ID_CODE}
        />

        <p className="text-sm text-gray-500">
          2. From folder: choose an existing folder contained with generated Panoda images.
        </p>
        <Button
          icon="folder-new"
          className="mt-2"
          onClick={() => {

            TOAST.success('Copy successfully')
          }}
        >
          Choose
        </Button>
      </div>

      <h3 className="pt-4 text-base font-light mb-2"><Icon icon="link" className="w-6" />Thanks to</h3>
      <div className="pl-6 mb-4 pt-1">
        {
          [
            { label: 'BaiduMap', link: 'http://lbsyun.baidu.com' },
            { label: 'Blueprint', link: 'https://blueprintjs.com' },
            { label: 'Tailwind', link: 'https://next.tailwindcss.com' },
            { label: 'JSZip', link: 'https://github.com/Stuk/jszip' },
            { label: 'FileSaver', link: 'https://github.com/eligrey/FileSaver.js' },
            { label: 'Piexifjs', link: 'https://github.com/hMatoba/piexifjs' },
          ].map((a, index) => {
            return <Tag minimal interactive key={index} intent="primary" className="mr-2" onClick={() => { window.open(a.link) }} >{a.label}</Tag>
          })
        }
      </div>

      <p className="absolute bottom-0 w-full py-4 text-xs text-gray-600 border-t bg-white">
        Panoda - http://p.jsw.im          
        <span className="float-right text-blue-500 cursor-pointer" onClick={() => { window.open('http://jisuowei.com') }}>© jisuowei.com</span>
      </p>

    </div>
  )
}