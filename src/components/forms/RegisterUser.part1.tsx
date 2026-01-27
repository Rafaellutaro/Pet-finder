import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import "../../assets/css/RegisterPagePart1.css"
import registerImage from "../../assets/imgs/catDog.png"
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { userFormFields } from "../../Interfaces/zodSchema";
import { MdOutlineEmail } from "react-icons/md";

type RegisterEmailForm = {
    register: UseFormRegister<userFormFields>;
    errors: FieldErrors<userFormFields>;
    handleSubmit: UseFormHandleSubmit<userFormFields>;
    onContinue: () => void;
    isSubmitting: boolean;
}

function RegisterUserpart1({register, errors, handleSubmit, onContinue, isSubmitting}: RegisterEmailForm){
    return (
    <section className="register-page">
      <div className="register-card">
        {/* LEFT SIDE (image) */}
        <div className="register-left" aria-hidden="true">
          <img className="register-image" src={registerImage} alt="" />
          {/* you can remove the overlay if you prefer the image brighter */}
          <div className="register-imageOverlay" />
        </div>

        {/* RIGHT SIDE (form) */}
        <div className="register-right">
          <div className="register-header">
            <h1 className="register-title">Criar conta</h1>
            <p className="register-subtitle">
              Digite seu e-mail para receber um código de confirmação.
            </p>

            <div className="register-step">Passo 1 de 4</div>
          </div>

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

            <button
              type="button"
              className="register-socialBtn"
            //   onClick={handleGoogle} goole thing here later
            >
              <span className="google-icon" aria-hidden="true">
                <FaGoogle/>
              </span>
              Continuar com Google
            </button>

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
        </div>
      </div>
    </section>
  );
}

export default RegisterUserpart1;