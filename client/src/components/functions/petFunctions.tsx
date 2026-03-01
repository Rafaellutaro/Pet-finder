import { FaPlus } from "react-icons/fa6";
import { useNavigateWithFrom } from "../reusable/Redirect";
import { useUser } from "../../Interfaces/GlobalUser"
import { useEffect, useState } from "react";
import type { PetData } from "../../Interfaces/usefulPetInterface";
import resendApiPrivate from "../reusable/resendApi";
import Loader from "../reusable/Loader";

const getAllPetsById = () => {
    const { token, verifyToken } = useUser();
    const [pets, setPets] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchPets = async () => {
        const response = await resendApiPrivate({
            apiUrl: `${import.meta.env.VITE_SERVER_URL}/pets/getAllPetsById`,
            options: { method: "GET" },
            token: String(token),
            verifyToken: verifyToken
        })

        setPets(response);
        setLoading(false);
    };

    useEffect(() => {
        if (!token) return;

        fetchPets();
    }, []);

    return { pets, loading, refetch: fetchPets }
}

export function getAllPetsPublic(region: string, type: string, breed: string, age: string, pageLimit: string, order: string, page: number, setPetData: React.Dispatch<React.SetStateAction<any[]>>) {
    const FetchPetData = async () => {
        const petApi = await fetch(`${import.meta.env.VITE_SERVER_URL}/pets/getAllPets?uf=${region}&type=${type}&breed=${breed}&age=${age}&limit=${pageLimit}&orderDirection=${order}&page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        })

        const data = await petApi.json()

        console.log("main", data)

        if (data) {
            // const actualPetData = data.data.filter((i: { address: { state: {} }; }) => i.address?.state == region)
            setPetData(data)
        }
    }

    FetchPetData()


}
// This function was causing too many bugs skkskskskkskskskskskksks

// export function PetContainerCloseToYou({ pets }: { pets: any }) {
//     if (!pets || !pets.data) return <div>loading data</div>

//     return (
//         <>
//             {pets.data.map((item: any) => (
//                 <SwiperSlide key={item.id}>
//                     <img src={item.imgs[0]?.url} alt={item.name} />
//                 </SwiperSlide>
//             ))}
//         </>
//     );
// }

type petContainerProp = {
    index: number
}

export default function petContainer({ index }: petContainerProp) {
    const { pets, loading, refetch } = getAllPetsById();
    const singlePet = useNavigateWithFrom();

    // refetch when refreshKey changes
    useEffect(() => {
        if (index) {
            refetch();
        }
    }, [index]);

    if (loading) return <Loader/>;
    if (!pets) return null;

    return (
        <>
            {pets.map((item: any) => (
                <div
                    key={item.id}
                    className="pet-container"
                    onClick={() => singlePet(`/Pets/${item.id}`)}
                >
                    <img src={item.imgs?.[0]?.url} alt={item.name} />

                    <div className="pet-name">{item.name}</div>

                    <div className="pet-details">
                        <p>{item.details}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export function PetContainerPublicApi({ petData }: { petData: any }) {
    if (!petData?.data) return <Loader/>

    const singlePet = useNavigateWithFrom();

    return (
        <>
            {petData.data.map((item: any) => (
                <div key={item.id} className="pet-container-public" onClick={() => {
                    singlePet(`/Pets/${item.id}`);
                }}>
                    {/* Display first image in imgs array */}
                    <img src={item.imgs[0]?.url} alt={item.name} />

                    <div className="pet-name-public">
                        {item.name}
                    </div>
                    <div className="pet-details-public">
                        <p>{item.details}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export function PetContainerPublicApiLaying({ petData }: { petData: any }) {
    if (!petData?.data) return <Loader/>;

    return (
        <>
            {petData.data.map((item: any) => (
                <div
                    key={item.id}
                    className="pet-card pet-card--horizontal"
                    style={{ "--bg-img": `url(${item.imgs[0]?.url})` } as React.CSSProperties}
                >
                    <div className="pet-card__image">
                        <img src={item.imgs[0]?.url} alt={item.name} />
                    </div>
                    <div className="pet-card__content">
                        <h3 className="pet-card__name">{item.name}</h3>
                        <p className="pet-card__details">{item.details}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

type addPet = {
    setAddPetView: React.Dispatch<React.SetStateAction<boolean>>
}

export function PetAddContainer({ setAddPetView }: addPet) {
    // const addPet = useRedirect("/addPet");

    return (
        <div className="pet-container add-pet" onClick={() => setAddPetView(true)}>
            <FaPlus />
        </div>
    )
}

type waitingText = {
    petData: PetData | null
}

export function getWaitingText({ petData }: waitingText) {
    const published = new Date(petData?.publishedAt ?? new Date);
    const now = new Date();

    const difference = now.getTime() - published.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days == 0) return "Hoje";
    if (days == 1) return "1 dia";
    if (days < 7) return `${days} dias`;

    const weeks = Math.floor(days / 7);
    if (weeks == 1) return "1 semana";
    if (weeks < 5) return `${weeks} semanas`;

    const months = Math.floor(days / 30);
    if (months == 1) return "1 mês";
    return `${months} meses`;
}
