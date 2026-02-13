import type { adoptionInterface } from "../../Interfaces/adoptionInterface"
import { FaHeart } from "react-icons/fa";
import type { UserData } from "../../Interfaces/userInterface";
import { useState } from "react";

type petAdoptionStep1Type = {
  allData: adoptionInterface | null
  user: UserData | null
}

export function PetAdoptionStep1({ allData, user }: petAdoptionStep1Type) {
  const [agreements, setAgreements] = useState<boolean[]>([false, false, false, false]);

  const petInfo = allData?.getPetInfo
  const adopterInfo = allData?.maskedAdopterInfo
  const ownerInfo = allData?.maskedOwnerInfo

  const allChecked = agreements.every(Boolean);


  const handleCheckboxChange = (index: number) => {
  setAgreements((prev) =>
    prev.map((item, i) => (i == index ? !item : item))
  );
};

  

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
                <span className="pet-adoption-status pet-adoption-status--wait">
                  Waiting
                </span>
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
                <span className="pet-adoption-status pet-adoption-status--ok">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="pet-adoption-person-body">
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Name</span>
                <strong className="pet-adoption-strong">{`${ownerInfo?.name} ${ownerInfo?.lastName}`}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Email</span>
                <strong className="pet-adoption-strong">{ownerInfo?.email}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Phone</span>
                <strong className="pet-adoption-strong">{ownerInfo?.phone ?? "Nenhum Telefone Cadastrado"}</strong>
              </div>
              <div className="pet-adoption-kv">
                <span className="pet-adoption-muted">Location</span>
                <strong className="pet-adoption-strong">{ownerInfo?.addresses.city && ownerInfo?.addresses.state ? `${ownerInfo?.addresses?.state} ${ownerInfo?.addresses?.city}` : "Nenhum Endereço Cadastrado"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Agreement */}
        <div className="pet-adoption-agreement">
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
        </div>

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
          <button type="button" className="pet-adoption-btn" disabled={!allChecked} onClick={() => console.log("eu fui clicado")}>
            {user?.id == adopterInfo?.id ? "Confirmar como Adotador" : "Confirmar como Dono"}
          </button>

          <p className="pet-adoption-footnote">
            Ambas as partes devem confirmar antes de prosseguir para a próxima etapa.<br/>
            Você terá 3 dias para confirmar; caso contrário, a adoção será cancelada.
          </p>
        </div>
      </section>
    </main>
  )
}