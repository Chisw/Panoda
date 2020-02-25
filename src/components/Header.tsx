import React from 'react'
import { ButtonGroup, AnchorButton, Tooltip } from '@blueprintjs/core'

interface HeaderProps {
  openVideo(): void
}

export default function Header(props: HeaderProps) {

  const{ openVideo } = props

  return (
    <div className="pt-4 pb-2">
      <h3 className="text-4xl font-mono">
        Panoda
        <ButtonGroup minimal className="float-right mt-2">
          <Tooltip content="Demo video">
            <AnchorButton
              icon="video"
              onClick={openVideo}
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
      <h3 className="text-xs text-gray-500">
        Fetch Baidu panoramic photo easily!
      </h3>
    </div>
  )
}