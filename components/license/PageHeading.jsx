const PageHeading = ({ heading }) => {
  return (
    <h2 className="text-xl text-gray-400 font-bold py-4">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
        {heading || 'Heading Empty'}
      </span>
    </h2>
  )
}

export default PageHeading