import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../Interfaces/GlobalUser";
import { cepSearch, UserCepController, UserPhoneController } from "../functions/userFunctions";
import apiFetch from "../../Interfaces/TokenAuthorization";
import { z } from "zod"
import {zodResolver} from '@hookform/resolvers/zod'
import {SettingsSchema as schema} from "../../Interfaces/zodSchema"
import { emptyToNull } from "../functions/userFunctions";

export default function SettingsForm() {
    const { user, token } = useUser();
    const allAddress = user?.addresses || [];
    const [selectedAddress, setSelectedAddress] = useState<any>(allAddress[0]);

    // -------------------------
    // RHF INITIALIZATION
    // -------------------------

    type FormFields = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
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

    if (!user || !token) return <div>Loading Data...</div>;

    const complete_name = `${user.name} ${user.lastName}`;

    // -------------------------
    // ON SUBMIT
    // -------------------------
    const onSubmit = async (formData: any) => {
        const newAddress = {
            cep: emptyToNull(formData.cep),
            street: formData.street,
            neighborhood: formData.neighborhood,
            city: formData.city,
            region: formData.region
        };

        const personalData = {
            email: emptyToNull(formData.email),
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

        console.log(payload)
        const response = await apiFetch('http://localhost:3000/users/updateById', {
            method: 'PUT',
            body: JSON.stringify(payload)
        }, token)

        const res = await response.json();
        console.log("API Response:", res);
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
                                {...register("email", {setValueAs: (v) => v.trim() == "" ? undefined : v})}
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <h3>Segurança</h3>
                        <div className="field">
                            <label>Alterar Senha:</label>

                            <input
                                type="password"
                                placeholder="Senha atual"
                                {...register("password", {setValueAs: (v) => v.trim() == "" ? undefined : v})}
                            />

                            <input
                                type="password"
                                placeholder="Nova senha"
                                {...register("newPassword", {setValueAs: (v) => v.trim() == "" ? undefined : v})}
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
                            <UserPhoneController control={control}/>
                            {errors.phone && <p className="error">{errors.phone.message}</p>}
                        </div>
                        ) : (<div className="field">
                            <label>Telefone atual: não tem</label>
                            <input type="tel" readOnly placeholder="não é possivel atualizar"/>
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
                            ): (<select>
                                <option value="">Não há nenhum endereço</option>
                            </select>)}
                        </div>

                        <div className="field">
                            <label>Novo Endereço:</label>

                            <div className="address-grid">
                                <UserCepController control={control}/>

                                <input placeholder="Rua" readOnly {...register("street", {setValueAs: (v) => v.trim() == "" ? undefined : v})} />
                                <input placeholder="Bairro" readOnly {...register("neighborhood", {setValueAs: (v) => v.trim() == "" ? undefined : v})} />
                                <input placeholder="Cidade" readOnly {...register("city", {setValueAs: (v) => v.trim() == "" ? undefined : v})} />

                                <input placeholder="Estado" readOnly className="full" {...register("region", {setValueAs: (v) => v.trim() == "" ? undefined : v})} />

                                {errors.cep && <p className="error">{errors.cep.message}</p>}
                            </div>
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