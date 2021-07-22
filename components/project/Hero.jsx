import { FolderIcon, IdentificationIcon, StatusOnlineIcon } from '@heroicons/react/solid';

const Hero = ({ project, batch, title, isIndex }) => {
  return <>
    <div className="pt-3 pb-5 border--b">
      <div className="h-12 pb-1 flex items-end">
        {isIndex && (
          <h2 className="text-2xl text-gray-400 font-medium truncate">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
              {project? project.title : '...'}
            </span>
          </h2>
        )}
        {!isIndex && (
          <h2 className="text-2xl text-gray-400 font-light">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-800">
              {title}
            </span>
          </h2>
        )}
      </div>
    
      {isIndex && (
        <div className="h-16 bg--yellow-50 flex flex-col space-y-2 font-medium">
          <div className="flex items-center space-x-3">
            <IdentificationIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-gray-400-">
              { project
                ? `${project.client.name}, ${project.client.city}`
                : '...'
              }
            </div>
          </div>

          {/* <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <div className="">Kontrak: {project.contractDate}</div>
          </div>

          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
            <div className="">Admin: {project.admin.fullname}</div>
          </div> */}

          <div className="h-9 bg-pink--200 flex items-center pt-2">
            {/* <button className="h-7 bg-gray-400 text-white text-xs font-semibold px-2">Batch Info</button> */}
            {/* <button className="h-7 bg-gray-200 text-xs font-semibold px-2">Project Info</button> */}
          </div>
        </div>
      )}
      {!isIndex && (
        <div className="h-16 flex flex-col space-y-px font-medium">
          <div className="flex items-center space-x-3">
            <FolderIcon className="w-5 h-5 text-green-500" />
            <div className="">{project ? project.title : ''}</div>
          </div>

          <div className="flex items-center space-x-3">
            <IdentificationIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-gray-400-">
              { project
                ? `${project.client.name}, ${project.client.city}`
                : '...'
              }
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <StatusOnlineIcon className="w-5 h-5 text-pink-500" />
            <div className="">Batch: {batch ? batch.title : ''}</div>
          </div>
        </div>
      )}
    </div>
  </>
}

export default Hero