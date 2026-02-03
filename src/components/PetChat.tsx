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
import { getSocket } from "./socket";

type ChatMessage = {
  id: string | number;
  direction: "in" | "out";
  text: string;
  sentAt: string;
};

function PetChat() {
  const { token, verifyToken, user } = useUser()
  const { id } = useParams()
  const [alldata, setAlldata] = useState<any | null>(null)
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState<any[]>([])

  const socket = getSocket(String(token))

  const getData = async () => {
    const response = await resendApiPrivate({
      apiUrl: `http://localhost:3000/chat/conversation/${id}`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    setAlldata(response)
    // console.log(response)
  }

  const getMessages = async () => {
    const response = await resendApiPrivate({
      apiUrl: `http://localhost:3000/chat/conversation/${id}/messages`
      , options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    return response
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

    const response = await resendApiPrivate({
      apiUrl: `http://localhost:3000/chat/conversation/${id}/messages`
      , options: { method: "POST", body: JSON.stringify({ message }) },
      token: String(token),
      verifyToken: verifyToken
    })
    console.log("sendMessage", response)
  }

  useEffect(() => {
    if (!id || !socket) return;

    socket.emit("conversation:join", { conversationId: id });

    const run = async () => {
      await getData()
      setAllMessages(await getMessages())
    }
    run()
  }, [])



  useEffect(() => {
  if (!id || !socket) return;

  const handleNewMessage = ({ message }: any) => {
    if (!message || typeof message !== "object") return;

    if (message.conversationId !== Number(id)) return;

    console.log("new realtime message", message);

    setAllMessages((prev) => {
      if (prev.some((m) => m.id == message.id)) return prev;
      return [...prev, message];
    });
  };

  socket.on("message:new", handleNewMessage);

  return () => {
    socket.off("message:new", handleNewMessage);
    socket.emit("conversation:leave", { conversationId: id });
  };
}, [socket, id]);

  if (!alldata) return <Loader />

  const petImg = alldata.pet.imgs[0].url
  const ownerFullName = `${alldata.userOwner.name} ${alldata.userOwner.lastName}`

  const messages: ChatMessage[] = allMessages.map((m: any) => ({
    id: m.id,
    direction: m.senderId == user?.id ? "out" : "in",
    text: m.content,
    sentAt: new Date(m.createdAt).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }))


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
                value={message}
                placeholder={`Converse com ${alldata.userOwner.name} sobre o ${alldata.pet.name}`}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button className="pet-chat__composer-btn" aria-label="Emoji">
              <span className="pet-chat__icon"><BsEmojiSmile /></span>
            </button>

            <button className="pet-chat__send" onClick={() => {sendMessage(); setMessage("")}}>
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