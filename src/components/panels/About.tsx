import React, { useEffect, useState } from 'react'
import { GET_PANO_ID_CODE, PANO_ID_REG_G } from '../../ts/constant'
import { Tag, Icon, FileInput } from '@blueprintjs/core'
import TOAST from '../overlays/EasyToast'
import { copyStr } from '../../ts/util'
import { uniq } from 'lodash'

export default function About() {

  const [folderName, setFolderName] = useState('')

  useEffect(() => {
    const input = document.getElementById('directory-file-input')
    input && input.setAttribute('directory', 'true')
    input && input.setAttribute('webkitdirectory', 'true')
  }, [])

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
        <FileInput
          fill
          text={folderName || `Choose folder...`}
          className="mt-2 bp3-small"
          inputProps={{
            id: 'directory-file-input',
            multiple: true
          }}
          hasSelection={folderName !== ''}
          onInputChange={(event: any) => {
            const { files } = event.target
            if (!files[0]) return
            setFolderName('/' + files[0].webkitRelativePath.split('/')[0])
            let ids: string[] = 
              uniq(
                Object.keys(files)
                  .map((key: string) => {
                    const res = files[key].name.match(PANO_ID_REG_G)
                    return res ? res[0] : ''
                  })
                  .filter(Boolean)
              )
            const len = ids.length
            if (len) {
              TOAST.success(
                len + ` pano id${len>1?'s':''} matched.`,
                10000,
                undefined,
                {
                  text: 'Copy',
                  icon: 'duplicate',
                  onClick() {
                    copyStr(ids.join(','))
                  }
                },
              )
            } else {
              TOAST.danger('No pano id matched.')
            }
          }}
        />
      </div>

      <h3 className="pt-4 text-base font-light mb-2"><Icon icon="link" className="w-6" />Thanks to</h3>
      <div className="pl-6 mb-4 pt-1">
        {
          [
            { label: 'BaiduMap', link: 'http://lbsyun.baidu.com' },
            { label: 'Blueprint', link: 'https://blueprintjs.com' },
            { label: 'TailwindCSS', link: 'https://tailwindcss.com/' },
            { label: 'JSZip.js', link: 'https://github.com/Stuk/jszip' },
            { label: 'FileSaver.js', link: 'https://github.com/eligrey/FileSaver.js' },
            { label: 'Piexifjs', link: 'https://github.com/hMatoba/piexifjs' },
          ].map(({ label, link }, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="no-underline"
            >
              <Tag
                minimal
                interactive
                intent="primary"
                className="mr-2"
              >
                {label}
              </Tag>
            </a>
          ))
        }
      </div>

      <p className="absolute bottom-0 w-full py-4 text-xs text-gray-600 border-t bg-white font-mono flex justify-between">
        <span>Panoda - http://p.jsw.im</span>
        <a href="//jisuowei.com" rel="noreferrer" target="_blank" className="text-blue-500">© jisuowei.com</a>
      </p>

    </div>
  )
}