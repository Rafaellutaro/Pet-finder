import type { adoptionAddress, adoptionInterface, allProposesInterface, confirmations } from "../../Interfaces/adoptionInterface"
import { FaHeart } from "react-icons/fa";
import type { UserData } from "../../Interfaces/userInterface";
import { useEffect, useState, type ReactNode } from "react";
import resendApiPrivate from "./resendApi";
import "../../assets/css/petAdoptionStep2.css"
import "../../assets/css/PetAdoptionStep3.css"
import "../../assets/css/petAdoptionStep4.css"
import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { PetAdoption2 } from "../../Interfaces/zodSchema";
import { cepSearch } from "../functions/userFunctions";
import { PatternFormat } from "react-number-format";
import { IoLocationOutline } from "react-icons/io5";
import { FaStreetView } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { FaRedo } from "react-icons/fa";
import { FcOk } from "react-icons/fc";
import type { Socket } from "socket.io-client";

type petAdoptionStep1Type = {
  allData: adoptionInterface | null
  setAllData: React.Dispatch<React.SetStateAction<adoptionInterface | null>>
  user: UserData | null
  token: string | null,
  verifyToken: () => Promise<void>
  id: string | undefined
  socket: Socket | null
}

type headerType = {
  step: string,
  title: string,
  sectionTitle: string,
  desc: string
}

function PetAdoptionHeader({ step, title, sectionTitle, desc }: headerType) {
  return (
    <div className="pet-adoption-card-top">
      <div className="pet-adoption-pill">
        <span className="pet-adoption-pill-icon" aria-hidden="true">
          <FaHeart />
        </span>
        Etapa {step}: {title}
      </div>

      <h2 className="pet-adoption-section-title">{sectionTitle}</h2>
      <p className="pet-adoption-section-desc">
        {desc}
      </p>
    </div>
  )
}

function AlreadyConfirmed() {
  return (
    <div className="petAdoption3-confirmationDone"> <FcOk /> Você já confirmou. Aguardando a confirmação da outra pessoa. </div>
  )
}

