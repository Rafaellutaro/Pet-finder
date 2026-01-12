import { useLocation, useNavigate } from "react-router-dom";

export default function useRedirect(defaultPath: string = "/") {
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = () => {
    const from = location.state?.from?.pathname || defaultPath;
    navigate(from, { replace: true });
  };

  return redirect;
}

export function usePetRedirect(defaultPath: string = "/Pets") {
  const navigate = useNavigate();
  return (id: string) => navigate(`${defaultPath}/${id}`);
}


