import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar";
import TabTabulations from "../cover/TabTabulations.jpg";
import "../CSShome.css";

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <section className="homepage">
        <Navbar />
        <main>
          {location.pathname === "/" && (
            <img src={TabTabulations} alt="Project cover" />
          )}
        </main>
      </section>
      <Outlet />
    </>
  );
}
