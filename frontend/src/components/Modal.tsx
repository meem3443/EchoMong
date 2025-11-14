export function Modal(props: {
  children?: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
}) {
  if (!props.isOpen) {
    return <></>
  }

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 overflow-hidden"
      onClick={props.onClose}
    >
      <div
        className="relative max-w-md w-full mx-4 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-0 right-1 text-gray-600 text-2xl font-bold cursor-pointer hover:text-gray-800 z-20"
          onClick={props.onClose}
        >
          &times;
        </button>
        <div>{props.children}</div>
      </div>
    </div>
  )
}
