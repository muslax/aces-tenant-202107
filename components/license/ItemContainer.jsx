export function ItemContainer({ children, bg, icon }) {
  return (
    <div className={`flex items-start space-x-3 rounded-md 
    ${bg ? bg : 'bg-white'}
    border border-blue-200 hover:border-blue-300 hover:shadow-sm p-3 py-2`}
    >
      <div className="pt-px">
        {icon}
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}