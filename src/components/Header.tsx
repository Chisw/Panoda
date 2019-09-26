import React from 'react'
import { ButtonGroup, AnchorButton } from '@blueprintjs/core'

export default function Header() {
  return (
    <div className="pt-4 pb-2">
      <h3 className="text-4xl font-ablt">
        Panoda
        <ButtonGroup minimal className="float-right mt-3">
          <AnchorButton icon="video" href="https://github.com/Chisw/Panoda" target="_blank" />
          <AnchorButton icon="git-repo" href="https://github.com/Chisw/Panoda" target="_blank" />
        </ButtonGroup>
      </h3>
      <h3 className="text-xs text-gray-500 font-hairline">
        Fetch Baidu panoramic photo easily!
        <span className="float-right">Email: i@jisuowei.com</span>
      </h3>
    </div>
  )
}