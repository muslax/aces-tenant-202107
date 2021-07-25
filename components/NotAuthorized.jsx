import Link from "next/link"

const { ROUTES } = require("config/routes")

const NotAuthorized = ({ user, sendBackUrl }) => {
  return <>
    <div className="rounded-lg text-center border border-yellow-300 bg-yellow-50 bg-gradient-to-l from-indigo-50 hover:shadow-sm my-10 py-6">
      <h1 className="text-2xl mb-4 text-center">Unauthorized access</h1>
      <div className="mb-6 text-xss text-white text-center select-none font-mono bg-yellow-300 px-4 py-1 whitespace-nowrap overflow-scroll">{JSON.stringify(user,null,0)}</div>
      <div>
        <Link href={sendBackUrl ? sendBackUrl : ROUTES.Dashboard}>
          <a className="text-blue-500 underline">Send me back!</a>
        </Link>
      </div>
    </div>
  </>
}

export default NotAuthorized