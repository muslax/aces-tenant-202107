const PageHeading = ({ heading, children }) => {
  return <>
    <div className="flex items-center space-x-4">
      <h2 className=" flex-grow text-xl text-gray-400 font-bold py-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
          {heading || 'Heading Empty'}
        </span>
      </h2>
      {children && children}
    </div>
  </>
}

export default PageHeading