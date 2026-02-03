import "../assets/css/PetChat.css"
import img from "../assets/imgs/catLogin.png"
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { FaPhone } from "react-icons/fa6";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { useParams } from "react-router-dom";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import { useEffect, useState } from "react";
import Loader from "./reusable/Loader";
import { FaUserCircle } from "react-icons/fa";

type ChatMessage = {
  id: string | number;
  direction: "in" | "out";
  text: string;
  sentAt: string;
};

function PetChat() {
  const { token, verifyToken, user} = useUser()
  const { id } = useParams()
  const [alldata, setAlldata] = useState<any | null>(null)

  const getData = async () => {
    const response = await resendApiPrivate({
      apiUrl: `http://localhost:3000/chat/conversation/${id}`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    setAlldata(response)
    console.log(response)
  }

  useEffect(() => {
    const run = async () => {
      await getData()
    }
    run()
  }, [])

  if (!alldata) return <Loader />

  const petImg = alldata.pet.imgs[0].url
  const ownerFullName = `${alldata.userOwner.name} ${alldata.userOwner.lastName}`

  const messages: ChatMessage[] = [
    {
      id: 1,
      direction: "in",
      text: "Hi! Thank you for your interest in Max! He's such a sweet boy.",
      sentAt: "10:30 AM",
    },
    {
      id: 2,
      direction: "out",
      text: "Hello! I saw Max's profile and I'm very interested in adopting him. Can you tell me more about his personality?",
      sentAt: "10:32 AM",
    },
  ]


  return (
    <div className="pet-chat">
      <div className="pet-chat__stage">
        <div className="pet-chat__card">
          {/* Top Chat Header */}
          <div className="pet-chat__top">
            <div className="pet-chat__top-left">
              <div className="pet-chat__pet-avatar">
                <img src={petImg} alt="Max" />
                <span className="pet-chat__online-dot" />
              </div>

              <div className="pet-chat__top-meta">
                <div className="pet-chat__pet-name">
                  {alldata.pet.name} <span className="pet-chat__pet-heart">❤️</span>
                </div>
                <div className="pet-chat__pet-owner">{ownerFullName} • Online</div>
              </div>
            </div>

            <div className="pet-chat__top-actions">
              <button className="pet-chat__icon-btn" aria-label="Call">
                <span className="pet-chat__icon"><FaPhone /></span>
              </button>

              <button className="pet-chat__icon-btn" aria-label="Video">
                <span className="pet-chat__icon"><AiOutlineVideoCamera /></span>
              </button>

              <button className="pet-chat__icon-btn" aria-label="More">
                <span className="pet-chat__icon"><SlOptionsVertical /></span>
              </button>
            </div>
          </div>

          {/* Pet Info Pill */}
          <div className="pet-chat__pet-pill">
            <span className="pet-chat__pill-item">{alldata.pet.breed}</span>
            <span className="pet-chat__pill-sep" />
            <span className="pet-chat__pill-item">{`${alldata.pet.age} Anos de Idade`}</span>
            <span className="pet-chat__pill-sep" />
            <span className="pet-chat__pill-item">{`${alldata.pet.address.city}, ${alldata.pet.address.state}`}</span>
          </div>

          {/* Messages */}
          <div className="pet-chat__messages">
            {messages.map((m) => {
              const isIn = m.direction == "in";

              return (
                <div
                  key={m.id}
                  className={`pet-chat__row ${isIn ? "pet-chat__row--in" : "pet-chat__row--out"}`}
                >
                  {/* INCOMIG */}
                  {isIn && (
                    <img
                      src={alldata.userOwner.profileImg}
                      alt=""
                      className="pet-chat__badge pet-chat__badge--in"
                    />
                  )}

                  <div className={`pet-chat__bubble-wrap ${!isIn ? "pet-chat__bubble-wrap--out" : ""}`}>
                    <div className={`pet-chat__bubble ${isIn ? "pet-chat__bubble--in" : "pet-chat__bubble--out"}`}>
                      {m.text}
                    </div>

                    <div className={`pet-chat__time ${isIn ? "pet-chat__time--in" : "pet-chat__time--out"}`}>
                      {m.sentAt}
                    </div>
                  </div>

                  {/* OUTGOING*/}
                  {!isIn && (
                    <img
                      src={user?.profileImg}
                      alt=""
                      className="pet-chat__badge pet-chat__badge--out"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <div className="pet-chat__composer">
            <button className="pet-chat__composer-btn" aria-label="Attach">
              <span className="pet-chat__icon"><IoIosAttach /></span>
            </button>

            <button className="pet-chat__composer-btn" aria-label="Image">
              <span className="pet-chat__icon"><CiImageOn /></span>
            </button>

            <div className="pet-chat__input-shell">
              <input
                className="pet-chat__input"
                placeholder={`Converse com ${alldata.userOwner.name} sobre o ${alldata.pet.name}`}
              />
            </div>

            <button className="pet-chat__composer-btn" aria-label="Emoji">
              <span className="pet-chat__icon"><BsEmojiSmile /></span>
            </button>

            <button className="pet-chat__send">
              <span className="pet-chat__send-plane"><BsSend /></span>
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetChat;