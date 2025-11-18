import { FaPlus } from "react-icons/fa6";

const addPet = () => {
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
    return (
        <div className="pet-container add-pet" onClick={addPet}>
            <FaPlus />
        </div>
    )
}
