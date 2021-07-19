import Image from 'next/image'

const LicenseHero = ({ user, isForm }) => {
  return <>
    <div id="license-hero" className="">
      <div className={`${isForm ? 'max-w-2xl' : 'max-w-4xl'} mx-auto px-5 pt-8 pb-6`}>
        <div className="flex items-center justify--center space-x-5">
          <div className={`rounded-full w-20 h-20 ${isForm ? '' : 'sm:w-24 sm:h-24'}`}>
            <img 
              src="https://res.cloudinary.com/ptkj/image/upload/v1615757635/aces/td14hmkzhh6wpj0tlay7.jpg"
              width="100%"
              height="100%"
              className="object-contain rounded-full"
            />
          </div>
          <div className="flex-grow flex flex-col justify-items">
            <span className="text-xs font-light uppercase">
              ACES {user.license.type} License
            </span>
            <span className={`text-2xl ${isForm ? '' : 'sm:text-3xl'}`}>
              {user.license.title}
            </span>
            <span className="text-xs py-1">
              {user.license.publishDate.substr(0, 10)} / {user.license._id}
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default LicenseHero
