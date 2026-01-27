import type { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { Controller } from "react-hook-form";
import registerImage from "../../assets/imgs/catDog.png"
import type { userFormFields } from "../../Interfaces/zodSchema";
import "../../assets/css/RegisterPagePart2.css"
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { LuSmartphone } from "react-icons/lu";
import { PatternFormat } from 'react-number-format';
import { UserPhoneController } from "../functions/userFunctions";

type RegisterPersonalDataForm = {
  register: UseFormRegister<userFormFields>;
  errors: FieldErrors<userFormFields>;
  handleSubmit: UseFormHandleSubmit<userFormFields>;
  control: Control<userFormFields>
  onContinue: () => void;
  isSubmitting: boolean;
  formPart: number;
}

function RegisterUserPart2({ register, errors, handleSubmit, onContinue, isSubmitting, formPart, control }: RegisterPersonalDataForm) {
  return (
    <section className="register-page">
      <div className="register-card">
        {/* LEFT SIDE (image) */}
        <div className="register-left" aria-hidden="true">
          <img className="register-image" src={registerImage} alt="" />
          <div className="register-imageOverlay" />
        </div>

        {/* RIGHT SIDE (form) */}
        <div className="register-right">
          <div className="register-header">
            <h1 className="register-title">Criar conta</h1>
            <p className="register-subtitle">Digite seus dados pessoais</p>
            <div className="register-step">Passo {formPart} de 4</div>
          </div>

          <form className="register-form" onSubmit={handleSubmit(onContinue)}>
            {/* Row 1: Name | Last name */}
            <div className="register-row">
              <div className="register-field half">
                <label className="register-label" htmlFor="name">
                  Nome
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaRegUser />
                  </span>
                  <input
                    id="name"
                    {...register("name", { required: true })}
                    placeholder="Seu nome"
                  />
                </div>
                {errors.name && (
                  <p className="error">{String(errors.name.message)}</p>
                )}
              </div>

              <div className="register-field half">
                <label className="register-label" htmlFor="lastName">
                  Sobrenome
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaRegUser />
                  </span>
                  <input
                    id="lastName"
                    {...register("lastName", { required: true })}
                    placeholder="Seu sobrenome"
                  />
                </div>
                {errors.lastName && (
                  <p className="error">{String(errors.lastName.message)}</p>
                )}
              </div>
            </div>

            {/* Row 2: Password | Phone */}
            <div className="register-row">
              <div className="register-field half">
                <label className="register-label" htmlFor="password">
                  Senha
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <CiLock />
                  </span>
                  <input
                    id="password"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Crie uma senha"
                  />
                </div>
                {errors.password && (
                  <p className="error">{String(errors.password.message)}</p>
                )}
              </div>

              <div className="register-field half">
                <label className="register-label" htmlFor="phone">
                  Telefone - Opcional
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <LuSmartphone />
                  </span>
                  <UserPhoneController control={control}/>
                </div>
                {errors.phone && (
                  <p className="error">{String(errors.phone.message)}</p>
                )}
              </div>
            </div>

            <button className="registerBtn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Avançando..." : "Avançar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterUserPart2