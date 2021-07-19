import { useEffect } from "react"

import useUser from "hooks/useUser"

import LicenseHeader from "./LicenseHeader"
import LicenseHero from "./LicenseHero"
import LicenseNav from "./LicenseNav"

export default function LicenseLayout({ children, isForm }) {
  const { user } = useUser()

  const handleScroll = () => {
    if (
      document.getElementById("license-header") &&
      document.getElementById("license-hero") &&
      document.getElementById("license-nav")
    ) {
      const headerHeight= document.getElementById("license-header").clientHeight
      const heroHeight= document.getElementById("license-hero").clientHeight
      const navHeight= document.getElementById("license-nav").clientHeight
  
      if (window.scrollY > heroHeight) {
        document.getElementById("license-nav").classList.add("scrolled")
        document.getElementById("license-header-pad").style.height = `${headerHeight + navHeight}px`
      } else {
        document.getElementById("license-nav").classList.remove("scrolled")
        document.getElementById("license-header-pad").style.height = `${headerHeight}px`
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [])
  
  
  // Prevent showing something before rerouting
  if (!user || !user.isLoggedIn) return null // <>ERROR</>

  return <>
    <div id="license-container" className="relative">
      <LicenseHeader user={user} />

      <LicenseHero user={user} />
      
      <div id="license-nav" className="bg-white">
        {!isForm && <LicenseNav user={user} />}
        {isForm && <LicenseNav user={user} formLabel={isForm} />}
      </div>

      <main className="max-w-4xl mx-auto px-5 pb-24">
        {children}
      </main>
    </div>
    <style jsx>{`
    #license-nav.scrolled {
      position: fixed;
      top: 68px;
      left: 0;
      width: 100%
    }
    `}</style>
  </>
}