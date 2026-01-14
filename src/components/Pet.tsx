import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PetData } from "../Interfaces/usefulPetInterface";
import type { UserData } from "../Interfaces/GlobalUser";
import FancyHeader from "./reusable/fancyProfileHeader";

const getOwner = async (id: string) => {
    try {
        const res = await fetch(`http://localhost:3000/users/getIdPublic?userId=${id}`, {
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
        const res = await fetch(`http://localhost:3000/pets/getUniquePet?petId=${id}`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        });
        const result = await res.json();
        return result.data;
    } catch (e) {
        console.log(e)
    }
}

function Pet () {
    const {id} = useParams();
    const [singlePetData, setSinglePetData] = useState<PetData | null>(null);
    const [petOwner, setPetOwner] = useState<UserData | null>(null);
    
    useEffect(() => {
        const setData = async ()=> {
            setSinglePetData(await getUniquePet(String(id)))
        }
        setData();
    }, [id])

    const userId = singlePetData?.userId;

    useEffect(() => {
        const setData = async ()=> {
            if (userId){
                setPetOwner(await getOwner(String(userId)))
            }
        }
        setData();
    }, [userId])

    console.log("all data", singlePetData, petOwner)

    return (
        <div>
            {petOwner && <FancyHeader user={petOwner}/>}
        </div>
    )
}

export default Pet;