import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import "../../assets/css/googleWrapper.css"
import resendApiPrivate from './resendApi';
import { toast } from 'react-toastify';

const apiCall = async (token: string, verifyToken: () => Promise<void>, credential: CredentialResponse, nav: (path: string) => void, setToken: (token: string | null) => void) => {
    const response = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/googleLogin`,
        options: { method: "POST", body: JSON.stringify(credential), credentials: "include" },
        token: token,
        verifyToken: verifyToken
    })

    if (!response?.ok) return toast.error("Erro ao tentar logar pelo google")

    setToken(response?.data)
    nav("/Profile")
}

type googleLoginType = {
    token: string,
    verifyToken: () => Promise<void>,
    nav: (path: string) => void
    setToken: (token: string | null) => void
}

function GoogleLoginPage({ token, verifyToken, nav, setToken }: googleLoginType) {
  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={credentialResponse => {
          apiCall(token, verifyToken, credentialResponse, nav, setToken)
        }}
        onError={() => console.log("Login Failed")}
      />
    </div>
  )
}

export default GoogleLoginPage