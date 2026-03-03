import type { Control, UseFormGetValues, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";
import "../../assets/css/verifyCode.css"
import type { userFormFields } from "../../Interfaces/zodSchema";
import { UserCodeController } from "../functions/userFunctions";
import { IoShieldOutline } from "react-icons/io5";

type verifyEmailType = {
    getValues: UseFormGetValues<userFormFields>,
    watch: UseFormWatch<userFormFields>
    handleSubmit: UseFormHandleSubmit<userFormFields>,
    verifyCode: () => void
    control: Control<userFormFields>
}

function VerifyEmailCode({ getValues, watch, handleSubmit, verifyCode, control }: verifyEmailType) {
    const email = getValues("email")
    const code = watch("code") || ""

    return (
        <form className="codeCard-inline" onClick={handleSubmit(verifyCode)}>
            <div className="codeIconWrap-inline">
                <div className="codeIconBg-inline">
                    <IoShieldOutline/>
                </div>
            </div>

            <h2 className="codeTitle-inline">Verificar código</h2>
            <p className="codeSubtitle-inline">
                Digite o código enviado para seu email
            </p>

            <div className="codeEmailPill-inline">
                <span>{email}</span>
            </div>

            <label className="codeLabel-inline">Código de verificação</label>

            <UserCodeController control={control} />

            <span className="codeHint-inline">
                Digite o código de 6 dígitos
            </span>

            <button className="codeBtn-inline" type="button">
                Verificar código →
            </button>

            <div className="codeFooter-inline">
                <span>Não recebeu o código?</span>
                <button type="button"
                    disabled={code.length < 6}
                >Reenviar código
                </button>
            </div>
        </form>
    );
}

export default VerifyEmailCode