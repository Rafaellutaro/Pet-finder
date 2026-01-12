import { useLocation, useNavigate } from "react-router-dom";

function useRedirect(defaultPath: string = "/") {
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = () => {
    const from = location.state?.from?.pathname || defaultPath;
    navigate(from, { replace: true });
  };

  return redirect;
}

export default useRedirect
