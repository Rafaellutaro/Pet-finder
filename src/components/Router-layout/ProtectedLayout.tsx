import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"
import Loader from "../reusable/Loader";

export default function ProtectedLayout() {
  const { user, loggedIn} = useUser();
  const location = useLocation();

  if (!user) return <Loader />

  if (!loggedIn) {
    return (
      <Navigate
        to="/Login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
