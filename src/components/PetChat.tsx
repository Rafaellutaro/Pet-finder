import "../assets/css/PetChat.css"
import img from "../assets/imgs/catLogin.png"
import { BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { FaPhone } from "react-icons/fa6";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { useEffect, useState } from "react";
import apiFetch from "../Interfaces/TokenAuthorization";
import { useUser } from "../Interfaces/GlobalUser";
import { useParams } from "react-router-dom";
import resendApiPrivate from "./reusable/resendApi";
import type { PetData } from "../Interfaces/usefulPetInterface";

function PetChat() {
  const { id } = useParams()
  const { token, verifyToken } = useUser()
  const [conversationId, setConversationId] = useState()
  const [ownerPetData, setOwnerPetData] = useState<PetData | null>(null)

  const getPetOwnerData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pets/getUniquePet?petId=${id}`, {
        method: "GET",
        headers: { 'content-type': 'application/json' }
      })
      const res = await response.json()
      console.log("ownerData", res)
      return res.data
    } catch (e) {
      console.log(e)
    }
  }

  const getConversationId = async (ownerId: string) => {
    const data = {
      petId: id, ownerId
    }

    const response = await resendApiPrivate({ apiUrl: "http://localhost:3000/chat/conversationCreate", 
      options: { method: "POST", body: JSON.stringify(data) }, 
      token: String(token), 
      verifyToken: verifyToken })
    
    return response.id
  }

  useEffect(() => {
    const setOwner = async () => {
      setOwnerPetData(await getPetOwnerData())
    }
    setOwner()
  }, [])

  useEffect(() => {
    const pao = async () => {
      setConversationId(await getConversationId(String(ownerPetData?.userId)))
    }
    pao()
    console.log(conversationId)
  }, [ownerPetData])

  return (
    <div className="pet-chat">
      <div className="pet-chat__stage">
        <div className="pet-chat__card">
          {/* Top Chat Header */}
          <div className="pet-chat__top">
            <div className="pet-chat__top-left">
              <div className="pet-chat__pet-avatar">
                <img src={img} alt="Max" />
                <span className="pet-chat__online-dot" />
              </div>

              <div className="pet-chat__top-meta">
                <div className="pet-chat__pet-name">
                  Max <span className="pet-chat__pet-heart">❤️</span>
                </div>
                <div className="pet-chat__pet-owner">Sarah Johnson • Online</div>
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
            <span className="pet-chat__pill-item">Golden Retriever</span>
            <span className="pet-chat__pill-sep" />
            <span className="pet-chat__pill-item">3 years</span>
            <span className="pet-chat__pill-sep" />
            <span className="pet-chat__pill-item">San Francisco, CA</span>
          </div>

          {/* Messages */}
          <div className="pet-chat__messages">
            {/* Incoming */}
            <div className="pet-chat__row pet-chat__row--in">
              <div className="pet-chat__badge pet-chat__badge--in">SJ</div>

              <div className="pet-chat__bubble-wrap">
                <div className="pet-chat__bubble pet-chat__bubble--in">
                  Hi! Thank you for your interest in Max! He's such a sweet boy.
                </div>
                <div className="pet-chat__time pet-chat__time--in">10:30 AM</div>
              </div>
            </div>

            {/* Outgoing */}
            <div className="pet-chat__row pet-chat__row--out">
              <div className="pet-chat__bubble-wrap pet-chat__bubble-wrap--out">
                <div className="pet-chat__bubble pet-chat__bubble--out">
                  Hello! I saw Max's profile and I'm very interested in adopting him.
                  Can you tell me more about his personality?
                </div>
                <div className="pet-chat__time pet-chat__time--out">10:32 AM</div>
              </div>

              <div className="pet-chat__badge pet-chat__badge--out">You</div>
            </div>
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
                placeholder="Message Sarah Johnson about Max..."
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