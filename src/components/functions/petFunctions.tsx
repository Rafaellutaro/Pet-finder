import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Interfaces/GlobalUser"
import { useEffect, useState } from "react";
import apiFetch from "../../Interfaces/TokenAuthorization";

const getAllPetsById = () => {
    const {token, verifyToken} = useUser();
    const [pets, setPets] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchPets = async () => {
            const verifiedToken = await verifyToken();

            const response = await apiFetch('http://localhost:3000/pets/getAllPetsById', {
                method: "GET"
            }, String(verifiedToken));

            const data = await response.json();

            setPets(data);
            setLoading(false);
        };

        fetchPets();
    }, []);

    return { pets, loading }
}

export function getAllPetsPublic(region: string , type: string, breed: string, age: string, pageLimit: string, order: string, page: number, setPetData: React.Dispatch<React.SetStateAction<any[]>>) {
    const FetchPetData = async () => {
        const petApi = await fetch(`http://localhost:3000/pets/getAllPets?uf=${region}&type=${type}&breed=${breed}&age=${age}&limit=${pageLimit}&orderDirection=${order}&page=${page}`, {
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

export default function petContainer() {
    const { pets } = getAllPetsById();

    if (!pets?.data) return <div>Loading Data</div>

    return (
        <>
            {pets.data.map((item: any) => (
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

export  function PetContainerPublicApi({ petData }: { petData: any }) {
    if (!petData?.data) return <div>loading Data</div>

    return (
        <>
            {petData.data.map((item: any) => (
                <div key={item.id} className="pet-container-public">
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
  if (!petData?.data) return <div>Loading data...</div>;

  return (
    <>
      {petData.data.map((item: any) => (
        <article
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
        </article>
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
