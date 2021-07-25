export default function Subhead({ children, title }) {
  return (
    <div className="flex items-end space-x-6 pb-2">
      <div className="flex-grow h-8 flex items-end text-xl trackingwide">
        <div>
          <p className="-mb-1 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">{title}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  )
}