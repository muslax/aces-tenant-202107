import { useRouter } from "next/router"
import Link from "next/link"

const ProjectNav = () => {
  const router = useRouter()
  const { id } = router.query
  const path = router.asPath

  const navigation = [
    { label: 'Overview',    href: `/projects/${id}` },
    { label: 'Modules',     href: `/projects/${id}/modules` },
    { label: 'Persona',     href: `/projects/${id}/persona` },
    { label: 'Deployment',  href: `/projects/${id}/deployment` },
  ]

  return <>
    <div className="relative bg-white">
      <div className="max-w-4xl mx-auto px-5">
        <nav className="flex space-x-4 xs:space-x-5 sm:space-x-6 md:space-x-8 border-b border-green-500 border-opacity-70">
          {navigation.map(({ label, href }) => (
            <Link key={href} href={href}>
              <a className={`text-green-600 pt-3 pb-2 border-b-4 
                ${href == path 
                ? 'border-green-500 border-opacity-70'
                : 'border-transparent hover:border-green-500 hover:border-opacity-25'} 
              `}>{label}</a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </>
}

export default ProjectNav