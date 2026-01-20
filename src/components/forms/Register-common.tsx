import { useEffect } from "react";
import { useForm } from "react-hook-form";
import '../../assets/css/RegisterCommon.css';
import { cepSearch } from "../functions/userFunctions";
import { RegisterSchema as schema } from "../../Interfaces/zodSchema";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormFields = z.infer<typeof schema>

export default function RegisterCommon() {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(schema)
    });

    // Watch CEP for auto-fill
    const cep = watch("cep");
    useEffect(() => {
        if (cep) {
            cepSearch(setValue, cep);
        }
    }, [cep]);

    const emptyToNull = (value?: string) =>
        value == "" ? null : value;


    const onSubmit = async (data: FormFields) => {
        const userData = {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            phone: emptyToNull(data.phone),
            password: data.password
        };

        const addressData = {
            cep: emptyToNull(data.cep),
            street: emptyToNull(data.street),
            neighborhood: emptyToNull(data.neighborhood),
            city: emptyToNull(data.city),
            region: emptyToNull(data.region)
        };

        const allUserData = { userData, addressData };
        console.log("Final payload:", allUserData);

        try {
            const res = await fetch('http://localhost:3000/users/insert', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(allUserData)
            });
            const result = await res.json();
            console.log("API result:", result);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section className='registerCommon-section'>
            <div className="common-container">
                <form onSubmit={handleSubmit(onSubmit)}>

                    <h1>Dados Pessoais</h1>

                    <div className="personal-data-container">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome:</label>
                                <input {...register("name", { required: "Nome é obrigatório" })} placeholder="Nome" />
                                {errors.name && <p className="error">{errors.name.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Sobrenome:</label>
                                <input {...register("lastName", { required: "Sobrenome é obrigatório" })} placeholder="Sobrenome" />
                                {errors.lastName && <p className="error">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email:</label>
                                <input {...register("email", {
                                    required: "Email é obrigatório",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Formato de email inválido" }
                                })} placeholder="Email" />
                                {errors.email && <p className="error">{errors.email.message}</p>}
                            </div>
                            {/* phone is no more 100% necessary */}
                            <div className="form-group">
                                <label>Telefone:</label>
                                <p>Opcional</p>
                                <input {...register("phone")} placeholder="Telefone" />
                                {errors.phone && <p className="error">{errors.phone.message}</p>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Senha:</label>
                                <input {...register("password", { required: "Senha é obrigatória", minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" } })} type="password" placeholder="Senha" />
                                {errors.password && <p className="error">{errors.password.message}</p>}
                            </div>
                        </div>
                    </div>
                    {/* address is no more 100% necessary */}
                    <h1>Endereço</h1>

                    <div className="location-data-container">
                        <div className="form-row">
                            <div className="form-group">
                                <label>CEP:</label>
                                <p>Opcional</p>
                                <input {...register("cep")} placeholder="CEP" />
                                {errors.cep && <p className="error">{errors.cep.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Rua:</label>
                                <p>Opcional</p>
                                <input {...register("street")} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bairro:</label>
                                <p>Opcional</p>
                                <input {...register("neighborhood")} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Cidade:</label>
                                <p>Opcional</p>
                                <input {...register("city")} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado:</label>
                                <p>Opcional</p>
                                <input {...register("region")} readOnly />
                            </div>
                        </div>
                    </div>

                    <button className='registerBtn' type='submit' disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>

                </form>
            </div>
        </section>
    );
}
