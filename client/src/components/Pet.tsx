import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PetData } from "../Interfaces/usefulPetInterface";
import type { UserData } from "../Interfaces/userInterface";
import PetProfile from "./reusable/PetProfile";
import useRedirect from "./reusable/Redirect";

const getOwner = async (id: string) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/getIdPublic?userId=${id}`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        })
        const result = await res.json()
        return result.data
    } catch (e) {
        console.log(e)
    }
}

const getUniquePet = async (id: string) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/pets/getUniquePet?petId=${id}`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        });
        const result = await res.json();
        return result.data;
    } catch (e) {
        console.log(e)
    }
}

const getTraits = async (id: string) => {
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/pets/getPetTraits?petIdQuery=${id}`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        });
        const result = await res.json();
        return result.data;
    } catch (e) {
        console.log(e)
    }
}

function Pet() {
    const { id } = useParams();
    const [singlePetData, setSinglePetData] = useState<PetData | null>(null);
    const [petOwner, setPetOwner] = useState<UserData | null>(null);
    const [petTraits, setPetTraits] = useState<any[]>([]);
    const backRedirect = useRedirect("/Pets")
    

    useEffect(() => {
        if (!id) return

        const setData = async () => {
            setSinglePetData(await getUniquePet(String(id)))
        }
        setData();
    }, [id])

    const userId = singlePetData?.userId;
    const petId = singlePetData?.id;
    const petStatus = singlePetData?.petStatus

    useEffect(() => {
        if (!petStatus) return

        if (petStatus != "AVAILABLE"){
            backRedirect()
        }

        const setData = async () => {
            if (userId && petId) {
                setPetOwner(await getOwner(String(userId)))
                setPetTraits(await getTraits(String(petId)))
            }
        }
        setData();
    }, [userId])

    const allData = {
        pet: singlePetData,
        owner: petOwner,
        traits: petTraits
    }

    return (
        <>
            {singlePetData && <PetProfile data={allData}/>}
        </>
    )
}

export default Pet;