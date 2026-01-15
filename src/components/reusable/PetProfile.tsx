import type { PetData } from "../../Interfaces/usefulPetInterface";
import { useUser, type UserData } from "../../Interfaces/GlobalUser";
import "../../assets/css/petProfile.css";
import { FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoTimeOutline } from "react-icons/io5";
import { BsFillPuzzleFill } from "react-icons/bs";
import { getWaitingText } from "../functions/petFunctions";
import apiFetch from "../../Interfaces/TokenAuthorization";
import { useEffect } from "react";

type petProfile = {
  data: {
    pet: PetData | null;
    owner: UserData | null;
    traits: any;
  }
}

export default function PetProfile({ data }: petProfile) {
  const { verifyToken } = useUser()
  const petData = data.pet
  // userData later to show who posted the pet, i will focus on the other data first
  // const onwerData = data.owner

  let petGender

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
    { title: "Visualizações de Perfil", icon: <GrView />, value: petData?.viewsCount },
    { title: "Corações Recebidos", icon: <FaHeart />, value: petData?.heartsCount },
    { title: "Esperando Adoção", icon: <IoTimeOutline />, value: getWaitingText({ petData }) },
    { title: "Compatibilidade", icon: <BsFillPuzzleFill />, value: 123 },
  ]

  const favoritesConfig = [
    { icon: "🎾", label: "Não consegue resistir", value: petData?.toy },
    { icon: "🥩", label: "O caminho para o seu coração", value: petData?.food },
    { icon: "🏖", label: "Não consegue parar de brincar", value: petData?.playPlace },
    { icon: "🛋", label: "Soneca depois de um longo dia", value: petData?.sleepPlace },
  ]

  { petData?.gender == "male" ? petGender = "Macho" : petData?.gender == "female" ? petGender = "Fêmea" : "" }

  const incrementHeart = async () => {
    try {
      const token = await verifyToken()
      const heart = await apiFetch(`http://localhost:3000/pets/${petData?.id}/heart`, {
        method: "POST"
      }, String(token))

      const res = await heart.json();
      console.log(res)
    } catch (e) {
      console.log(e)
    }

  }

  const incrementViews = async () => {
    try {
      const token = await verifyToken()
      const views = await apiFetch(`http://localhost:3000/pets/${petData?.id}/view`, {
        method: "POST"
      }, String(token))

      const res = await views.json();
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    incrementViews()
  }, [])

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
              <p className="pet-meta">{petData?.age} anos • {petGender}</p>
              <p className="pet-location">cidade • estado</p>
            </div>

            <div className="pet-description">{petData?.details}</div>

            <div className="pet-buttons">
              <button className="heart-button" onClick={() => incrementHeart()}><FaHeart /></button>
              <button className="adopt-button">Adotar {petData?.name}</button>
            </div>
          </div>
        </section>

        <section className="pet-highlights-banner">
          <div className="pet-highlights-row">
            {viewConfig.map(({ title, icon, value }, i) => (
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

            {favoritesConfig.map(({ icon, label, value }, i) => {
              return (
                <div key={i} className="favorite">
                  <div className="icon">{icon}</div>
                  <div className="favorite-description">
                    <h3>{value}</h3>
                    <p>{label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
