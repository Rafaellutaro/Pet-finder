import type { Control, UseFormGetValues, UseFormHandleSubmit, UseFormWatch } from "react-hook-form";
import "../../assets/css/verifyCode.css"
import type { userFormFields } from "../../Interfaces/zodSchema";
import { UserCodeController } from "../functions/userFunctions";
import { IoShieldOutline } from "react-icons/io5";
import { useState } from "react";
import { InfoPopUp } from "../reusable/PopUps";

type verifyEmailType = {
    getValues: UseFormGetValues<userFormFields>,
    watch: UseFormWatch<userFormFields>
    handleSubmit: UseFormHandleSubmit<userFormFields>,
    verifyCode: () => void
    control: Control<userFormFields>
    demoCode: string
}

function VerifyEmailCode({ getValues, watch, handleSubmit, verifyCode, control, demoCode }: verifyEmailType) {
    const [open, setOpen] = useState(false)

    const email = getValues("email")
    const code = watch("code") || ""

    return (
        <>
            <InfoPopUp 
            open={open} 
            title="Envio de email desativado" 
            details="O envio automático de emails requer um domínio verificado. Como esta é uma versão de demonstração sem domínio configurado, o código de verificação é exibido diretamente na tela para permitir a continuidade do cadastro." 
            onClose={() => setOpen(false)}/>

            <form className="codeCard-inline" onSubmit={handleSubmit(verifyCode)}>
                <div className="codeIconWrap-inline">
                    <div className="codeIconBg-inline">
                        <IoShieldOutline />
                    </div>
                </div>

                <h2 className="codeTitle-inline">Verificar código</h2>
                <p className="codeSubtitle-inline">Digite o código enviado para seu email</p>

                <div className="codeEmailPill-inline">
                    <span>{email}</span>
                </div>

                <label className="codeLabel-inline">Código de verificação</label>

                <UserCodeController control={control} />

                <span className="codeHint-inline">Digite o código de 6 dígitos</span>

                <div className="codeDemo-inline" role="note" aria-live="polite">
                    <div className="codeDemoTop-inline">
                        <p className="codeDemoMsg-inline">
                            Nesta versão de demonstração, o envio de emails está desativado.
                            <button type="button" className="codeDemoLink-inline" onClick={() => setOpen(true)}>
                                Saiba mais
                            </button>
                        </p>
                    </div>

                    <div className="codeDemoBottom-inline">
                        <code className="codeDemoCode-inline">{demoCode}</code>

                        <button
                            type="button"
                            className="codeDemoCopy-inline"
                            onClick={() => navigator.clipboard.writeText(String(demoCode))}
                        >
                            Copiar
                        </button>
                    </div>
                </div>

                <button className="codeBtn-inline" type="submit" disabled={code.length < 6}>
                    Verificar código →
                </button>

                <div className="codeFooter-inline">
                    <span>Não recebeu o código?</span>
                    <button type="button">
                        Reenviar código
                    </button>
                </div>
            </form>

        </>
    );
}

export default VerifyEmailCode


// original return

// return (
//         <form className="codeCard-inline" onClick={handleSubmit(verifyCode)}>
//             <div className="codeIconWrap-inline">
//                 <div className="codeIconBg-inline">
//                     <IoShieldOutline/>
//                 </div>
//             </div>

//             <h2 className="codeTitle-inline">Verificar código</h2>
//             <p className="codeSubtitle-inline">
//                 Digite o código enviado para seu email
//             </p>

//             <div className="codeEmailPill-inline">
//                 <span>{email}</span>
//             </div>

//             <label className="codeLabel-inline">Código de verificação</label>

//             <UserCodeController control={control} />

//             <span className="codeHint-inline">
//                 Digite o código de 6 dígitos
//             </span>

//             <button className="codeBtn-inline" type="button">
//                 Verificar código →
//             </button>

//             <div className="codeFooter-inline">
//                 <span>Não recebeu o código?</span>
//                 <button type="button"
//                     disabled={code.length < 6}
//                 >Reenviar código
//                 </button>
//             </div>

//             <div className="codeFooter-inline">
//                 <span>codigo em demo, clique em avançar para skipar</span>
//                 <button type="button" onClick={() => setFormPart(i => i + 1)}>
//                     Avançar
//                 </button>
//             </div>
//         </form>
//     );