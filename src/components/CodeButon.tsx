import React from 'react'

interface CodeButtonProps {
  content: string
  onClick(): void
  className?: string
}

export default function CodeButton(props: CodeButtonProps) {

  const { content, onClick, className } = props

  return (
    <span
      className={`bg-green-500 hover:bg-green-600 text-black px-1 rounded-sm inline-block cursor-pointer text-center 
        ${className}
      `}
      style={{ minWidth: 56 }}
      onClick={onClick}
    >
      {content}
    </span>
  )
}