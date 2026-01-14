import type { PetData } from "../../Interfaces/usefulPetInterface";
import type { UserData } from "../../Interfaces/GlobalUser";
import "../../assets/css/petProfile.css";
import { FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoTimeOutline } from "react-icons/io5";
import { BsFillPuzzleFill } from "react-icons/bs";

type petProfile = {
  data: {
    pet: PetData | null;
    owner: UserData | null;
    traits: any;
  }
}

export default function PetProfile({ data }: petProfile) {
  const petData = data.pet
  // userData later to show who posted the pet, i will focus on the other data first
  // const onwerData = data.owner

  const traitMap = Object.fromEntries(
    data.traits.map((t: any) => [t.Trait.key, t.value])
  );

  const personalityConfig = [
    { key: "friendly", label: "Amigável", color: "blue" },
    { key: "energetic", label: "Energético", color: "green" },
    { key: "smart", label: "Inteligente", color: "purple" },
    { key: "playful", label: "Brincalhão", color: "pink" },
    { key: "loyal", label: "Leal", color: "orange" },
  ];

  const viewConfig = [
    {title: "Visualizações de Perfil", icon: <GrView />, value: petData?.viewsCount},
    {title: "Corações Recebidos", icon: <FaHeart />, value: petData?.heartsCount},
    {title: "Tempo de Espera", icon: <IoTimeOutline />, value: 123},
    {title: "Compatibilidade", icon: <BsFillPuzzleFill />, value: 123},
  ]

  return (
    <div className="petProfilePage">
      {/* HERO + HIGHLIGHTS as one aligned block */}
      <div className="petHeroBlock">
        <section className="PetBanner card">
          <div className="petImg">
            <img src={petData?.imgs[0].url} alt={petData?.name} />
          </div>

          <div className="pet-all-information">
            <div className="pet-information">
              <h1>{petData?.name}</h1>
              <p className="pet-type">{petData?.type}</p>
              <p className="pet-meta">{petData?.age} anos • {petData?.gender}</p>
              <p className="pet-location">cidade • estado</p>
            </div>

            <div className="pet-description">{petData?.details}</div>

            <div className="pet-buttons">
              <button className="heart-button"><FaHeart /></button>
              <button className="adopt-button">Adotar {petData?.name}</button>
            </div>
          </div>
        </section>

        <section className="pet-highlights-banner">
          <div className="pet-highlights-row">
            {viewConfig.map(({title, icon, value}, i) => (
              <div key={i} className="pet-highlight card">
                <div className="highlight-icon">{icon}</div>
                <strong>{value}</strong>
                <span>{title}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* REST */}
      <section className="personalitys-favorites">
        <div className="both-row">
          <div className="personalitys card">
            <div className="personality-header">
              <span><FaHeart /></span>
              <h2>Personalidade</h2>
            </div>

            {personalityConfig.map(({ key, label, color }) => {
              const value = traitMap[key] ?? 0;

              return (
                <div key={key} className="personality">
                  <div className="personality-label">
                    <label>{label}</label>
                    <span>{value}%</span>
                  </div>

                  <div className={`bar ${color}`}>
                    <span style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="favorites card">
            <div className="favorites-header">
              <span><FaStar /></span>
              <h2>Coisas Favoritas</h2>
            </div>

            <div className="favorite">
              <div className="icon">🎾</div>
              <div className="favorite-description">
                <h3>{petData?.toy}</h3>
                <p>Não consegue resistir</p>
              </div>
            </div>

            <div className="favorite">
              <div className="icon">🥩</div>
              <div className="favorite-description">
                <h3>{petData?.food}</h3>
                <p>O caminho para o seu coração</p>
              </div>
            </div>

            <div className="favorite">
              <div className="icon">🏖</div>
              <div className="favorite-description">
                <h3>{petData?.playPlace}</h3>
                <p>Não consegue parar de brincar</p>
              </div>
            </div>

            <div className="favorite">
              <div className="icon">🛋</div>
              <div className="favorite-description">
                <h3>{petData?.sleepPlace}</h3>
                <p>Soneca depois de um longo dia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
