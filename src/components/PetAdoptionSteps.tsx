import { useParams } from "react-router-dom";
import "../assets/css/PetAdoptionSteps.css"
import { PetAdoptionStep1, PetAdoptionStep2 } from "./reusable/PetAdoptionAllSteps";
import { useEffect, useState } from "react";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import type { adoptionInterface } from "../Interfaces/adoptionInterface";
import Loader from "./reusable/Loader";

function PetAdoptionSteps() {
    const {id} = useParams()
    const {token, verifyToken, user} = useUser()
    const [allData, setAllData] = useState<adoptionInterface | null>(null)

    const getRelatedIds = async () => {
        const response = await resendApiPrivate({apiUrl: `http://localhost:3000/adoption/getInfoFromId/${id}`, 
            options: {method: "GET"}, 
            token: String(token), 
            verifyToken: verifyToken})
        
        if (!response) return

        console.log(response)
        setAllData(response)
    }

    useEffect(() => {
        if (!id || !token) return

        getRelatedIds()
    }, [id])

    if (!allData) return <Loader/>


    return (
    <div className="pet-adoption-page">
      <header className="pet-adoption-header">
        <h1 className="pet-adoption-title">Processo de Adoção</h1>
        <p className="pet-adoption-subtitle">
          Complete todas as etapas para concluir a adoção
        </p>

        <div className="pet-adoption-stepper" aria-label="Adoption steps">
          <div className={`pet-adoption-step ${allData.getInfo.step == "CONFIRMATION" ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">1</div>
            <div className="pet-adoption-step-label">Confirmação</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${allData.getInfo.step == "MEETING" ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">2</div>
            <div className="pet-adoption-step-label">Encontro</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${allData.getInfo.step == "MEETING_CONFIRMED" ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">3</div>
            <div className="pet-adoption-step-label">Confirmar Encontro</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${allData.getInfo.step == "FINALIZE" ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">4</div>
            <div className="pet-adoption-step-label">Finalizar</div>
          </div>
        </div>
      </header>

      {allData.getInfo.step == "CONFIRMATION" && (
        <PetAdoptionStep1 
        allData={allData} 
        user={user}
        token={token}
        verifyToken={verifyToken}
        id={id}
        />
      )}

      {allData.getInfo.step == "MEETING" && (
        <PetAdoptionStep2 />
      )}
    </div>
  );
}

export default PetAdoptionSteps