import { useLocation, useNavigate } from "react-router-dom";

export function useNavigateWithFrom() {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("location with from", location)

  return (path: string) => {
    navigate(path, {
      state: { from: location.pathname }
    });
  };
}

export default function useRedirect(defaultPath: string = "/") {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("location", location)

  const redirect = () => {
    const from = location.state?.from || defaultPath;
    navigate(from, { replace: true });
  };

  return redirect;
}

// became useless, just created them because i didn't truly understand navigating correctly, but now i understood it.

// export function usePetRedirect(defaultPath: string = "/Pets") {
//   const navigate = useNavigate();
//   return (id: string) => navigate(`${defaultPath}/${id}`);
// }

// export function useChatRedirect(defaultPath: string = "/Chat") {
//   const navigate = useNavigate();
//   return (id: string) => navigate(`${defaultPath}/${id}`);
// }


