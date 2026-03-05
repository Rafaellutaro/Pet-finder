import { useEffect } from "react";
import "../../assets/css/changePass.css";
import { MdOutlineEmail, MdClose } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import type { passChangeLogin } from "../../Interfaces/zodSchema";
import type { UseFormGetValues, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

type PasswordChangeProps = {
    modal: "email" | "none" | "newPass" | "validation";
    onClose: () => void;
    onSubmit: () => void
    handleSubmit: UseFormHandleSubmit<passChangeLogin>
    register: UseFormRegister<passChangeLogin>
    getValues: UseFormGetValues<passChangeLogin>
};

export function PasswordChange({ modal, onClose, onSubmit, handleSubmit, register }: PasswordChangeProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key == "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [modal, onClose]);

    if (modal == "none") return null;
    else if (modal == "email"){
        return (
        <section className="passChange-backdrop">
            <div
                className="passChange-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="passChange-title"
            >
                <button
                    type="button"
                    className="passChange-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <MdClose className="passChange-closeIcon" />
                </button>

                <div className="passChange-iconWrap" aria-hidden="true">
                    <MdOutlineEmail className="passChange-icon" />
                </div>

                <h1 className="passChange-title" id="passChange-title">
                    Redefinir sua senha
                </h1>
                <p className="passChange-subtitle">
                    Digite seu endereço de e-mail e enviaremos instruções para redefinir sua senha.
                </p>

                <form className="passChange-form" onSubmit={handleSubmit(onSubmit)}>
                    <label className="passChange-label" htmlFor="passChange-email">
                        Endereço de e-mail
                    </label>

                    <input
                        id="passChange-email"
                        type="email"
                        {...register("email")}
                        className="passChange-input"
                        placeholder="seu.email@exemplo.com"
                        autoComplete="email"
                    />

                    <button type="submit" className="passChange-btnPrimary">
                        Enviar link de redefinição
                    </button>

                    <button
                        type="button"
                        className="passChange-btnGhost"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </section>
    );
    }
}

export function NewPassword({ modal, onClose, onSubmit, handleSubmit, register, getValues }: PasswordChangeProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key == "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [modal, onClose]);

    if (modal == "none") return null;
    else if (modal == "newPass"){
        const email = getValues("email");

        return (
  <section className="newPass-backdrop">
    <div className="newPass-card" role="dialog" aria-modal="true" aria-labelledby="newPass-title" tabIndex={-1}>
      <button type="button" className="newPass-close" aria-label="Close" onClick={onClose}>
        <span className="newPass-closeX"><MdClose/></span>
      </button>

      <div className="newPass-iconWrap" aria-hidden="true">
        <CiLock className="newPass-icon"/>
      </div>

      <h1 className="newPass-title" id="newPass-title">
        Criar nova senha
      </h1>

      <p className="newPass-subtitle">
        Digite uma nova senha para <span className="newPass-email">{email}</span>
      </p>

      <form className="newPass-form" onSubmit={handleSubmit(onSubmit)}>
        <label className="newPass-label" htmlFor="newPass-pass1">
          Nova senha
        </label>

        <div className="newPass-field">
          <input
            id="newPass-pass1"
            type="password"
            {...register("password")}
            className="newPass-input"
            placeholder="Digite a nova senha"
            autoComplete="new-password"
          />
          {/* <button type="button" className="newPass-eyeBtn" aria-label="Show password">
            <IoEyeOutline className="newPass-eye"/>
          </button> */}
        </div>

        <label className="newPass-label" htmlFor="newPass-pass2">
          Confirmar nova senha
        </label>

        <div className="newPass-field">
          <input
            id="newPass-pass2"
            type="password"
            {...register("newPassword")}
            className="newPass-input"
            placeholder="Confirme a nova senha"
            autoComplete="new-password"
          />
          {/* <button type="button" className="newPass-eyeBtn" aria-label="Show password">
            <IoEyeOutline className="newPass-eye"/>
          </button> */}
        </div>

        <button type="submit" className="newPass-btnPrimary">
          Redefinir senha
        </button>

        <button type="button" className="newPass-btnGhost" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  </section>
);
    }
}