import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../Interfaces/GlobalUser";
import { cepSearch } from "../functions/userFunctions";
import type { FormFields, FormFieldsEdited } from "../../Interfaces/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetSchemaPart1, PetSchemaPart1Edited, PetSchemaPart2, PetSchemaPart3 } from "../../Interfaces/zodSchema";
import PetData from "./PetData";
import PetPersonality from "./PetPersonality";
import PetFavorite from "./PetFavorite";
import apiFetch from "../../Interfaces/TokenAuthorization";
import SupabaseUpload from "../reusable/SupabaseUpload";
import { emptyToNullObject } from "../functions/userFunctions";

type RegisterPetProp = {
    onClose: () => void;
    setFormPart: React.Dispatch<React.SetStateAction<number>>;
    formPart: number;
}

export default function RegisterPet({onClose, formPart, setFormPart}: RegisterPetProp) {
    //meu deus se eu soubesse o quanto mais de boa é usar o react-hook-form em vez de usar o reducer e criar o proprio form antes velho, que porcaria.
    // tive que alterar todos os forms, mas pelo menos agora eu consigo emplementar a validação de dados com o zod que parece muito melhor do que eu fazer sozinho.
    // por que eu não pesquisei antes meu deus, aff.
    //=================================================================================
    //VIDEO THAT I USED TO UNDERSTAND THIS: https://www.youtube.com/watch?v=cc_xmawJ8Kg
    //=================================================================================

    const { user, verifyToken, token } = useUser();

    const allAddress = user?.addresses || [];

    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(allAddress[0]);

    // tip:
    // If you need to calculate something → useMemo
    // If you need to do something → useEffect
    const resolver = useMemo(() => {
        if (formPart == 1 && allAddress.length <= 0) return zodResolver(PetSchemaPart1Edited);
        if (formPart == 1 ) return zodResolver(PetSchemaPart1);
        if (formPart == 2) return zodResolver(PetSchemaPart2);
        return zodResolver(PetSchemaPart3);
    }, [formPart, allAddress.length]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormFields | FormFieldsEdited>({
        resolver: resolver as any,
        shouldUnregister: false
    });

    // Watch CEP for auto-fill
    const cep = watch("cep");
    useEffect(() => {
        cepSearch(setValue, String(cep));
        console.log(watch())
    }, [cep]);


    if (!user) return <div>Loading Data</div>

    // FORM CONTINUE
    const onContinue = () => {
        setFormPart(i => i + 1);
    };

    // FORM SUBMIT
    const onSubmit = async (data: any) => {
        const formattedData = emptyToNullObject(data)

        try {
            // Upload image to Supabase
            const file = formattedData.image[0];
            const fileName = `${Date.now()}_${file.name}`;

            const imageUrl = await SupabaseUpload({fileName: fileName, file: file, bucketName: "pets"});

            // Build address payload
            let addressToUse = null;

            if (isAddingNewAddress) {
                addressToUse = {
                    cep: formattedData.cep,
                    street: formattedData.street,
                    neighborhood: formattedData.neighborhood,
                    city: formattedData.city,
                    state: formattedData.region,
                };
            } else {
                addressToUse = selectedAddress;
            }

            if (!addressToUse.cep || !addressToUse.street || !addressToUse.neighborhood || !addressToUse.city || !addressToUse.state){
                addressToUse = allAddress[0]
            }

            // Final payload
            const payload = {
                userId: user!.id,
                imageUrl,
                petData: {
                    //pet full data
                    name: formattedData.name,
                    breed: formattedData.breed,
                    type: formattedData.type,
                    age: formattedData.age,
                    details: formattedData.details,
                    gender: formattedData.gender,
                    wayOfLife: formattedData.wayOfLife,
                    // personality
                    energetic: formattedData.energetic,
                    friendly: formattedData.friendly,
                    loyal: formattedData.loyal,
                    playful: formattedData.playful,
                    smart: formattedData.smart,
                    // favorite
                    food: formattedData.food,
                    playPlace: formattedData.playPlace,
                    sleepPlace: formattedData.sleepPlace,
                    toy: formattedData.toy,
                },
                address: addressToUse
            };

            const res = await apiFetch("http://localhost:3000/pets/insert", {
                method: "POST",
                body: JSON.stringify(payload)
            }, String(token))

            if (res.ok){
                const apiResult = await res.json();
                console.log("API result:", apiResult);
            }

            if (res.status == 401 || res.status == 403){
                const newToken = await verifyToken();

                const res = await apiFetch("http://localhost:3000/pets/insert", {
                method: "POST",
                body: JSON.stringify(payload)
                }, String(newToken))

                if (res.ok){
                const apiResult = await res.json();
                console.log("API result verified:", apiResult);
            }
            }

            onClose();
        } catch (e) {
            console.log("Error submitting pet:", e);
        }
    };


    /**
     * MULTI-STEP FORM PATTERN
     * - Single useForm instance
     * - shouldUnregister: false (i learned this is very important, otherwise the last data will be only the last input)
     * - Step-based Zod resolvers (.loose()) this loose function prevents zod from deleting unkown data, the previous data basically, i learned the hard way
     * - Final submit gets ALL data
     *
     * If submit only shows last step:
     * → Zod is stripping fields
     */
    return (
        <>
            {formPart == 1 && (
                <PetData
                    register={register}
                    errors={errors}
                    watch={watch}
                    handleSubmit={handleSubmit}
                    onContinue={onContinue}
                    control={control}
                    isSubmitting={isSubmitting}
                    allAddress={allAddress}
                    setSelectedAddress={setSelectedAddress}
                    setIsAddingNewAddress={setIsAddingNewAddress}
                    selectedAddress={selectedAddress}
                    isAddingNewAddress={isAddingNewAddress}
                />
            )}
            {formPart == 2 && (
                <PetPersonality
                    register={register}
                    watch={watch}
                    handleSubmit={handleSubmit}
                    onContinue={onContinue}
                    isSubmitting={isSubmitting}
                />
            )}
            {formPart == 3 && (
                <PetFavorite
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting} />
            )}
        </>
    );
}
