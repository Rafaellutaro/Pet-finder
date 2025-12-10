import { useEffect } from "react";
import { useForm } from "react-hook-form";
import '../../assets/css/RegisterCommon.css';
import { cepSearch } from "../functions/userFunctions";

interface RegisterFormData {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;

    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    region: string;
}

export default function RegisterCommon() {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            cep: "",
            street: "",
            neighborhood: "",
            city: "",
            region: ""
        }
    });

    // Watch CEP for auto-fill
    const cep = watch("cep");
    useEffect(() => {
        if (cep) {
            cepSearch(setValue, cep); 
        }
    }, [cep]);

    const onSubmit = async (data: RegisterFormData) => {
        const userData = {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password
        };

        const addressData = {
            cep: data.cep,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            region: data.region
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

                            <div className="form-group">
                                <label>Telefone:</label>
                                <input {...register("phone", { required: "Telefone é obrigatório" })} placeholder="Telefone" />
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

                    <h1>Endereço</h1>

                    <div className="location-data-container">
                        <div className="form-row">
                            <div className="form-group">
                                <label>CEP:</label>
                                <input {...register("cep", { required: "CEP é obrigatório", maxLength: { value: 8, message: "CEP deve ter 8 dígitos" } })} placeholder="CEP" />
                                {errors.cep && <p className="error">{errors.cep.message}</p>}
                            </div>
                            <div className="form-group">
                                <label>Rua:</label>
                                <input {...register("street")} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bairro:</label>
                                <input {...register("neighborhood")} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Cidade:</label>
                                <input {...register("city")} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado:</label>
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
