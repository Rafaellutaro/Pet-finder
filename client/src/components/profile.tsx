// import { useLocation } from 'react-router-dom';
import PetContainer, { PetAddContainer } from "./functions/petFunctions"
import { useUser } from "../Interfaces/GlobalUser"
import FancyHeader from "./reusable/fancyProfileHeader";
import "../assets/css/addPetProfile.css"
import { useState } from "react";
import RegisterPet from "./forms/Register-Pet";
import Loader from "./reusable/Loader";

function ProfilePage() {
  const { user } = useUser();
  const [addPetView, setAddPetView] = useState(false)
  const [formPart, setFormPart] = useState(1);
  const [index, setIndex] = useState(0)

  if (!user) {
    return <Loader/>
  }

  return (
    <div className="ProfilePage-mainContainer">

      <FancyHeader user={user} />

      {/* PETS */}
      <div className="details">
        <div className="pet-grid">
          <PetAddContainer setAddPetView={setAddPetView} />
          <PetContainer index={index} />
        </div>
      </div>

      {addPetView && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-content"
          >
            <h1>Registrar seu Pet · Passo {formPart} de 3</h1>
            <button
              className="modal-close"
              onClick={() => {setAddPetView(false); setFormPart(1); }}
              aria-label="Close"
              type="button"
            >
              ✕
            </button>

            <RegisterPet onClose={() => { setAddPetView(false); setIndex((e) => e + 1); setFormPart(1)}} formPart={formPart} setFormPart={setFormPart} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage;
