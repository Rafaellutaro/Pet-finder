import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"
import { useEffect, useState } from "react";
import { SwiperSlide } from 'swiper/react';

const getAllPetsById = () => {
    const { user } = useUser();
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchPets = async () => {
            const response = await fetch('http://localhost:3000/pets/getAllPetsById', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ id: user.id })
            });

            const data = await response.json();

            setPets(data.data);
            setLoading(false);
        };

        fetchPets();
    }, [user]);

    return { pets, loading }


}

const getAllPets = () => {
    const { user } = useUser();
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchPets = async () => {
            const response = await fetch('http://localhost:3000/pets/getAllPetsById', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ id: user.id })
            });

            const data = await response.json();

            setPets(data.data);
            setLoading(false);
        };

        fetchPets();
    }, [user]);

    return { pets, loading }


}

export function getAllPetsPublic(region: string, setPetData: React.Dispatch<React.SetStateAction<any[]>>) {
    const FetchPetData = async () => {
        const petApi = await fetch("http://localhost:3000/pets/getAllPets", {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })

        const data = await petApi.json()

        if (data) {
            const actualPetData = data.data.filter((i: { address: { state: {} }; }) => i.address?.state == region)
            setPetData(actualPetData)
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
