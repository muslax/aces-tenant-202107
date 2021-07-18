import LicenseNav from "./LicenseNav"

export default function LicenseLayout({ children }) {
  return (
    <div id="" className="">

      {/* Nav */}
      <LicenseNav />

      {/* <div className="progress h-2"></div> */}
      
      <main className="max-w-4xl mx-auto px-5 pb-24">
        {children}
      </main>
    </div>
  )
}