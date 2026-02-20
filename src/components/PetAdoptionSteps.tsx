import { useParams } from "react-router-dom";
import "../assets/css/PetAdoptionSteps.css"
import { PetAdoptionStep1, PetAdoptionStep2, PetAdoptionStep3 } from "./reusable/PetAdoptionAllSteps";
import { useEffect, useMemo, useState } from "react";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import type { adoptionInterface, allProposesInterface } from "../Interfaces/adoptionInterface";
import Loader from "./reusable/Loader";
import { petAdoption2Saved, PetAdoptionStep2Schema, type PetAdoption2 } from "../Interfaces/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function PetAdoptionSteps() {
  const { id } = useParams()
  const { token, verifyToken, user } = useUser()
  const [addressMode, setAddressMode] = useState<"SAVED" | "CUSTOM">("SAVED");
  const [allData, setAllData] = useState<adoptionInterface | null>(null)
  const [allProposes, setAllProposes] = useState<allProposesInterface[]>([])
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const resolver = useMemo(() => {
    if (addressMode == "SAVED") return zodResolver(petAdoption2Saved);
    return zodResolver(PetAdoptionStep2Schema);
  }, [addressMode]);

  const onSubmit = async (data: PetAdoption2) => {
    let address = null

    if (!data.addressId) {
      address = {
        cep: data.cep,
        street: data.street,
        state: data.region,
        city: data.city,
        neighborhood: data.neighborhood
      }
    } else {
      address = data.addressId
    }

    const payload = {
      address: address,
      meetDate: data.meetDate,
      meetTime: data.meetTime
    }

    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_API_URL}/adoption/propose/${id}/initial`,
      options: { method: "POST", body: JSON.stringify(payload) },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response) return

    console.log(response)

    setAllProposes((prev: any) => ([
      ...prev,
      response
    ]))
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PetAdoption2>({
    resolver: resolver as any,
  });

  const getRelatedIds = async () => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_API_URL}/adoption/getInfoFromId/${id}`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response) return

    console.log(response)
    setAllData(response)
  }

  useEffect(() => {
    if (!id || !token) return

    getRelatedIds()
  }, [id])

  if (!allData) return <Loader />


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
        <PetAdoptionStep2
          allData={allData}
          setAllData={setAllData}
          user={user}
          token={token}
          verifyToken={verifyToken}
          id={id}
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          setValue={setValue}
          isSubmiting={isSubmitting}
          control={control}
          setAddressMode={setAddressMode}
          addressMode={addressMode}
          onSubmit={onSubmit}
          errors={errors}
          allProposes={allProposes}
          setAllProposes={setAllProposes}
          setIsRescheduleOpen={setIsRescheduleOpen}
        />
      )}

      {allData.getInfo.step == "MEETING_CONFIRMED" && (
        <PetAdoptionStep3
          allData={allData}
          setAllData={setAllData}
          user={user}
          token={token}
          verifyToken={verifyToken}
          id={id}
          isRescheduleOpen={isRescheduleOpen}
          setIsRescheduleOpen={setIsRescheduleOpen}
          rescheduleComponent={<PetAdoptionStep2
            allData={allData}
            setAllData={setAllData}
            user={user}
            token={token}
            verifyToken={verifyToken}
            id={id}
            register={register}
            handleSubmit={handleSubmit}
            watch={watch}
            setValue={setValue}
            isSubmiting={isSubmitting}
            control={control}
            setAddressMode={setAddressMode}
            addressMode={addressMode}
            onSubmit={onSubmit}
            errors={errors}
            allProposes={allProposes}
            setAllProposes={setAllProposes}
            setIsRescheduleOpen={setIsRescheduleOpen}
          />}
        />
      )}
    </div>
  );
}

export default PetAdoptionSteps