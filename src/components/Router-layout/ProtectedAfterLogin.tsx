import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"

export default function ProtectedAfterLogin() {
  const { user, loggedIn} = useUser();
  const location = useLocation();

  if (user && loggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
