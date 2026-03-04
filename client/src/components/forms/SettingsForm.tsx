import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../Interfaces/GlobalUser";
import { cepSearch, UserCepController, UserPhoneController } from "../functions/userFunctions";
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsSchema as schema } from "../../Interfaces/zodSchema"
import { emptyToNull } from "../functions/userFunctions";
import resendApiPrivate from "../reusable/resendApi";
import Loader from "../reusable/Loader";

export default function SettingsForm() {
    const { user, token, verifyToken } = useUser();
    const allAddress = user?.addresses || [];
    const [selectedAddress, setSelectedAddress] = useState<any>(allAddress[0]);

    // -------------------------
    // RHF INITIALIZATION
    // -------------------------

    type FormFields = z.infer<typeof schema>

    const hasValues = (obj: Record<string, any> | undefined) => {
        return obj && Object.keys(obj).length > 0
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    // -------------------------
    // WATCH CEP FOR AUTO-FILL
    // -------------------------
    const cep = watch("cep");

    useEffect(() => {
        cepSearch(setValue, String(cep))
    }, [cep]);

    useEffect(() => {
        setSelectedAddress(allAddress[0])
    }, [user])

    if (!user || !token) return <Loader/>;

    const complete_name = `${user.name} ${user.lastName}`;

    // -------------------------
    // ON SUBMIT
    // -------------------------
    const onSubmit = async (formData: any) => {
        const newAddress = {
            cep: emptyToNull(formData.cep),
            street: emptyToNull(formData.street),
            neighborhood: emptyToNull(formData.neighborhood),
            city: emptyToNull(formData.city),
            region: emptyToNull(formData.region)?.toUpperCase() ?? null
        };

        const personalData = {
            email: emptyToNull(formData.email),
            currentPassword: emptyToNull(formData.password),
            newPassword: emptyToNull(formData.newPassword),
            phone: emptyToNull(formData.phone)
        };

        // Remove empty values
        const cleanedPersonal = Object.fromEntries(
            Object.entries(personalData).filter(([_, v]) => v)
        );
        const cleanedAddress = Object.fromEntries(
            Object.entries(newAddress).filter(([_, v]) => v)
        );

        const payload =
            cleanedAddress.cep
                ? { address: selectedAddress, newAddress: cleanedAddress, personal: cleanedPersonal }
                : { personal: cleanedPersonal };

        if (hasValues(payload.personal) || hasValues(payload.newAddress) || hasValues(payload.address)) {
            const response = await resendApiPrivate({
                apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/updateById`, 
                options: {method: "PUT", body: JSON.stringify(payload)}, 
                token: String(token), 
                verifyToken: verifyToken})
            
            if (!response?.ok) return

            reset();
        } else{
            alert("Insira algo primeiro")
        }
    };

    return (
        <div className="details-container">
            <div className="details-grid">

                <form onSubmit={handleSubmit(onSubmit)} className="profile-form">

                    {/* LEFT */}
                    <div className="details-column">
                        <h3>Informações Pessoais</h3>

                        <div className="field">
                            <label>Nome Completo: {complete_name}</label>
                            <input readOnly placeholder="Inalterável" />
                        </div>

                        <div className="field">
                            <label>Email atual: {user.email}</label>
                            <input
                                type="email"
                                placeholder="novoemail@gmail.com"
                                {...register("email", { setValueAs: (v) => v.trim() == "" ? undefined : v })}
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <h3>Segurança</h3>
                        <div className="field">
                            <label>Alterar Senha:</label>

                            <input
                                type="password"
                                placeholder="Senha atual"
                                {...register("password", { setValueAs: (v) => v.trim() == "" ? undefined : v })}
                            />

                            <input
                                type="password"
                                placeholder="Nova senha"
                                {...register("newPassword", { setValueAs: (v) => v.trim() == "" ? undefined : v })}
                            />
                            {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="details-column">
                        <h3>Endereço</h3>

                        {user.phone ? (
                            <div className="field">
                                <label>Telefone atual: {user.phone}</label>
                                <UserPhoneController control={control} />
                                {errors.phone && <p className="error">{errors.phone.message}</p>}
                            </div>
                        ) : (<div className="field">
                            <label>Telefone atual: não tem</label>
                            <input type="tel" style={{ background: "#f1f3f5" }} readOnly placeholder="não é possivel atualizar" />
                        </div>
                        )}

                        <div className="field">
                            <label>Escolha o endereço para alterar:</label>

                            {allAddress.length > 0 ? (
                                <select
                                    onChange={(e) => setSelectedAddress(JSON.parse(e.target.value))}
                                    defaultValue={JSON.stringify(allAddress[0])}
                                >
                                    {allAddress.map((addr: any, i: number) => (
                                        <option key={i} value={JSON.stringify(addr)}>
                                            {`${addr.street} | ${addr.neighborhood} | ${addr.city} | ${addr.state}`}
                                        </option>
                                    ))}
                                </select>
                            ) : (<select style={{ background: "#f1f3f5" }}>
                                <option value="">Não há nenhum endereço</option>
                            </select>)}
                        </div>

                        <div className="field">
                            <label>Novo Endereço:</label>

                            {allAddress.length > 0 ? (
                                <div className="address-grid">
                                    <UserCepController control={control} />

                                    <input placeholder="Rua"  {...register("street", { setValueAs: (v) => v.trim() == "" ? undefined : v })} />
                                    <input placeholder="Bairro"  {...register("neighborhood", { setValueAs: (v) => v.trim() == "" ? undefined : v })} />
                                    <input placeholder="Cidade"  {...register("city", { setValueAs: (v) => v.trim() == "" ? undefined : v })} />

                                    <input placeholder="Estado" className="full" {...register("region", { setValueAs: (v) => v.trim() == "" ? undefined : v })} />

                                    {errors.cep && <p className="error">{errors.cep.message}</p>}
                                </div>
                            ) : (
                                <div className="address-grid">
                                    <input placeholder="Cep" style={{ background: "#f1f3f5" }} readOnly />

                                    <input placeholder="Rua" style={{ background: "#f1f3f5" }} readOnly />
                                    <input placeholder="Bairro" style={{ background: "#f1f3f5" }} readOnly />
                                    <input placeholder="Cidade" style={{ background: "#f1f3f5" }} readOnly />

                                    <input placeholder="Estado" style={{ background: "#f1f3f5" }} readOnly className="full" />

                                    {errors.cep && <p className="error">{errors.cep.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="save-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Salvando..." : "Salvar"}
                    </button>
                </form>
            </div>

            <p>Dica: Apenas os campos preenchidos serão alterados.</p>
        </div>
    );
}