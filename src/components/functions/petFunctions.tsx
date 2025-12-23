import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"
import { useEffect, useState } from "react";
import { SwiperSlide } from 'swiper/react';
import apiFetch from "../../Interfaces/TokenAuthorization";

const getAllPetsById = () => {
    const {token} = useUser();
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchPets = async () => {
            const response = await apiFetch('http://localhost:3000/pets/getAllPetsById', {
                method: "GET"
            }, token);

            const data = await response.json();

            setPets(data.data);
            setLoading(false);
        };

        fetchPets();
    }, []);

    return { pets, loading }
}

export function getAllPetsPublic(region: string, setPetData: React.Dispatch<React.SetStateAction<any[]>>) {
    const FetchPetData = async () => {
        const petApi = await fetch(`http://localhost:3000/pets/getAllPets?uf=${region}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })

        const data = await petApi.json()

        console.log("main", data)

        if (data) {
            // const actualPetData = data.data.filter((i: { address: { state: {} }; }) => i.address?.state == region)
            setPetData(data.data)
        }
    }

    FetchPetData()


}

export function petContainerCloseToYou(pets: any[]) {
    return (
        <>
            {pets.map((item: any) => (
                <SwiperSlide key={item.id}>
                    <img src={item.imgs[0]?.url} alt={item.name} />
                </SwiperSlide>
            ))}
        </>
    );
}

export default function petContainer() {
    const { pets, loading } = getAllPetsById();

    if (loading) return <div></div>

    return (
        <>
            {pets.map((item: any) => (
                <div key={item.id} className="pet-container">
                    {/* Display first image in imgs array */}
                    <img src={item.imgs[0]?.url} alt={item.name} />

                    <div className="pet-name">
                        {item.name}
                    </div>
                    <div className="pet-details">
                        <p>{item.details}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export function PetAddContainer() {
    const nav = useNavigate()

    return (
        <div className="pet-container add-pet" onClick={() => nav("/addPet")}>
            <FaPlus />
        </div>
    )
}
