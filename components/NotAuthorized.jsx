import Link from "next/link"

const { ROUTES } = require("config/routes")

const NotAuthorized = ({ user, sendBackUrl }) => {
  return <>
    <div className="rounded-lg text-center border border-pink-300 my-10 py-6">
      <h1 className="text-2xl mb-4 text-center">Not authorized access</h1>
      <div className="mb-6 text-xss font-mono bg-pink-300 px-4 py-1 whitespace-nowrap overflow-scroll">{JSON.stringify(user,null,0)}</div>
      <div>
        <Link href={sendBackUrl ? sendBackUrl : ROUTES.Dashboard}>
          <a className="text-blue-500">Send me back!</a>
        </Link>
      </div>
    </div>
  </>
}

export default NotAuthorized