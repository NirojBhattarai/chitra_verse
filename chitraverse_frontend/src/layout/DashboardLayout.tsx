import { Outlet } from "react-router"

const DashboardLayout = () => {
  return (
    <div>
        This is Dashboard
        <Outlet/>
    </div>
  )
}

export default DashboardLayout