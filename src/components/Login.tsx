import { useState } from "react";
import { Link } from "react-router-dom";
import useRedirect from "./reusable/Redirect";
import "../assets/css/Login.css"
import { useUser } from '../Interfaces/GlobalUser';
import { FaGoogle } from "react-icons/fa";
// import { FaFacebook } from "react-icons/fa6";
// import { FaGithub } from "react-icons/fa";
import loginImage from "../assets/imgs/catLogin.png"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const profileNavigate = useRedirect("/Profile");
    const { setUser } = useUser();
    const { setToken } = useUser();
    const { setLoggedIn } = useUser();

    const login = async (e: any) => {
        e.preventDefault();

        console.log(email);
        console.log(password);

        // create api call to express here

        const loginDetails = {
            email,
            password
        }

        try {
            // maybe try to fit those two endPoints in only 1, would be cleaner.

            const sendRes = await fetch('http://localhost:3000/users/getEmail', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(loginDetails)
            })
            const data = await sendRes.json();
            console.log("dados do usuario", data);

            // creating a global variable for the user data

            const createToken = await fetch('http://localhost:3000/users/createToken', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(data.data)
            })

            const tokenRes = await createToken.json();

             setUser(data.data);
             setToken(tokenRes.accessToken);
             setLoggedIn(true);

            profileNavigate();
        } catch (e) {
            console.log(e)
        }
    }

    
    const loginWithGoogle = () => console.log("Google login");
    // const loginWithFacebook = () => console.log("Facebook login");
    // const loginWithGitHub = () => console.log("Github login");

    return (
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
                  ✉
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
                  🔒
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
              <Link className="forgot-link" to={"/changePassword"}>
                Esqueceu a sua senha?
              </Link>
            </div>

            <button className="loginBtn" type="submit">
              ENTRAR
            </button>

            <div className="or-divider">
              <span>OU</span>
            </div>

            <div className="social-row">
              <button
                type="button"
                className="socialBtn"
                onClick={loginWithGoogle}
                aria-label="Continue with Google"
                title="Continue with Google"
              >
                <span className="socialIcon google" aria-hidden="true">
                  <FaGoogle />
                </span>
              </button>

              {/* <button
                type="button"
                className="socialBtn"
                onClick={loginWithFacebook}
                aria-label="Continue with Facebook"
                title="Continue with Facebook"
              >
                <span className="socialIcon facebook" aria-hidden="true">
                  <FaFacebook />
                </span>
              </button>

              <button
                type="button"
                className="socialBtn"
                onClick={loginWithGitHub}
                aria-label="Continue with GitHub"
                title="Continue with GitHub"
              >
                <span className="socialIcon GitHub" aria-hidden="true">
                  <FaGithub/>
                </span>
              </button> */}
            </div>

            <p className="register-row">
              Não tem uma conta?{" "}
              <Link className="register-link" to={"/register"}>
                Registrar Agora
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE (image) */}
        <div className="login-right" aria-hidden="true">
          <img className="login-image" src={loginImage} alt="" />
          <div className="login-imageOverlay" />
          {/* <div className="login-imageText">
            <h2 className="login-brand">Travelista Tours</h2>
            <p className="login-tagline">
              Travel is the only purchase that enriches you in ways beyond
              material wealth
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );

}

export default LoginPage;