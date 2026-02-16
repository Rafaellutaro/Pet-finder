import type { adoptionInterface } from "../../Interfaces/adoptionInterface"
import { FaHeart } from "react-icons/fa";
import type { UserData } from "../../Interfaces/userInterface";
import { useState } from "react";
import resendApiPrivate from "./resendApi";
import "../../assets/css/petAdoptionStep2.css"

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

export function PetAdoptionStep2() {
  const [addressMode, setAddressMode] = useState<"SAVED" | "CUSTOM">("SAVED");

  return (
    <section className="pet-adoption2-main">
      <header className="pet-adoption2-header">
        <h1 className="pet-adoption2-title">Step 2: Schedule meeting</h1>
        <p className="pet-adoption2-subtitle">Arrange a Meet &amp; Greet</p>
        <p className="pet-adoption2-description">
          Propose a location and time to meet. Both parties must agree to proceed.
        </p>
      </header>

      <div className="pet-adoption2-grid">
        {/* LEFT: Proposal Form */}
        <aside className="pet-adoption2-left-container">
          <div className="pet-adoption2-left-top">
            <span className="pet-adoption2-left-title">Propose New Meeting</span>
          </div>

          <div className="pet-adoption2-tabs">
            <button
              type="button"
              className={`pet-adoption2-tab ${addressMode === "SAVED" ? "pet-adoption2-tab--active" : ""}`}
              onClick={() => setAddressMode("SAVED")}
            >
              Saved
            </button>

            <button
              type="button"
              className={`pet-adoption2-tab ${addressMode === "CUSTOM" ? "pet-adoption2-tab--active" : ""}`}
              onClick={() => setAddressMode("CUSTOM")}
            >
              Custom
            </button>
          </div>

          <div className="pet-adoption2-left-container-details">
            {addressMode === "SAVED" ? (
              <div className="pet-adoption2-field">
                <label className="pet-adoption2-label">Select Address</label>
                <select className="pet-adoption2-select">
                  <option value="">Choose a saved address</option>
                  <option value="1">Address option 1</option>
                  <option value="2">Address option 2</option>
                </select>
              </div>
            ) : (
              <div className="pet-adoption2-customGrid">
                <div className="pet-adoption2-field pet-adoption2-customGrid-full">
                  <label className="pet-adoption2-label">Street</label>
                  <input className="pet-adoption2-input" type="text" placeholder="Rua Exemplo" />
                </div>

                <div className="pet-adoption2-field">
                  <label className="pet-adoption2-label">Number</label>
                  <input className="pet-adoption2-input" type="text" placeholder="123" />
                </div>

                <div className="pet-adoption2-field">
                  <label className="pet-adoption2-label">Neighborhood</label>
                  <input className="pet-adoption2-input" type="text" placeholder="Centro" />
                </div>

                <div className="pet-adoption2-field">
                  <label className="pet-adoption2-label">City</label>
                  <input className="pet-adoption2-input" type="text" placeholder="São Paulo" />
                </div>

                <div className="pet-adoption2-field">
                  <label className="pet-adoption2-label">State</label>
                  <input className="pet-adoption2-input" type="text" placeholder="SP" />
                </div>
              </div>
            )}

            <div className="pet-adoption2-field">
              <label className="pet-adoption2-label">Meeting Date</label>
              <input className="pet-adoption2-input" type="text" placeholder="dd/mm/yyyy" />
            </div>

            <div className="pet-adoption2-field">
              <label className="pet-adoption2-label">Meeting Time</label>
              <input className="pet-adoption2-input" type="text" placeholder="--:--" />
            </div>

            <button type="button" className="pet-adoption2-send-btn">
              Send Proposal
            </button>
          </div>
        </aside>

        {/* RIGHT: Proposals List */}
        <section className="pet-adoption2-right-container">
          <div className="pet-adoption2-right-top">
            <h2 className="pet-adoption2-right-title">Meeting Proposals</h2>
            <span className="pet-adoption2-right-count">0 proposals</span>
          </div>

          <div className="pet-adoption2-right-container-all-proposals">
            {/* Empty State */}
            <div className="pet-adoption2-empty">
              <div className="pet-adoption2-empty-icon" aria-hidden="true">
                📍
              </div>
              <p className="pet-adoption2-empty-title">No proposals yet</p>
              <p className="pet-adoption2-empty-text">
                Create your first meeting proposal on the left.
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