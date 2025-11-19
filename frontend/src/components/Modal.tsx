import React from 'react'

export function Modal(props: {
  children?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}) {
  if (!props.isOpen) return null

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6 overflow-hidden"
      onClick={props.onClose}
    >
      <div
        className="relative w-full max-w-[340px] h-auto bg-white rounded-2xl shadow-2xl scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold z-20"
          onClick={props.onClose}
        >
          &times;
        </button>
        <div>{props.children}</div>
      </div>
    </div>
  )
}
