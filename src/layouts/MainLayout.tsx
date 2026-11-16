import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;