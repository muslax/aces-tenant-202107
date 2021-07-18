import Link from "next/link"

const LicenseNav = () => {
  return (
    <nav className="max-w-4xl mx-auto px-5 py-3">
      <div className="flex space-x-3">
        <Link href="/"><a className="text-blue-500">Home</a></Link>
        <Link href="/dashboard"><a className="text-blue-500">Dashboard</a></Link>
        <Link href="/clients"><a className="text-blue-500">Clients</a></Link>
        <Link href="/users"><a className="text-blue-500">Users</a></Link>
        <Link href="/license"><a className="text-blue-500">License</a></Link>
      </div>
    </nav>
  )
}

export default LicenseNav