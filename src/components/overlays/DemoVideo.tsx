import React from 'react'
import { Dialog } from '@blueprintjs/core'

interface DemoVideoProps {
  isOpen: boolean
  onClose(): void
}

export default function DemoVideo(props: DemoVideoProps) {

  const { isOpen, onClose } = props

  return (
    <Dialog
      isOpen={isOpen}
      title="Demo Video"
      className="p-0 overflow-hidden"
      style={{
        width: 640
      }}
      onClose={onClose}
    >
      <div>
        <iframe 
          title="demo video"
          src="//player.bilibili.com/player.html?aid=69382774&cid=120251707&page=1"
          style={{
            width: 640,
            height: 430
          }}
          scrolling="no" 
          // border="0" 
          // frameborder="no" 
          // framespacing="0" 
          // allowfullscreen 
        >
        </iframe>
      </div>
    </Dialog>
  )
}