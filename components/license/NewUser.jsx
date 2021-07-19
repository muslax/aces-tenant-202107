import { useRouter } from "next/router"

import { XIcon } from "@heroicons/react/outline"
import { ROUTES } from "config/routes"

const NewUser = ({ user }) => {
  const router = useRouter()

  const cancel = (e) => {
    router.push(ROUTES.Users)
  } 

  return <>
    <div className="flex h-16 pt-2 items-center border-b border-blue-200">
      <h2 className="flex-grow text-xl text-blue-500 font-bold">Add New User</h2>
      <button onClick={cancel} className="rounded-sm text-pink-600 hover:text-blue-500">
        <XIcon className="w-7 h-7" />
      </button>
    </div>

    <pre>{JSON.stringify(user, null, 2)}</pre>
    <pre>{JSON.stringify(user, null, 2)}</pre>
    <pre>{JSON.stringify(user, null, 2)}</pre>
    <pre>{JSON.stringify(user, null, 2)}</pre>
    <pre>{JSON.stringify(user, null, 2)}</pre>
  </>
}

export default NewUser