export function PetAdoptionStep1({ allData, user, token, verifyToken, id, setAllData, socket }: petAdoptionStep1Type) {
  const [agreements, setAgreements] = useState<boolean[]>([false, false, false, false]);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);

  const petInfo = allData?.getPetInfo
  const adopterInfo = allData?.maskedAdopterInfo
  const ownerInfo = allData?.maskedOwnerInfo

  const allChecked = agreements.every(Boolean);

  const handleCheckboxChange = (index: number) => {
    setAgreements((prev) =>
      prev.map((item, i) => (i == index ? !item : item))
    );
  };

  const confirmAdoption = async () => {
    try {
      const response = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/confirmation/${id}`,
        options: { method: "PATCH" },
        token: String(token),
        verifyToken: verifyToken
      })

      if (!response?.ok) return

      if (response?.data?.setAsConfirmed.ownerConfirmedAt || response?.data?.setAsConfirmed.adopterConfirmedAt) {
        setAllData((prev: any) => ({
          ...prev,
          getInfo: {
            ...prev?.getInfo,
            adopterConfirmedAt: response?.data?.setAsConfirmed.adopterConfirmedAt,
            ownerConfirmedAt: response?.data?.setAsConfirmed.ownerConfirmedAt
          }
        }))
      }

      if (response?.data?.setAsConfirmed.ownerConfirmedAt && response?.data?.setAsConfirmed.adopterConfirmedAt) {
        setAllData((prev: any) => ({
          ...prev,
          getInfo: {
            ...prev?.getInfo,
            step: response?.data?.setAdoptionStatus.step
          }
        }))
      }

      setIsButtonActive(false)
      if (response?.data?.setAdoptionStatus == null) {
        // show notification to kjashdkahsd
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!socket) return

    const handleConfirmation = (step1Confirmation: any) => {
      if (step1Confirmation.confirmation.ownerConfirmedAt || step1Confirmation.confirmation.adopterConfirmedAt) {
        setAllData((prev: any) => ({
          ...prev,
          getInfo: {
            ...prev?.getInfo,
            adopterConfirmedAt: step1Confirmation.confirmation.adopterConfirmedAt,
            ownerConfirmedAt: step1Confirmation.confirmation.ownerConfirmedAt
          }
        }))
      }
    }

    const handleNextStep = (nextStep: any) => {
      if (nextStep) {
        setAllData((prev: any) => ({
          ...prev,
          getInfo: {
            ...prev?.getInfo,
            step: nextStep.nextStep
          }
        }))
      }
    }

    socket.on("step1:Confirmation", handleConfirmation)
    socket.on("step1:nextStep", handleNextStep)

    return () => {
      socket.off("step1:Confirmation", handleConfirmation)
      socket.off("step1:nextStep", handleNextStep)
    }
  }, [socket])


  console.log(ownerInfo)
  console.log(adopterInfo)
  return (
    <main className="pet-adoption-container">
      <section className="pet-adoption-card">
        <PetAdoptionHeader
          step={"1"}
          title={"Confirmação & Compromissos"}
          sectionTitle={"Revise os Detalhes da Adoção"}
          desc={"Por favor revise todos os detalhes sobre a adoção com calma"}
        />

        {/* Pet Information */}
        <div className="pet-adoption-block">
          <div className="pet-adoption-block-header">
            <span className="pet-adoption-block-icon" aria-hidden="true">
              ✦
            </span>
            <h3 className="pet-adoption-block-title">Informações do Pet</h3>
          </div>

          <div className="pet-adoption-pet">
            <div className="pet-adoption-pet-image-wrap">
              <img
                className="pet-adoption-pet-image"
                src={petInfo?.imgs[0]?.url}
                alt="Pet"
                loading="lazy"
              />
            </div>

            <div className="pet-adoption-pet-meta">
              <div className="pet-adoption-pet-row">
                <span className="pet-adoption-muted">Nome</span>
                <strong className="pet-adoption-strong">{petInfo?.name}</strong>
              </div>
              <div className="pet-adoption-pet-row">
                <span className="pet-adoption-muted">Raça</span>
                <strong className="pet-adoption-strong">{petInfo?.breed}</strong>
              </div>
              <div className="pet-adoption-pet-row">
                <span className="pet-adoption-muted">Idade</span>
                <strong className="pet-adoption-strong">{`${petInfo?.age} Anos de Idade`}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* People Cards */}
        <div className="pet-adoption-grid">
          <div className="pet-adoption-person pet-adoption-person--adopter">
            <div className="pet-adoption-person-head">
              <div className="pet-adoption-person-title">
                <span className="pet-adoption-person-icon" aria-hidden="true">
                  👤
                </span>
                Adotante
              </div>

              <div className="pet-adoption-person-badges">
                {/* <span className="pet-adoption-badge">You</span> */} {/* leave without for now */}
                {allData?.getInfo.adopterConfirmedAt ? (
                  <span className="pet-adoption-status pet-adoption-status--ok">
                    Confirmado
                  </span>
                ) : <span className="pet-adoption-status pet-adoption-status--wait">
                  Esperando
                </span>}
              </div>
            </div>

            <div className="pet-adoption-person-body">
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Nome</span>
                <strong className="pet-adoption-strong">{`${adopterInfo?.name} ${adopterInfo?.lastName}`}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Email</span>
                <strong className="pet-adoption-strong">{adopterInfo?.email}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Celular</span>
                <strong className="pet-adoption-strong">{adopterInfo?.phone ?? "Nenhum Telefone Cadastrado"}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Localização</span>
                <strong className="pet-adoption-strong">{adopterInfo?.addresses[0]?.city && adopterInfo?.addresses[0]?.state ? `${adopterInfo?.addresses[0]?.state} ${adopterInfo?.addresses[0]?.city}` : "Nenhum Endereço Cadastrado"}</strong>
              </div>
            </div>
          </div>

          <div className="pet-adoption-person pet-adoption-person--owner">
            <div className="pet-adoption-person-head">
              <div className="pet-adoption-person-title">
                <span className="pet-adoption-person-icon" aria-hidden="true">
                  👤
                </span>
                Dono Atual
              </div>

              <div className="pet-adoption-person-badges">
                {allData?.getInfo.ownerConfirmedAt ? (
                  <span className="pet-adoption-status pet-adoption-status--ok">
                    Confirmado
                  </span>
                ) : <span className="pet-adoption-status pet-adoption-status--wait">
                  Esperando
                </span>}
              </div>
            </div>

            <div className="pet-adoption-person-body">
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Nome</span>
                <strong className="pet-adoption-strong">{`${ownerInfo?.name} ${ownerInfo?.lastName}`}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Email</span>
                <strong className="pet-adoption-strong">{ownerInfo?.email}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Celular</span>
                <strong className="pet-adoption-strong">{ownerInfo?.phone ?? "Nenhum Telefone Cadastrado"}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Localização</span>
                <strong className="pet-adoption-strong">{ownerInfo?.addresses[0]?.city && ownerInfo?.addresses[0]?.state ? `${ownerInfo?.addresses[0]?.state} ${ownerInfo?.addresses[0]?.city}` : "Nenhum Endereço Cadastrado"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Agreement */}
        {user?.id == adopterInfo?.id && allData?.getInfo.adopterConfirmedAt ? (
          ""
        ) : user?.id == ownerInfo?.id && allData?.getInfo.ownerConfirmedAt ? (
          ""
        ) : <div className="pet-adoption-agreement">
          <div className="pet-adoption-agreement-head">
            <h3 className="pet-adoption-agreement-title">Termo de Compromisso</h3>
            <p className="pet-adoption-agreement-subtitle">
              Você deve aceitar todos os itens abaixo para continuar.
            </p>
          </div>

          <ul className="pet-adoption-agreement-list">
            <li className="pet-adoption-agreement-item">
              <label className="pet-adoption-agreement-label">
                <input className="pet-adoption-checkbox"
                  type="checkbox"
                  checked={agreements[0]}
                  onChange={() => handleCheckboxChange(0)}
                />
                <span className="pet-adoption-agreement-text">
                  Confirmo que todas as informações fornecidas são precisas e completas.
                </span>
              </label>
            </li>

            <li className="pet-adoption-agreement-item">
              <label className="pet-adoption-agreement-label">
                <input className="pet-adoption-checkbox"
                  type="checkbox"
                  checked={agreements[1]}
                  onChange={() => handleCheckboxChange(1)}
                />
                <span className="pet-adoption-agreement-text">
                  Entendo que este é um compromisso vinculante para prosseguir com a adoção.
                </span>
              </label>
            </li>

            <li className="pet-adoption-agreement-item">
              <label className="pet-adoption-agreement-label">
                <input className="pet-adoption-checkbox"
                  type="checkbox"
                  checked={agreements[2]}
                  onChange={() => handleCheckboxChange(2)}
                />
                <span className="pet-adoption-agreement-text">
                  Concordo em concluir todas as etapas restantes do processo de adoção.
                </span>
              </label>
            </li>

            <li className="pet-adoption-agreement-item">
              <label className="pet-adoption-agreement-label">
                <input className="pet-adoption-checkbox"
                  type="checkbox"
                  checked={agreements[3]}
                  onChange={() => handleCheckboxChange(3)}
                />
                <span className="pet-adoption-agreement-text">
                  Comprometo-me a proporcionar um lar seguro e cheio de amor para este pet.
                </span>
              </label>
            </li>
          </ul>
        </div>}

        <div className="pet-adoption-next">
          <h4 className="pet-adoption-next-title">O que acontece a seguir?</h4>
          <ul className="pet-adoption-next-list">
            <li>Etapa 2: Propor e confirmar um encontro (data/horário + local).</li>
            <li>Etapa 3: Após o encontro, ambas as partes confirmam que ele ocorreu.</li>
            <li>Etapa 4: A confirmação final gera o comprovante de adoção (PDF).</li>
          </ul>
        </div>

        <div className="pet-adoption-cta">
          {user?.id == adopterInfo?.id && !allData?.getInfo.adopterConfirmedAt ? (
            <button type="button" className="pet-adoption-btn" disabled={!allChecked || !isButtonActive} onClick={() => confirmAdoption()}>
              {"Confirmar como Adotador"}
            </button>
          ) : user?.id == ownerInfo?.id && !allData?.getInfo.ownerConfirmedAt ? (
            <button type="button" className="pet-adoption-btn" disabled={!allChecked || !isButtonActive} onClick={() => confirmAdoption()}>
              {"Confirmar como Dono"}
            </button>
          ) : <AlreadyConfirmed />}

          <p className="pet-adoption-footnote">
            Ambas as partes devem confirmar antes de prosseguir para a próxima etapa.<br />
            Você terá 3 dias para confirmar; caso contrário, a adoção será cancelada.
          </p>
        </div>
      </section>
    </main>
  )
}

type petAdoptionStep2Type = {
  setAllData: React.Dispatch<React.SetStateAction<adoptionInterface | null>>
  allData: adoptionInterface | null
  user: UserData | null
  token: string | null,
  verifyToken: () => Promise<void>
  id: string | undefined
  register: UseFormRegister<PetAdoption2>
  handleSubmit: UseFormHandleSubmit<PetAdoption2>
  watch: UseFormWatch<PetAdoption2>
  setValue: UseFormSetValue<PetAdoption2>
  errors: FieldErrors<PetAdoption2>
  isSubmiting: boolean
  control: Control<PetAdoption2>
  setAddressMode: React.Dispatch<React.SetStateAction<"SAVED" | "CUSTOM">>
  addressMode: "SAVED" | "CUSTOM"
  onSubmit: (data: any) => void
  setAllProposes: React.Dispatch<React.SetStateAction<allProposesInterface[]>>,
  allProposes: allProposesInterface[]
  setIsRescheduleOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAddress: React.Dispatch<React.SetStateAction<adoptionAddress | null>>
  socket: Socket | null
}

export function PetAdoptionStep2({ allData, setAllData, user, token, verifyToken, id, register, handleSubmit, watch, setValue, isSubmiting, setAddressMode, addressMode, onSubmit, errors, control, allProposes, setAllProposes, setIsRescheduleOpen, setAddress, socket }: petAdoptionStep2Type) {
  const cep = watch("cep");
  useEffect(() => {
    cepSearch(setValue, String(cep));
  }, [cep]);

  const setProposeAsReject = async (proposeId: number) => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${proposeId}/setRejectInitial`,
      options: { method: "PATCH" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response?.ok) return

    setAllProposes(prev =>
      prev.map(p => (p.id == response?.data?.id ? { ...p, ...response.data } : p))
    );
  }

  const setProposeAsAccept = async (proposeId: number) => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${proposeId}/setAcceptInitial`,
      options: { method: "PATCH" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response?.ok) return

    if (allData?.getInfo.step == "MEETING") {
      setAllData((prev: any) => ({
        ...prev,
        getInfo: {
          ...prev?.getInfo,
          step: response?.data?.nextStep.step
        }
      }))
    }

    if (allData?.getInfo.step == "MEETING_CONFIRMED") {
      setAddress(response?.data?.addressAndDate)
      setIsRescheduleOpen(false)
    }
  }

  const getAllProposes = async () => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${id}/getInitial`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response?.ok) return

    setAllProposes(response?.data)
  }

  useEffect(() => {
    getAllProposes()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleNewPropose = ({ propose }: { propose: any }) => {

      if (propose) {
        setAllProposes((prev: any[]) => {
          if (prev.some((p) => p.id == propose.id)) return prev;
          return [propose, ...prev];
        });
      }
    }

    const handleRejectPropose = ({ reject }: { reject: any }) => {

      setAllProposes(prev =>
        prev.map(p => (p.id == reject.id ? { ...p, ...reject } : p))
      );
    }

    const handleNextStep = ({ nextStep }: { nextStep: any }) => {
      setAllData((prev: any) => ({
        ...prev,
        getInfo: {
          ...prev?.getInfo,
          step: nextStep
        }
      }))
    }

    const handleNewAddress = ({ newAddress }: { newAddress: any }) => {
      if (newAddress) {

        setAddress(newAddress)
        setIsRescheduleOpen(false)
      }
    }

    socket.on("step2:newPropose", handleNewPropose)
    socket.on("step2:reject", handleRejectPropose)
    socket.on("step2:nextStep", handleNextStep)

    socket.on("step3:newPropose", handleNewPropose)
    socket.on("step3:reject", handleRejectPropose)
    socket.on("step3:newAddress", handleNewAddress)

    return () => {
      socket.off("step2:newPropose", handleNewPropose)
      socket.off("step2:reject", handleRejectPropose)
      socket.off("step2:nextStep", handleNextStep)

      socket.off("step3:newPropose", handleNewPropose)
      socket.off("step3:reject", handleRejectPropose)
      socket.off("step3:newAddress", handleNewAddress)
    }
  }, [socket])

  const getAmount = allProposes?.length

  return (
    <section className="pet-adoption2-main">

      {allData?.getInfo.step == "MEETING" && (
        <PetAdoptionHeader
          step={"2"}
          title={"Agendar Encontro"}
          sectionTitle={"Organize um Encontro"}
          desc={"Proponha um local e horário para se encontrarem. Ambas as partes precisam concordar para prosseguir."}
        />
      )}

      <div className="pet-adoption2-grid">
        {/* LEFT: Proposal Form */}
        <aside className="pet-adoption2-left-container">
          <div className="pet-adoption2-left-top">
            <span className="pet-adoption2-left-title">Propor Novo Encontro</span>
          </div>

          <div className="pet-adoption2-tabs">
            <button
              type="button"
              className={`pet-adoption2-tab ${addressMode == "SAVED" ? "pet-adoption2-tab--active" : ""}`}
              onClick={() => setAddressMode("SAVED")}
            >
              Salvo
            </button>

            <button
              type="button"
              className={`pet-adoption2-tab ${addressMode == "CUSTOM" ? "pet-adoption2-tab--active" : ""}`}
              onClick={() => setAddressMode("CUSTOM")}
            >
              Personalizado
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pet-adoption2-left-container-details">
              {addressMode == "SAVED" ? (
                <div className="pet-adoption2-field">
                  <label className="pet-adoption2-label">Selecionar Endereço</label>
                  <select className="pet-adoption2-select" {...register("addressId")}>
                    <option value="">Escolha um endereço salvo</option>
                    {user?.addresses.map((t) => {
                      const completeAddress = `${t.street}, ${t.city}-${t.state}`
                      return (
                        <option key={t.id} value={t.id}>{completeAddress}</option>
                      )
                    })}
                  </select>
                  {errors.addressId && <p className="error">{errors.addressId.message}</p>}
                </div>
              ) : (
                <div className="pet-adoption2-customGrid">
                  <div className="pet-adoption2-field pet-adoption2-customGrid-full">
                    <label className="pet-adoption2-label">Cep</label>
                    <Controller
                      name="cep"
                      control={control}
                      render={({ field }) => (
                        <PatternFormat
                          value={field.value || ""}
                          onValueChange={(vals) => field.onChange(vals.formattedValue)}
                          format="#####-###"
                          mask="_"
                          inputMode="numeric"
                          placeholder="00000-000"
                          className="pet-adoption2-input"
                        />
                      )}
                    />
                    {errors.cep && <p className="error">{errors.cep.message}</p>}
                  </div>

                  <div className="pet-adoption2-field">
                    <label className="pet-adoption2-label">Rua</label>
                    <input className="pet-adoption2-input" type="text" placeholder="rua" {...register("street")} />
                    {errors.street && <p className="error">{errors.street.message}</p>}
                  </div>

                  <div className="pet-adoption2-field">
                    <label className="pet-adoption2-label">Bairro</label>
                    <input className="pet-adoption2-input" type="text" placeholder="Centro" {...register("neighborhood")} />
                    {errors.neighborhood && <p className="error">{errors.neighborhood.message}</p>}
                  </div>

                  <div className="pet-adoption2-field">
                    <label className="pet-adoption2-label">Cidade</label>
                    <input className="pet-adoption2-input" type="text" placeholder="São Paulo" {...register("city")} />
                    {errors.city && <p className="error">{errors.city.message}</p>}
                  </div>

                  <div className="pet-adoption2-field">
                    <label className="pet-adoption2-label">Estado</label>
                    <input className="pet-adoption2-input" type="text" placeholder="SP" {...register("region")} />
                    {errors.region && <p className="error">{errors.region.message}</p>}
                  </div>
                </div>
              )}

              <div className="pet-adoption2-field">
                <label className="pet-adoption2-label">Data do Encontro</label>
                <Controller
                  name="meetDate"
                  control={control}
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(vals) => field.onChange(vals.formattedValue)}
                      format="##/##/####"
                      mask="_"
                      inputMode="numeric"
                      placeholder="dd/mm/aaaa"
                      className="pet-adoption2-input"
                    />
                  )}
                />
                {errors.meetDate && <p className="error">{errors.meetDate.message}</p>}
              </div>

              <div className="pet-adoption2-field">
                <label className="pet-adoption2-label">Horário do Encontro</label>
                <Controller
                  name="meetTime"
                  control={control}
                  render={({ field }) => (
                    <PatternFormat
                      value={field.value || ""}
                      onValueChange={(vals) => field.onChange(vals.formattedValue)}
                      format="##:##"
                      mask="_"
                      inputMode="numeric"
                      placeholder="--:--"
                      className="pet-adoption2-input"
                    />
                  )}
                />
                {errors.meetTime && <p className="error">{errors.meetTime.message}</p>}
              </div>

              <button type="submit" className="pet-adoption2-send-btn" disabled={isSubmiting}>
                {isSubmiting ? "Enviando Proposta..." : "Enviar Proposta"}
              </button>
            </div>
          </form>
        </aside>

        {/* RIGHT: Proposals List */}
        <section className="pet-adoption2-right-container">
          <div className="pet-adoption2-right-top">
            <h2 className="pet-adoption2-right-title">Propostas de Encontro</h2>
            <span className="pet-adoption2-right-count">{getAmount} propostas</span>
          </div>

          <div className="pet-adoption2-right-container-all-proposals">

            {getAmount <= 0 && (
              <div className="pet-adoption2-empty">
                <div className="pet-adoption2-empty-icon" aria-hidden="true">
                  📍
                </div>
                <p className="pet-adoption2-empty-title">Ainda não há propostas</p>
                <p className="pet-adoption2-empty-text">
                  Crie sua primeira proposta de encontro ao lado esquerdo.
                </p>
              </div>
            )}

            {allProposes.map((t) => {
              const completeAddress = `${t?.address?.street}, ${t?.address?.neighborhood}, ${t?.address?.city}-${t?.address?.state}`

              const formattedDate = new Date(t?.meetingAt).toLocaleDateString("pt-BR", {
                dateStyle: "short"
              })

              const formattedTime = new Date(t.meetingAt).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Sao_Paulo"
              })

              const languageMap: Record<string, string> = {
                PENDING: "Pendente",
                ACCEPTED: "Aceita",
                REJECTED: "Rejeitada"
              }

              return (
                <article className="pet-adoption2-proposal-card" key={t.id}>
                  <div className="pet-adoption2-proposal-head">
                    <p className="pet-adoption2-proposal-address">{completeAddress}</p>

                    <span className="pet-adoption2-proposal-badge pet-adoption2-proposal-badge--pending">
                      {languageMap[t.status]}
                    </span>
                  </div>

                  <div className="pet-adoption2-proposal-meta">
                    <span>📅 {formattedDate}</span>
                    <span>🕒 {formattedTime}</span>
                  </div>

                  {user?.id !== t.createdById && t.status == "PENDING" ? (
                    <div className="pet-adoption2-proposal-footer">
                      <div className="pet-adoption2-proposal-actions">
                        <button
                          type="button"
                          className="pet-adoption2-proposal-btn pet-adoption2-proposal-btn--ghost"
                          onClick={() => setProposeAsReject(t.id)}
                        >
                          Rejeitar
                        </button>
                        <button
                          type="button"
                          className="pet-adoption2-proposal-btn pet-adoption2-proposal-btn--primary"
                          onClick={() => setProposeAsAccept(t.id)}
                        >
                          Aceitar
                        </button>
                      </div>
                    </div>
                  ) : ""}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

type Step3Props = {
  allData: adoptionInterface | null
  setAllData: React.Dispatch<React.SetStateAction<adoptionInterface | null>>
  setIsRescheduleOpen: React.Dispatch<React.SetStateAction<boolean>>
  isRescheduleOpen: boolean
  user: UserData | null
  token: string | null
  id: string | undefined
  verifyToken: () => Promise<void>
  rescheduleComponent: ReactNode;
  setAddress: React.Dispatch<React.SetStateAction<adoptionAddress | null>>
  address: adoptionAddress | null
  socket: Socket | null
};

export function PetAdoptionStep3({ allData, setAllData, user, token, id, verifyToken, rescheduleComponent, isRescheduleOpen, setIsRescheduleOpen, setAddress, address, socket }: Step3Props) {
  const [userConfirmed, setUserConfirmed] = useState<confirmations | null>(null)

  const openReschedule = () => setIsRescheduleOpen(true);
  const closeReschedule = () => setIsRescheduleOpen(false);

  const today = new Date()
  const canConfirm = today >= new Date(String(address?.date))

  const getSucessAddressInitial = async () => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${id}/getInitial/sucessAddress`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    }
    )
    if (!response?.ok) return

    setAddress(response?.data)
  }

  const setAsConfirmed = async () => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${id}/setAsConfirmed`,
      options: { method: "PATCH" },
      token: String(token),
      verifyToken: verifyToken
    }
    )

    if (!response?.ok) return

    if (user?.id == allData?.maskedAdopterInfo?.id) {
      setUserConfirmed((prev: any) => ({
        ...prev,
        adopterConfirmedAt: response?.data?.adopterConfirmedAt
      }))
    }

    if (user?.id == allData?.maskedOwnerInfo?.id) {
      setUserConfirmed((prev: any) => ({
        ...prev,
        ownerConfirmedAt: response?.data?.ownerConfirmedAt
      }))
    }

    if (response?.data?.step) {
      setAllData((prev: any) => ({
        ...prev,
        getInfo: {
          ...prev?.getInfo,
          step: response?.data?.step,
        },
        getPetInfo: {
          ...prev?.getPetInfo,
          date: response?.data?.createAdoption.adoptedAt
        }
      }))
    }
  }

  const getConfirmations = async () => {
    const response = await resendApiPrivate({
      apiUrl: `${import.meta.env.VITE_SERVER_URL}/adoption/propose/${id}/getConfirmations`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    }
    )

    if (!response?.ok) return
    setUserConfirmed(response?.data)
  }

  useEffect(() => {
    if (!token) return

    getSucessAddressInitial()
    getConfirmations()
  }, [])

  // Close on ESC
  useEffect(() => {
    if (!isRescheduleOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") closeReschedule();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRescheduleOpen]);


  useEffect(() => {
    if (!socket) return

    const handleSetAsConfirmed = (final: any) => {

      if (final.adopterConfirmedAt) {
        setUserConfirmed((prev: any) => ({
          ...prev,
          adopterConfirmedAt: final.adopterConfirmedAt
        }))
        closeReschedule();
      }

      if (final.ownerConfirmedAt) {
        setUserConfirmed((prev: any) => ({
          ...prev,
          ownerConfirmedAt: final.ownerConfirmedAt
        }))
        closeReschedule();
      }

      if (final.step) {
        setAllData((prev: any) => ({
          ...prev,
          getInfo: {
            ...prev?.getInfo,
            step: final.step,
          },
          getPetInfo: {
            ...prev?.getPetInfo,
            date: final.createAdoption.adoptedAt
          }
        }))
      }
    }

    socket.on("step3:setAsConfirmed", handleSetAsConfirmed)

    return () => {

    }
  }, [socket])

  return (
    <section className="petAdoption3-mainCard">
      <PetAdoptionHeader
        step={"3"}
        title={"Confirmar Entrega do Pet"}
        sectionTitle={"Confirme que tudo ocorreu como previsto"}
        desc={"Ambas as partes precisam confirmar que a entrega foi concluída com sucesso."}
      />

      <div className="petAdoption3-info">
        {/* PET */}
        <div className="petAdoption3-petInfo">
          <div className="petAdoption3-petMedia">
            <div className="petAdoption3-petFrame">
              <img
                className="petAdoption3-petImg"
                src={allData?.getPetInfo?.imgs[0]?.url}
                alt="Pet"
              />
            </div>

            <div className="petAdoption3-petChip">
              <span className="petAdoption3-petChipIcon" aria-hidden="true">
                ✦
              </span>
              <span className="petAdoption3-petName">{allData?.getPetInfo?.name}</span>
            </div>
          </div>

          <span className="petAdoption3-petData">{allData?.getPetInfo.breed} • {allData?.getPetInfo.age} anos</span>
        </div>

        {/* MEETING DETAILS */}
        <div className="petAdoption3-meeting-details">
          <div className="petAdoption3-meetingTopRow">
            <div className="petAdoption3-meetingHead">
              <span className="petAdoption3-meetingHeadDot" aria-hidden="true">
                <FaStreetView />
              </span>
              <h3 className="petAdoption3-meetingTitle">Detalhes do Encontro</h3>
            </div>

            {userConfirmed?.adopterConfirmedAt ? (
              ""
            ) : userConfirmed?.ownerConfirmedAt ? (
              ""
            ) : <button
              type="button"
              className="petAdoption3-meetingActionBtn"
              onClick={openReschedule}
            >
              <span className="petAdoption3-meetingActionIcon" aria-hidden="true">
                <FaRedo />
              </span>
              Reagendar
            </button>}
          </div>

          <div className="petAdoption3-meetingRow">
            <span className="petAdoption3-meetingIcon" aria-hidden="true">
              <IoLocationOutline />
            </span>
            <span className="petAdoption3-meetingText">
              {`${address?.street}, ${address?.neighborhood}, ${address?.city}-${address?.state}`}
            </span>
          </div>

          <div className="petAdoption3-meetingRow">
            <span className="petAdoption3-meetingIcon" aria-hidden="true">
              <CiCalendarDate />
            </span>
            <span className="petAdoption3-meetingText">{new Date(String(address?.date)).toLocaleDateString("pt-BR", {
              dateStyle: "short"
            })} • {new Date(String(address?.date)).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
        </div>

        {/* PARTIES */}
        <div className="petAdoption3-owners">
          <div className="petAdoption3-ownerCard petAdoption3-ownerCard--adopter">
            <div className="petAdoption3-ownerTop">
              <div className="petAdoption3-ownerAvatar">
                {allData?.maskedAdopterInfo?.profileImg ? (
                  <img
                    className="petAdoption3-ownerAvatar-img"
                    src={allData?.maskedAdopterInfo?.profileImg}
                  />
                ) : (
                  <span className="petAdoption3-ownerAvatar-fallback">👤</span>
                )}
              </div>

              <div className="petAdoption3-ownerMeta">
                <span className="petAdoption3-ownerName">{`${allData?.maskedAdopterInfo.name} ${allData?.maskedAdopterInfo.lastName}`}</span>
                <span className="petAdoption3-ownerRole">Adotante</span>
              </div>
            </div>

            <span className="petAdoption3-ownerStatus">{userConfirmed?.adopterConfirmedAt ? (
              "Confirmado"
            ) : "Aguardando confirmação..."}</span>
          </div>

          <div className="petAdoption3-ownerCard petAdoption3-ownerCard--owner">
            <div className="petAdoption3-ownerTop">
              <div className="petAdoption3-ownerAvatar">
                {allData?.maskedAdopterInfo?.profileImg ? (
                  <img
                    className="petAdoption3-ownerAvatar-img"
                    src={allData?.maskedOwnerInfo?.profileImg}
                  />
                ) : (
                  <span className="petAdoption3-ownerAvatar-fallback">👤</span>
                )}
              </div>

              <div className="petAdoption3-ownerMeta">
                <span className="petAdoption3-ownerName">{`${allData?.maskedOwnerInfo.name} ${allData?.maskedOwnerInfo.lastName}`}</span>
                <span className="petAdoption3-ownerRole">Dono Atual</span>
              </div>
            </div>

            <span className="petAdoption3-ownerStatus">{userConfirmed?.ownerConfirmedAt ? (
              "Confirmado"
            ) : "Aguardando confirmação..."}</span>
          </div>
        </div>

        {/* CONFIRMATION */}
        {user?.id == allData?.maskedAdopterInfo.id && userConfirmed?.adopterConfirmedAt ? (
          <AlreadyConfirmed />
        ) : user?.id == allData?.maskedOwnerInfo.id && userConfirmed?.ownerConfirmedAt ? (
          <AlreadyConfirmed />
        ) : (
          <div className="petAdoption3-confirmation">
            <span className="petAdoption3-confirmationHint">
              {user?.id == allData?.maskedAdopterInfo.id ? (
                `Por favor, confirme que você recebeu ${allData?.getPetInfo.name} de ${allData?.maskedOwnerInfo.name} ${allData?.maskedOwnerInfo.lastName} no local combinado.`
              ) : `Por favor, confirme que você entregou ${allData?.getPetInfo.name} para ${allData?.maskedAdopterInfo.name} ${allData?.maskedAdopterInfo.lastName} no local combinado.`}
            </span>

            <button type="button" className="petAdoption3-confirmBtn" disabled={!canConfirm} onClick={() => setAsConfirmed()}>
              <span className="petAdoption3-confirmBtnIcon" aria-hidden="true">
                ✓
              </span>
              {user?.id == allData?.maskedAdopterInfo.id ? (
                "Confirmar que Recebi o Pet"
              ) : "Confirmar que Entreguei o Pet"}
            </button>

            <span className="petAdoption3-confirmationNote">
              A confirmação ficará disponível após {new Date(String(address?.date)).toLocaleDateString("pt-BR", {
                dateStyle: "full"
              })}.
            </span>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isRescheduleOpen && (
        <div
          className="petAdoption3-modalOverlay"
          role="presentation"
        >
          <div className="petAdoption3-modal" role="dialog" aria-modal="true">
            <div className="petAdoption3-modalHeader">
              <div className="petAdoption3-modalHeaderLeft">
                <div className="petAdoption3-modalBadge" aria-hidden="true">
                  ↺
                </div>
                <div className="petAdoption3-modalTitles">
                  <span className="petAdoption3-modalTitle">Reagendar Encontro</span>
                </div>
              </div>

              <button
                type="button"
                className="petAdoption3-modalClose"
                onClick={closeReschedule}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="petAdoption3-modalBody">
              {/* warning */}
              <div className="petAdoption3-modalWarning">
                <span className="petAdoption3-modalWarningIcon" aria-hidden="true">
                  ⚠
                </span>
                <span className="petAdoption3-modalWarningText">
                  Ambas as partes precisarão aceitar o novo horário do encontro.
                </span>
              </div>

              {/* Step 2 mounted here */}
              <div className="petAdoption3-modalStep2Slot">{rescheduleComponent}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

type petAdoptionStep4Type = {
  allData: adoptionInterface | null
}

export function PetAdoptionStep4({ allData }: petAdoptionStep4Type) {
  const adopterFullName = `${allData?.maskedAdopterInfo.name} ${allData?.maskedAdopterInfo.lastName}`
  const ownerFullName = `${allData?.maskedOwnerInfo.name} ${allData?.maskedOwnerInfo.lastName}`

  return (
    <section className="petAdoption4-main-container">
      <div className="petadoption4-pageCard">

        <header className="petAdoption4-header">
          <div className="petadoption4-pulsating-heart" aria-hidden="true">
            <div className="petadoption4-heart-circle">
              <span className="petadoption4-heart-icon">❤</span>
            </div>
          </div>

          <h2 className="petAdoption4-title">
            <span className="petAdoption4-confettiIcon" aria-hidden="true">
              🎉
            </span>
            Adoção Concluída!
          </h2>

          <p className="petAdoption4-subtitle">
            Bem-vindo ao seu novo lar, <span className="petAdoption4-highlight">{allData?.getPetInfo.name}</span>!
          </p>

          <p className="petAdoption4-desc">
            Parabéns por concluir o processo de adoção. {allData?.getPetInfo.name} encontrou oficialmente um lar cheio de amor com {adopterFullName}!
          </p>
        </header>

        <section className="petadoption4-addoption-summary">
          <div className="petadoption4-left-panel">
            <div className="petadoption4-pet-imgWrap">
              <img
                className="petadoption4-pet-img"
                src={allData?.getPetInfo.imgs[0].url}
                alt="Foto do pet"
              />

              <div className="petadoption4-pet-chip">
                <span className="petadoption4-pet-chipIcon" aria-hidden="true">
                  ✦
                </span>
                <span className="petadoption4-pet-chipText">{allData?.getPetInfo.name}</span>
              </div>
            </div>

            <div className="petadoption4-peopleRow">
              <div className="petadoption4-personMini">
                <img
                  className="petadoption4-avatarMini"
                  src={allData?.maskedAdopterInfo.profileImg}
                  alt="Avatar do adotante"
                />
                <div className="petadoption4-personMiniText">
                  <span className="petadoption4-personMiniName">{adopterFullName}</span>
                  <span className="petadoption4-personMiniRole">Adotante</span>
                </div>
              </div>

              <div className="petadoption4-peopleLinkMini" aria-hidden="true">
                ↔
              </div>

              <div className="petadoption4-personMini">
                <img
                  className="petadoption4-avatarMini"
                  src={allData?.maskedOwnerInfo.profileImg}
                  alt="Avatar do dono atual"
                />
                <div className="petadoption4-personMiniText">
                  <span className="petadoption4-personMiniName">{ownerFullName}</span>
                  <span className="petadoption4-personMiniRole">Dono Atual</span>
                </div>
              </div>
            </div>
          </div>

          <div className="petadoption4-right-panel">
            <div className="petadoption4-summaryHeader">
              <span className="petadoption4-summaryIcon" aria-hidden="true">
                📄
              </span>
              <span className="petadoption4-summaryTitle">Resumo da Adoção</span>
            </div>

            <div className="petadoption4-details petadoption4-detailsWide">
              <span className="petadoption4-detailsLabel">Detalhes do Pet</span>
              <span className="petadoption4-detailsValue">{allData?.getPetInfo.breed} • {allData?.getPetInfo.age} anos de Idade</span>
            </div>

            <div className="petadoption4-detailsGrid2">
              <div className="petadoption4-details">
                <span className="petadoption4-detailsLabel">Adotado por</span>
                <span className="petadoption4-detailsValue">{adopterFullName}</span>
              </div>

              <div className="petadoption4-details">
                <span className="petadoption4-detailsLabel">Dono Anterior</span>
                <span className="petadoption4-detailsValue">{ownerFullName}</span>
              </div>
            </div>

            <div className="petadoption4-details petadoption4-detailsWide">
              <span className="petadoption4-detailsLabel">Data da Adoção</span>
              <span className="petadoption4-detailsValue">{new Date(String(allData?.getPetInfo?.date)).toLocaleDateString("pt-BR", {
                dateStyle: "full"
              })}</span>
            </div>
          </div>
        </section>

        <section className="petadoption4-thankYou-message">
          <div className="petadoption4-thankIcon" aria-hidden="true">
            ♡
          </div>
          <div className="petadoption4-thankText">
            <h3>Obrigado por escolher a adoção!</h3>
            <p>
              Você tomou uma decisão incrível ao dar ao {allData?.getPetInfo.name} um lar cheio de amor. Desejamos muitos anos felizes juntos, cheios de alegria, brincadeiras e amor incondicional.
              Lembre-se: a adoção é apenas o começo de uma linda amizade.
            </p>
          </div>
        </section>

        <div className="petadoption4-buttons">
          <button className="petadoption4-btn petadoption4-btnPrimary" type="button">
            ⬇ Baixar Certificado de Adoção
          </button>

          <button className="petadoption4-btn petadoption4-btnSecondary" type="button">
            🏠 Ir para Minhas Adoções
          </button>
        </div>

        <div className="petadoption4-footer-message">
          Uma cópia do certificado de adoção foi enviada para ambas as partes. Você pode acessar seus registros de adoção a qualquer momento pelo seu perfil.
        </div>
      </div>
    </section>
  );
}