import useUser from "hooks/useUser"

const { default: fetchJson } = require("lib/fetchJson")
const { useRouter } = require("next/router")

const { APIROUTES, ROUTES } = require("config/routes")

const LogoutButton = ({ label, className }) => {
  const router = useRouter()
  const { user, mutateUser } = useUser()

  async function handleLogout(e) {
    e.preventDefault()
    await mutateUser(fetchJson(APIROUTES.LOGOUT, { method: 'POST' }))
    router.push(ROUTES.Home)
  }

  return (
    <a href={APIROUTES.LOGOUT} className={className} onClick={handleLogout}>
      {label || 'Logout'}
    </a>
  )
}

export default LogoutButton
