import type { adoptionInterface } from "../../Interfaces/adoptionInterface"
import { FaHeart } from "react-icons/fa";
import type { UserData } from "../../Interfaces/userInterface";
import { useEffect, useState } from "react";
import resendApiPrivate from "./resendApi";
import "../../assets/css/petAdoptionStep2.css"
import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from "react-hook-form";
import type { PetAdoption2, PetAdoptionStep2Schema } from "../../Interfaces/zodSchema";
import { cepSearch } from "../functions/userFunctions";
import { PatternFormat } from "react-number-format";

type petAdoptionStep1Type = {
  allData: adoptionInterface | null
  user: UserData | null
  token: string | null,
  verifyToken: () => Promise<void>
  id: string | undefined
}

export function PetAdoptionStep1({ allData, user, token, verifyToken, id }: petAdoptionStep1Type) {
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
        apiUrl: `${import.meta.env.VITE_API_URL}/adoption/confirmation/${id}`,
        options: { method: "PATCH" },
        token: String(token),
        verifyToken: verifyToken
      })

      if (!response) return
      setIsButtonActive(false)
      if (response.setAdoptionStatus == null) {
        // show notification to kjashdkahsd
      }
    } catch (e) {
      console.log(e)
    }
  }



  return (
    <main className="pet-adoption-container">
      <section className="pet-adoption-card">
        <div className="pet-adoption-card-top">
          <div className="pet-adoption-pill">
            <span className="pet-adoption-pill-icon" aria-hidden="true">
              <FaHeart />
            </span>
            Etapa 1: Confirmação & Compromissos
          </div>

          <h2 className="pet-adoption-section-title">Revise os Detalhes da Adoção</h2>
          <p className="pet-adoption-section-desc">
            Por favor revise todos os detalhes sobre a adoção com calma
          </p>
        </div>

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
                <strong className="pet-adoption-strong">{adopterInfo?.addresses.city && adopterInfo?.addresses.state ? `${adopterInfo?.addresses?.state} ${adopterInfo?.addresses?.city}` : "Nenhum Endereço Cadastrado"}</strong>
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
                <strong className="pet-adoption-strong">{ownerInfo?.addresses.city && ownerInfo?.addresses.state ? `${ownerInfo?.addresses?.state} ${ownerInfo?.addresses?.city}` : "Nenhum Endereço Cadastrado"}</strong>
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

        {/* What happens next */}
        <div className="pet-adoption-next">
          <h4 className="pet-adoption-next-title">O que acontece a seguir?</h4>
          <ul className="pet-adoption-next-list">
            <li>Etapa 2: Propor e confirmar um encontro (data/horário + local).</li>
            <li>Etapa 3: Após o encontro, ambas as partes confirmam que ele ocorreu.</li>
            <li>Etapa 4: A confirmação final gera o comprovante de adoção (PDF).</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="pet-adoption-cta">
          {user?.id == adopterInfo?.id && !allData?.getInfo.adopterConfirmedAt ? (
            <button type="button" className="pet-adoption-btn" disabled={!allChecked || !isButtonActive} onClick={() => confirmAdoption()}>
              {"Confirmar como Adotador"}
            </button>
          ) : user?.id == ownerInfo?.id && !allData?.getInfo.ownerConfirmedAt ? (
            <button type="button" className="pet-adoption-btn" disabled={!allChecked || !isButtonActive} onClick={() => confirmAdoption()}>
              {"Confirmar como Dono"}
            </button>
          ) : ""}

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
}

export function PetAdoptionStep2({ allData, user, token, verifyToken, id, register, handleSubmit, watch, setValue, isSubmiting, setAddressMode, addressMode, onSubmit, errors, control }: petAdoptionStep2Type) {

  const cep = watch("cep");
  useEffect(() => {
    cepSearch(setValue, String(cep));
  }, [cep]);

  return (
    <section className="pet-adoption2-main">
      <div className="pet-adoption-card-top">
          <div className="pet-adoption-pill">
            <span className="pet-adoption-pill-icon" aria-hidden="true">
              <FaHeart />
            </span>
            Etapa 2: Agendar Encontro
          </div>

          <h2 className="pet-adoption-section-title">Organize um Encontro</h2>
          <p className="pet-adoption-section-desc">
            Proponha um local e horário para se encontrarem. Ambas as partes precisam concordar para prosseguir.
          </p>
        </div>

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
            <span className="pet-adoption2-right-count">0 propostas</span>
          </div>

          <div className="pet-adoption2-right-container-all-proposals">
            {/* Empty State */}
            <div className="pet-adoption2-empty">
              <div className="pet-adoption2-empty-icon" aria-hidden="true">
                📍
              </div>
              <p className="pet-adoption2-empty-title">Ainda não há propostas</p>
              <p className="pet-adoption2-empty-text">
                Crie sua primeira proposta de encontro ao lado esquerdo.
              </p>
            </div>

            {/* Example proposal card to test UI */}
            {/* <article className="pet-adoption2-proposal-card">
              <div className="pet-adoption2-proposal-head">
                <p className="pet-adoption2-proposal-address">Rua Exemplo, 123 - Centro</p>

                <span className="pet-adoption2-proposal-badge pet-adoption2-proposal-badge--pending">
                  Pending
                </span>
              </div>

              <div className="pet-adoption2-proposal-meta">
                <span>📅 15/02/2026</span>
                <span>🕒 14:00</span>
              </div>

              <div className="pet-adoption2-proposal-footer">
                <div className="pet-adoption2-proposal-actions">
                  <button
                    type="button"
                    className="pet-adoption2-proposal-btn pet-adoption2-proposal-btn--ghost"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="pet-adoption2-proposal-btn pet-adoption2-proposal-btn--primary"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </article> */}
          </div>
        </section>
      </div>
    </section>
  );
}