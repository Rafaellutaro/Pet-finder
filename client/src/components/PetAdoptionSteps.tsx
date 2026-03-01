import { useParams } from "react-router-dom";
import "../assets/css/PetAdoptionSteps.css"
import { PetAdoptionStep1, PetAdoptionStep2, PetAdoptionStep3, PetAdoptionStep4 } from "./reusable/PetAdoptionAllSteps";
import { useEffect, useMemo, useState } from "react";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import type { adoptionAddress, adoptionInterface, allProposesInterface } from "../Interfaces/adoptionInterface";
import Loader from "./reusable/Loader";
import { petAdoption2Saved, PetAdoptionStep2Schema, type PetAdoption2 } from "../Interfaces/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function PetAdoptionSteps() {
  const { id } = useParams()
  const { token, verifyToken, user, socket } = useUser()
  const [addressMode, setAddressMode] = useState<"SAVED" | "CUSTOM">("SAVED");
  const [address, setAddress] = useState<adoptionAddress | null>(null)
  const [allData, setAllData] = useState<adoptionInterface | null>(null)
  const [allProposes, setAllProposes] = useState<allProposesInterface[]>([])
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const stepOrder = ["CONFIRMATION", "MEETING", "MEETING_CONFIRMED", "FINALIZE"];

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
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${id}/initial`,
      options: { method: "POST", body: JSON.stringify(payload) },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response) return

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
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/getInfoFromId/${id}`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response) return
    
    setAllData(response)
  }

  useEffect(() => {
    if (!id || !token) return

    getRelatedIds()
  }, [id])

  if (!allData) return <Loader />

  const currentIndex = stepOrder.indexOf(allData?.getInfo?.step);

  return (
    <div className="pet-adoption-page">
      <header className="pet-adoption-header">
        <h1 className="pet-adoption-title">Processo de Adoção</h1>
        <p className="pet-adoption-subtitle">
          Complete todas as etapas para concluir a adoção
        </p>

        <div className="pet-adoption-stepper" aria-label="Adoption steps">
          <div className={`pet-adoption-step ${currentIndex > 0 ? "pet-adoption-step--done" : ""} ${currentIndex == 0 ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">1</div>
            <div className="pet-adoption-step-label">Confirmação</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${currentIndex > 1 ? "pet-adoption-step--done" : ""} ${currentIndex == 1 ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">2</div>
            <div className="pet-adoption-step-label">Encontro</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${currentIndex > 2 ? "pet-adoption-step--done" : ""} ${currentIndex == 2 ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">3</div>
            <div className="pet-adoption-step-label">Confirmar Encontro</div>
          </div>

          <div className="pet-adoption-step-line" aria-hidden="true" />

          <div className={`pet-adoption-step ${currentIndex > 3 ? "pet-adoption-step--done" : ""} ${currentIndex == 3 ? "pet-adoption-step--active" : ""}`}>
            <div className="pet-adoption-step-circle">4</div>
            <div className="pet-adoption-step-label">Finalizar</div>
          </div>
        </div>
      </header>

      {allData.getInfo.step == "CONFIRMATION" && (
        <PetAdoptionStep1
          allData={allData}
          setAllData={setAllData}
          user={user}
          token={token}
          verifyToken={verifyToken}
          id={id}
          socket={socket}
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
          setAddress={setAddress}
          socket={socket}
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
          setAddress={setAddress}
          address={address}
          socket={socket}
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
            setAddress={setAddress}
            socket={socket}
          />}
        />
      )}

      {allData.getInfo.step == "FINALIZE" && (
        <PetAdoptionStep4 allData={allData}/>
      )}
    </div>
  );
}

export default PetAdoptionSteps