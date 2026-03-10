import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Login.css"
import { useUser } from '../Interfaces/GlobalUser';
// import { FaGoogle } from "react-icons/fa";
// import { FaFacebook } from "react-icons/fa6";
// import { FaGithub } from "react-icons/fa";
import loginImage from "../assets/imgs/catLogin.png"
import { CiLock } from "react-icons/ci";
import { MdClose, MdOutlineEmail } from "react-icons/md";
import { useNavigateWithFrom } from "./reusable/Redirect";
import { PasswordChange, NewPassword } from "./forms/PasswordChange";
import VerifyEmailCode from "./forms/VerifyEmailCode";
import { useForm } from "react-hook-form";
import { newPasswordLogin, RegisterSchemaPart1, RegisterSchemaPart2, type passChangeLogin } from "../Interfaces/zodSchema";
import "../assets/css/authWrapper.css"
import { zodResolver } from "@hookform/resolvers/zod";
import resendApiPrivate from "./reusable/resendApi";
import GoogleLoginPage from "./reusable/GoogleLogin";


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState<"none" | "email" | "validation" | "newPass">("none");
  const [demoCode, setDemoCode] = useState('')

  const profileNavigate = useNavigateWithFrom();
  const { setUser, token, verifyToken, setToken, setLoggedIn } = useUser();

  const resolver = useMemo(() => {
    if (modal == "email") return zodResolver(RegisterSchemaPart1);
    if (modal == "validation") return zodResolver(RegisterSchemaPart2);
    return zodResolver(newPasswordLogin);
  }, [modal]);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    reset,
  } = useForm<passChangeLogin>({
    resolver: resolver as any,
  }
  );

  const login = async (e: any) => {
    e.preventDefault();
    // create api call to express here
    const loginDetails = {
      email,
      password
    }

    try {
      // maybe try to fit those two endPoints in only 1, would be cleaner.

      const sendRes = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/getEmail`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(loginDetails)
      })
      const data = await sendRes.json();

      // creating a global variable for the user data
      if (sendRes.ok) {
        const createToken = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/createToken`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data.data)
        })

        const tokenRes = await createToken.json();

        setUser(data.data);
        setToken(tokenRes.data);
        setLoggedIn(true);

        profileNavigate("/Profile");
      }
    } catch (e) {
      console.log(e)
    }
  }


  // const loginWithGoogle = () => console.log("Google login");
  // const loginWithFacebook = () => console.log("Facebook login");
  // const loginWithGitHub = () => console.log("Github login");

  const verifyCode = async () => {
    const email = getValues("email")
    const code = getValues("code")

    const payload = {
      email: email,
      code: code
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/verifyEmailCode`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) return alert("Código Invalido")

      const data = await res.json()

      if (data.data == true) {
        setModal("newPass")
      }
    } catch (e) {
      console.log(e)
    }
  }

  const submitPassChange = async () => {
    const email = {
      email: getValues("email")
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/createEmailCode`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(email)
      })

      if (!res.ok) return

      const data = await res.json();

      setDemoCode(data.code)
      setModal("validation")
    } catch (e) {
      console.log(e)
    }
  }

  const submitNewPass = async () => {
    const password = getValues("password")
    const confirmPassword = getValues("newPassword")

    if (password != confirmPassword) return
    
    const email = getValues("email")

    const payload = {
      pass: password,
      email: email
    }

    try {

      const response = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/newPassword`, 
        options: {method: "PATCH", body: JSON.stringify(payload)}, 
        token: String(token), 
        verifyToken: verifyToken})
      
      if (!response?.ok) return

      setModal("none")
      reset();
    } catch (e) {
      console.log(e)
    }

  }



  return (
    <>
      {modal == "email" && (
        <PasswordChange
        modal={modal}
        onClose={() => setModal("none")}
        onSubmit={submitPassChange}
        handleSubmit={handleSubmit}
        register={register}
        getValues={getValues}
      />
      )}

      {modal == "validation" && (
        <section className="authModal-backdrop">
          <div
            className="authModal-card"
          >
            <button
              type="button"
              className="authModal-close"
              onClick={() => setModal("none")}
              aria-label="Close"
            >
              <MdClose />
            </button>

            <VerifyEmailCode<passChangeLogin>
              watch={watch}
              handleSubmit={handleSubmit}
              getValues={getValues}
              verifyCode={verifyCode}
              control={control}
              demoCode={demoCode}
              modal={modal}
            />
          </div>
        </section>
      )}

      {modal == "newPass" && (
        <NewPassword
        modal={modal}
        onClose={() => setModal("none")}
        onSubmit={submitNewPass}
        handleSubmit={handleSubmit}
        register={register}
        getValues={getValues}
      />
      )}

      <section className="login-page">
        <div className="login-card">
          {/* LEFT SIDE (form) */}
          <div className="login-left">
            <div className="login-header">
              <h1 className="login-title">LOGIN</h1>
            </div>

            <form className="login-form" onSubmit={login}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  Email
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <MdOutlineEmail />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@exemplo.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">
                  Senha
                </label>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <CiLock />
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="Senha"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="forgot-row">
                <button className="forgot-link" type="button" onClick={() => setModal("email")}>
                  Esqueceu a sua senha?
                </button>
              </div>

              <button className="loginBtn" type="submit">
                ENTRAR
              </button>

              <div className="or-divider">
                <span>OU</span>
              </div>

              {/* <div className="social-row">
                <button
                  type="button"
                  className="socialBtn"
                  onClick={loginWithGoogle}
                >
                  <span className="socialIcon google" aria-hidden="true">
                    <FaGoogle />
                  </span>
                  Continuar com Google
                </button>
              </div> */}

              <GoogleLoginPage token={String(token)} verifyToken={verifyToken} nav={profileNavigate} setToken={setToken}/>

              <p className="login-register-row">
                Não tem uma conta?
                <Link className="login-register-link" to={"/RegisterPage"}>
                  Registrar Agora
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT SIDE (image) */}
          <div className="login-right" aria-hidden="true">
            <img className="login-image" src={loginImage} alt="" />
            <div className="login-imageOverlay" />
          </div>
        </div>
      </section>
    </>
  );

}

export default LoginPage;