import type { Control, FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import type { userFormFields } from "../../Interfaces/zodSchema";
import registerImage from "../../assets/imgs/catDog.png"
import "../../assets/css/RegisterPagePart3.css"
import { FaStreetView } from "react-icons/fa";
import {UserCepController} from "../functions/userFunctions"

type RegisterPersonalDataForm = {
    register: UseFormRegister<userFormFields>;
    errors: FieldErrors<userFormFields>;
    handleSubmit: UseFormHandleSubmit<userFormFields>;
    onSubmit: (data: any) => Promise<void>;
    control: Control<userFormFields>
    isSubmitting: boolean;
    formPart: number;
}

function RegisterUserPart3({register, errors, handleSubmit, onSubmit, isSubmitting, formPart, control}: RegisterPersonalDataForm){

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
            <p className="register-subtitle">Endereço (opcional)</p>
            <div className="register-step">Passo {formPart} de 4</div>
          </div>

          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Row 1: CEP (full width) */}
            <div className="register-row">
              <div className="register-field full">
                <label className="register-label" htmlFor="cep">
                  CEP
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaStreetView/>
                  </span>
                  <UserCepController control={control}/>
                </div>
                {errors.cep && <p className="error">{String(errors.cep.message)}</p>}
              </div>
            </div>

            {/* Row 2: Street | Neighborhood */}
            <div className="register-row">
              <div className="register-field half">
                <label className="register-label" htmlFor="street">
                  Rua
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaStreetView/>
                  </span>
                  <input
                    id="street"
                    {...register("street")}
                    placeholder="Rua"
                    readOnly
                  />
                </div>
                {errors.street && (
                  <p className="error">{String(errors.street.message)}</p>
                )}
              </div>

              <div className="register-field half">
                <label className="register-label" htmlFor="neighborhood">
                  Bairro
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaStreetView/>
                  </span>
                  <input
                    id="neighborhood"
                    {...register("neighborhood")}
                    placeholder="Bairro"
                    readOnly
                  />
                </div>
                {errors.neighborhood && (
                  <p className="error">{String(errors.neighborhood.message)}</p>
                )}
              </div>
            </div>

            {/* Row 3: City | State */}
            <div className="register-row">
              <div className="register-field half">
                <label className="register-label" htmlFor="city">
                  Cidade
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaStreetView/>
                  </span>
                  <input
                    id="city"
                    {...register("city")}
                    placeholder="Cidade"
                    readOnly
                  />
                </div>
                {errors.city && <p className="error">{String(errors.city.message)}</p>}
              </div>

              <div className="register-field half">
                <label className="register-label" htmlFor="region">
                  Estado
                </label>

                <div className="register-input-wrap">
                  <span className="register-input-icon" aria-hidden="true">
                    <FaStreetView/>
                  </span>
                  <input
                    id="region"
                    {...register("region")}
                    placeholder="UF"
                    readOnly
                  />
                </div>
                {errors.region && (
                  <p className="error">{String(errors.region.message)}</p>
                )}
              </div>
            </div>

            <button className="registerBtn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Concluindo..." : "Concluir"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default RegisterUserPart3