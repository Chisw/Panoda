import React, { useState } from 'react'
import { ButtonGroup, AnchorButton, Tooltip } from '@blueprintjs/core'
import DemoVideo from './overlays/DemoVideo'

export default function Header() {

  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <div className="pt-4 pb-2">
        <h3 className="text-4xl font-mono">
          Panoda
          <ButtonGroup minimal className="float-right mt-2">
            <Tooltip content="Demo video">
              <AnchorButton
                icon="video"
                onClick={() => setVideoOpen(true)}
              />
            </Tooltip>
            <Tooltip content="GitHub">
              <AnchorButton
                icon="git-repo"
                href="https://github.com/Chisw/Panoda"
                target="_blank" 
              />
            </Tooltip>
          </ButtonGroup>
        </h3>
        <p className="text-xs text-gray-500">
          Fetch Baidu panoramic photo easily!
        </p>
      </div>

      <DemoVideo
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
      />
    </>
  )
}