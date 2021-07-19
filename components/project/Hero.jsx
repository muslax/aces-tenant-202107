import { EyeIcon, FolderIcon, IdentificationIcon, ShieldCheckIcon, StatusOnlineIcon } from '@heroicons/react/solid';
import { CalendarIcon } from '@heroicons/react/outline';

const Hero = ({ project, title, isIndex }) => {
  return <>
    <div className="pt-2 pb-5">
      <div className="h-12 pb-1 flex items-end">
        {isIndex && (
          <h2 className="text-2xl text-gray-400 font-medium truncate">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
              {project.title}
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
        <div className="flex flex-col space-y-px font-medium">
          <div className="flex items-center space-x-3">
            <IdentificationIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-gray-400-">{project.client.name}, {project.client.city}</div>
          </div>

          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <div className="">Kontrak: {project.contractDate}</div>
          </div>

          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-gray-500" />
            <div className="">Admin: {project.admin.fullname}</div>
          </div>
        </div>
      )}
      {!isIndex && (
        <div className="flex flex-col space-y-px font-medium">
          <div className="flex items-center space-x-3">
            <FolderIcon className="w-5 h-5 text-green-500" />
            <div className="">{project.title}</div>
          </div>

          <div className="flex items-center space-x-3">
            <IdentificationIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-gray-400-">{project.client.name}, {project.client.city}</div>
          </div>

          <div className="flex items-center space-x-3">
            <StatusOnlineIcon className="w-5 h-5 text-pink-500" />
            <div className="">Batch: [BATCH_TITLE]</div>
          </div>
        </div>
      )}
    </div>
  </>
}

export default Hero