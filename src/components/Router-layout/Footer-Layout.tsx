import { Outlet } from "react-router-dom";
import Footer from "../Footer";

const FooterLayout = () => {
    console.log(Outlet)

  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default FooterLayout;