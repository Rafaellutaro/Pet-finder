import type { PetData } from "../../Interfaces/usefulPetInterface";
import { useUser } from "../../Interfaces/GlobalUser";
import "../../assets/css/petProfile.css";
import { FaHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoTimeOutline } from "react-icons/io5";
import { BsFillPuzzleFill } from "react-icons/bs";
import { getWaitingText } from "../functions/petFunctions";
import { useEffect } from "react";
import type { UserData } from "../../Interfaces/userInterface";
import { useNavigateWithFrom } from "./Redirect";
import resendApiPrivate from "./resendApi";
import { toast } from "react-toastify";

type petProfile = {
  data: {
    pet: PetData | null;
    owner: UserData | null;
    traits: any;
  }
}

export default function PetProfile({ data }: petProfile) {
  const { verifyToken, token } = useUser()
  const petData = data.pet
  const chatNavigate = useNavigateWithFrom()
  // userData later to show who posted the pet, i will focus on the other data first
  // const onwerData = data.owner

  let petGender

  const getConversationId = async () => {
    try {
      await toast.promise(resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/chat/conversationCreate`,
        options: { method: "POST", body: JSON.stringify({ petId: petData?.id }) },
        token: String(token),
        verifyToken: verifyToken
      }).then((response) => {
        if (!response?.ok) {
          throw new Error("Erro ao tentar criar chat");
        }
        chatNavigate(`/Chat/${response?.data}`)
        return response
      }),
        {
          pending: {
            render() {
              return "Tentando resumir ou criar chat...";
            },
          },
          success: {
            render({data}) {
              return `${data?.message}`;
            },
          },
          error: {
            render() {
              return "Erro ao tentar criar ou resumir chat";
            },
          },
        }
      )
    } catch (e) {
      console.log(e)
    }
  }

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
      const heart = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/pets/${petData?.id}/heart`,
        options: { method: "POST" },
        token: String(token),
        verifyToken: verifyToken
      })

      if (!heart?.ok) return toast.error(`${heart?.message}`)

    } catch (e) {
      console.log(e)
    }

  }

  const incrementViews = async () => {
    try {
      const views = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/pets/${petData?.id}/view`,
        options: { method: "POST" },
        token: String(token),
        verifyToken: verifyToken
      })

      if (!views?.ok) return
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
              <p className="pet-location">{`${petData?.address?.city} • ${petData?.address?.state}`}</p>
            </div>

            <div className="pet-description">{petData?.details}</div>

            <div className="pet-buttons">
              <button className="heart-button" onClick={() => incrementHeart()}><FaHeart /></button>
              <button className="adopt-button" onClick={() => getConversationId()}>Adotar {petData?.name}</button>
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
