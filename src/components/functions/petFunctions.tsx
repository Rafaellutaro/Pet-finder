import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"
import { useEffect, useState } from "react";

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

            console.log('all pet data', data)
            setPets(data.data);
            setLoading(false);
        };

        fetchPets();
    }, [user]);

    return {pets, loading}


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

            console.log('all pet data', data)
            setPets(data.data);
            setLoading(false);
        };

        fetchPets();
    }, [user]);

    return {pets, loading}


}

export function petContainerCloseToYou() {
    const {pets, loading} = getAllPets();

    console.log('all pets data', pets)
    
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

export default function petContainer() {
    const {pets, loading} = getAllPetsById();

    console.log('all pets data', pets)
    
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

export function PetAddContainer () {
    const nav = useNavigate()

    return (
        <div className="pet-container add-pet" onClick={() => nav("/addPet")}>
            <FaPlus />
        </div>
    )
}
