import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import PurchaseComponents from "./PurchaseComponents"


const Layout = () => {
  return (
    <div className="min-h-screen w-svw grid grid-cols-[1fr] grid-rows-[70px_1fr_50px] gap-y-[10px]">
      <header>
        <Navbar />
      </header>
      <main className="px-3 md:p-3 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>
      <footer className="flex justify-center items-center bg-[#172B3C] " >
        <img src="https://res.cloudinary.com/dphleqb5t/image/upload/v1740783455/jc-develop/JC-LOGO-Horizontal-175-50_kv6fvk.svg" alt="jc-copy-rights" className="h-full"  />
        <span className="text-white text-xs">© 2025</span>
      </footer>
      <PurchaseComponents />
    </div>
  )
}

export default Layout