import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const addPetForm = () => {
    //add pet function here


}

export default function petContainer() {
    return (
        <div className="pet-container">
            <img src="" alt="" />

            <div className="pet-name">
                bob
            </div>
            <div className="pet-details">
                <p>this pet is awesome</p>
            </div>
        </div>
    )
}

export function PetAddContainer () {
    const nav = useNavigate()

    return (
        <div className="pet-container add-pet" onClick={() => nav("/addPet")}>
            <FaPlus />
        </div>
    )
}
