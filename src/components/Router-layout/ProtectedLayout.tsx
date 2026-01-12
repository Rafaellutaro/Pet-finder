import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"

export default function ProtectedLayout() {
  const { user, loggedIn} = useUser();
  const location = useLocation();

  if (!loggedIn) return

  if (!user) {
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
