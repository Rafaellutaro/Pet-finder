import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import supabase from "../../../backEnd/client/SupabaseClient";
import { useUser } from "../../Interfaces/GlobalUser";
import { useNavigate } from "react-router-dom";
import { cepSearch } from "../functions/userFunctions";

export default function RegisterPet() {
    //meu deus se eu soubesse o quanto mais de boa é usar o react-hook-form em vez de usar o reducer e criar o proprio form antes velho, que porcaria.
    // tive que alterar todos os forms, mas pelo menos agora eu consigo emplementar a validação de dados com o zod que parece muito melhor do que eu fazer sozinho.
    // por que eu não pesquisei antes meu deus, aff.
    //=================================================================================
    //VIDEO THAT I USED TO UNDERSTAND THIS: https://www.youtube.com/watch?v=cc_xmawJ8Kg
    //=================================================================================

    const { user } = useUser();
    const nav = useNavigate();

    const userAddresses = user?.addresses || [];

    const allAddress = user?.addresses || [];
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(allAddress[0]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: "",
            breed: "",
            type: "",
            age: "",
            details: "",
            image: null,

            cep: "",
            street: "",
            neighborhood: "",
            city: "",
            region: "",
        }
    });

    // Watch CEP for auto-fill
    const cep = watch("cep");
    useEffect(() => {
        if (cep) {
            cepSearch(setValue, cep);
        }
    }, [cep]);

    // Enable/Disable new address form
    useEffect(() => {
        if (selectedAddress == "new") {
            setIsAddingNewAddress(true);
        } else {
            setIsAddingNewAddress(false);
        }

        console.log(selectedAddress)
    }, [selectedAddress]);

    useEffect(() => {
        setSelectedAddress(allAddress[0])
        console.log(selectedAddress)
    }, [user]);

    if (!user) return <div>Loading Data</div>

    // FORM SUBMIT
    const onSubmit = async (data: any) => {
        try {
            // Upload image to Supabase
            const file = data.image[0];
            const fileName = `${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("pets")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("pets")
                .getPublicUrl(fileName);

            const imageUrl = urlData.publicUrl;

            // Build address payload
            let addressToUse = null;

            if (isAddingNewAddress) {
                addressToUse = {
                    cep: data.cep,
                    street: data.street,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.region,
                };
            } else {
                addressToUse = selectedAddress;
            }

            // Final payload
            const payload = {
                userId: user!.id,
                imageUrl,
                petData: {
                    name: data.name,
                    breed: data.breed,
                    type: data.type,
                    age: data.age,
                    details: data.details,
                },
                address: addressToUse
            };

            console.log("Final payload:", payload);

            //Send to API
            const res = await fetch("http://localhost:3000/pets/insert", {
                method: "POST",
                headers: { 
                    "content-type": "application/json" },
                body: JSON.stringify(payload)
            });

            const apiResult = await res.json();
            console.log("API result:", apiResult);

            nav("/Profile");
        } catch (e) {
            console.log("Error submitting pet:", e);
        }
    };

    return (
        <section className="registerCommon-section">
            <div className="common-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    <h1>Dados do Pet</h1>

                    {/* PET FIELDS */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nome:</label>
                            <input {...register("name", { required: true })} placeholder="Nome" />
                            {errors.name && <p className="error">Campo obrigatório</p>}
                        </div>

                        <div className="form-group">
                            <label>Tipo:</label>
                            <input {...register("type", { required: true })} placeholder="Cachorro, Gato..." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Raça:</label>
                            <input {...register("breed", { required: true })} placeholder="Raça" />
                        </div>

                        <div className="form-group">
                            <label>Idade:</label>
                            <input {...register("age", { required: true })} placeholder="Idade" />
                        </div>
                    </div>
                    {/* 
                        adulteros é de fuder kskskskksksksksksk, vou manter, gostei.
                    */}
                    <div className="form-row">
                        <div className="form-group full">
                            <label>Detalhes:</label>  
                            <textarea {...register("details", {required: true})} rows={6} placeholder="comportamento, se é amigavel com crianças, audulteros etc...." />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Imagem:</label>
                            <input type="file" accept="image/*" {...register("image", { required: true })} />
                        </div>
                    </div>

                    {/* ADDRESS SELECT */}
                    <h2>Endereço do Pet</h2>

                    <div className="form-row">
                        <div className="form-group full">
                            <label>Usar endereço existente:</label>

                            <select
                                defaultValue={JSON.stringify(allAddress[0])}
                                onChange={(e) => {
                                    if (e.target.value == "new"){
                                        setSelectedAddress(e.target.value)
                                    }else{
                                        setSelectedAddress(JSON.parse(e.target.value))
                                    }
                                }}
                            >
                                {userAddresses.map((addr: any, i: number) => (
                                    <option key={i} value={JSON.stringify(addr)}>
                                        {`${addr.street}, ${addr.city} - ${addr.state}`}
                                    </option>
                                ))}

                                <option value="new">+ Cadastrar novo endereço</option>
                            </select>
                        </div>
                    </div>

                    {/* NEW ADDRESS FIELDS */}
                    {isAddingNewAddress && (
                        <div className="new-address-form">
                            <h3>Novo Endereço</h3>

                            <input
                                maxLength={8}
                                placeholder="CEP"
                                {...register("cep")}
                            />

                            <input placeholder="Rua" readOnly {...register("street")} />
                            <input placeholder="Bairro" readOnly {...register("neighborhood")} />
                            <input placeholder="Cidade" readOnly {...register("city")} />
                            <input placeholder="Estado" readOnly {...register("region")} />
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            </div>
        </section>
    );
}
