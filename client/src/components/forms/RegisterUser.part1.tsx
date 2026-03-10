import { Link } from "react-router-dom";
// import { FaGoogle } from "react-icons/fa";
import "../../assets/css/RegisterPagePart1.css"
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { userFormFields } from "../../Interfaces/zodSchema";
import { MdOutlineEmail } from "react-icons/md";
import GoogleLoginPage from "../reusable/GoogleLogin";

type RegisterEmailForm = {
    register: UseFormRegister<userFormFields>;
    errors: FieldErrors<userFormFields>;
    handleSubmit: UseFormHandleSubmit<userFormFields>;
    onContinue: () => void;
    isSubmitting: boolean;
    token: string; 
    verifyToken: () => Promise<void>;
    nav: (path: string) => void;
    setToken: (token: string | null) => void;
}

function RegisterUserpart1({register, errors, handleSubmit, onContinue, isSubmitting, token, verifyToken, nav, setToken}: RegisterEmailForm){
    return (
          <form className="register-form" onSubmit={handleSubmit(onContinue)}>
            <div className="register-field">
              <label className="register-label" htmlFor="email">
                Email
              </label>

              <div className="register-input-wrap">
                <span className="register-input-icon" aria-hidden="true">
                  <MdOutlineEmail/>
                </span>
                <input type="email" {...register("email", {required: true})}/>
                {errors.email && <p className="error">{errors.email.message}</p>}
              </div>
            </div>

            <button className="registerBtn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Avançando..." : "Avançar"}
            </button>

            <div className="register-divider">
              <span />
              <p>ou</p>
              <span />
            </div>

            {/* <button
              type="button"
              className="register-socialBtn"
              onClick={(e) => handlegoogle(e)} 
            >
              <span className="google-icon" aria-hidden="true">
                <FaGoogle/>
              </span>
              Continuar com Google
            </button> */}
            <GoogleLoginPage token={token} verifyToken={verifyToken} nav={nav} setToken={setToken}/>

            <div className="register-footer">
              <p className="register-loginText">
                Já tem conta?{" "}
                <Link className="register-link" to="/Login">
                  Entrar
                </Link>
              </p>

              <p className="register-terms">
                Ao continuar, você aceita os{" "}
                <a className="register-link" href="#">
                  Termos de uso
                </a>{" "}
                e{" "}
                <a className="register-link" href="#">
                  Política de privacidade
                </a>
                .
              </p>
            </div>
          </form>
  );
}

export default RegisterUserpart1;