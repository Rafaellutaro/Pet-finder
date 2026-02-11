import { useState } from "react";
import { WarningPopUp } from "./PopUps";
import resendApiPrivate from "./resendApi";
import type { singleChatInterface } from "../../Interfaces/chatInterface";
import type { UserData } from "../../Interfaces/userInterface";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { IoIosAttach } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile, BsSend } from "react-icons/bs";

type ChatMessage = {
    id: string | number;
    direction: "in" | "out";
    text: string;
    sentAt: string;
};

type workingChatType = {
    token: string,
    verifyToken: () => Promise<void>,
    alldata: singleChatInterface | null,
    user: UserData | null,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setAlldata: React.Dispatch<React.SetStateAction<singleChatInterface | null>>,
    message: string,
    allMessages: any[]
    id: number

}

export function WorkingChat({ token, verifyToken, alldata, user, setMessage, message, allMessages, id, setAlldata }: workingChatType) {
    const [open, setOpen] = useState(false)
    const [openDecline, setOpenDecline] = useState(false)

    const handleAdoptionAccept = async () => {
        const changeStatus = await resendApiPrivate({
            apiUrl: `http://localhost:3000/chat/conversation/${id}/adoption`
            , options: { method: "PATCH", body: JSON.stringify({ status: "ACCEPTED" }) },
            token: String(token),
            verifyToken: verifyToken
        })

        setOpen(false)
        if (!changeStatus) return

    }

    const handleAdoptionReject = async () => {
        const changeStatus = await resendApiPrivate({
            apiUrl: `http://localhost:3000/chat/conversation/${id}/adoption`
            , options: { method: "PATCH", body: JSON.stringify({ status: "DECLINED" }) },
            token: String(token),
            verifyToken: verifyToken
        })

        setOpenDecline(false)
        if (!changeStatus) return

        setAlldata((prev: any) => ({
            ...prev,
            conversationStatus: "DECLINED"
        }))
    }

    const sendMessage = async () => {
        if (!message.trim()) return;

        const response = await resendApiPrivate({
            apiUrl: `http://localhost:3000/chat/conversation/${id}/messages`
            , options: { method: "POST", body: JSON.stringify({ message }) },
            token: String(token),
            verifyToken: verifyToken
        })

        setOpen(false)
        if (!response) return 
    }

    const petImg = alldata?.pet?.imgs[0]?.url
    const ownerFullName = `${alldata?.userOwner?.name} ${alldata?.userOwner?.lastName}`

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
        <>
            <WarningPopUp
                open={open}
                title="Aceitar Adoção?"
                details="Você tem certeza que deseja aceitar esta solicitação de adoção? 
                Ao continuar, você iniciará o processo de adoção. Em uma etapa posterior, ambos precisarão confirmar a adoção de forma definitiva,   após essa confirmação, não será possível voltar."
                cancelText="Não, cancelar"
                acceptText="Sim, continuar"
                onAccept={handleAdoptionAccept}
                onCancel={() => setOpen(false)}
                onClose={() => setOpen(false)}
            />

            <WarningPopUp
                open={openDecline}
                title="Rejeitar Adoção?"
                details="Você tem certeza que deseja rejeitar esta solicitação de adoção? 
                Após a rejeição, esta conversa será encerrada e não será mais possível trocar mensagens ou continuar o processo de adoção."
                cancelText="Não, voltar"
                acceptText="Sim, Continuar"
                onAccept={handleAdoptionReject}
                onCancel={() => setOpenDecline(false)}
                onClose={() => setOpenDecline(false)}
            />
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
                                        {alldata?.pet?.name} <span className="pet-chat__pet-heart">❤️</span>
                                    </div>
                                    <div className="pet-chat__pet-owner">{ownerFullName} • Online</div>
                                </div>
                            </div>

                            <div className="pet-chat__top-actions">
                                {/* I will mintain this here for future use if i want */}

                                {/* <button className="pet-chat__icon-btn" aria-label="Call">
                        <span className="pet-chat__icon"><FaPhone /></span>
                      </button>
        
                      <button className="pet-chat__icon-btn" aria-label="Video">
                        <span className="pet-chat__icon"><AiOutlineVideoCamera /></span>
                      </button> */}

                                {/* <span className="pet-chat__divider" aria-hidden="true" /> */}

                                {/* Accept/Decline only for owner + pending */}
                                {user?.id == alldata?.ownerId && (
                                    <div className="pet-chat__adoption-inline">
                                        <button
                                            className="pet-chat__action pet-chat__action--accept"
                                            onClick={() => setOpen(true)}>
                                            <span className="pet-chat__action-icon" aria-hidden="true"><FaCheckCircle /></span>
                                            <span className="pet-chat__action-text">Aceitar</span>
                                        </button>

                                        <button
                                            className="pet-chat__action pet-chat__action--decline"
                                            onClick={() => setOpenDecline(true)}
                                        >
                                            <span className="pet-chat__action-icon" aria-hidden="true"><FaTimesCircle /></span>
                                            <span className="pet-chat__action-text">Rejeitar</span>
                                        </button>
                                    </div>
                                )}

                                <button className="pet-chat__icon-btn" aria-label="More">
                                    <span className="pet-chat__icon"><SlOptionsVertical /></span>
                                </button>
                            </div>
                        </div>

                        {/* Pet Info Pill */}
                        <div className="pet-chat__pet-pill">
                            <span className="pet-chat__pill-item">{alldata?.pet?.breed}</span>
                            <span className="pet-chat__pill-sep" />
                            <span className="pet-chat__pill-item">{`${alldata?.pet?.age} Anos de Idade`}</span>
                            <span className="pet-chat__pill-sep" />
                            <span className="pet-chat__pill-item">{`${alldata?.pet?.address?.city}, ${alldata?.pet?.address?.state}`}</span>
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
                                                src={user?.id == alldata?.ownerId ? alldata?.userAdopter?.profileImg : alldata?.userOwner?.profileImg}
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
                                    placeholder={`Converse com ${alldata?.userOwner?.name} sobre o ${alldata?.pet?.name}`}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button className="pet-chat__composer-btn" aria-label="Emoji">
                                <span className="pet-chat__icon"><BsEmojiSmile /></span>
                            </button>

                            <button className="pet-chat__send" onClick={() => { sendMessage(); setMessage("") }}>
                                <span className="pet-chat__send-plane"><BsSend /></span>
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

type rejectedChatType = {
    alldata: singleChatInterface | null,
    allMessages: any[],
    user: UserData | null

}

export function RejectedChat({ alldata, allMessages, user }: rejectedChatType) {
    const petImg = alldata?.pet?.imgs[0]?.url
    const ownerFullName = `${alldata?.userOwner?.name} ${alldata?.userOwner?.lastName}`

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
        <>
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
                                        {alldata?.pet?.name} <span className="pet-chat__pet-heart">❤️</span>
                                    </div>
                                    <div className="pet-chat__pet-owner">{ownerFullName} • Online</div>
                                </div>
                            </div>

                            <div className="pet-chat__top-actions">
                                {/* I will mintain this here for future use if i want */}

                                {/* <button className="pet-chat__icon-btn" aria-label="Call">
                        <span className="pet-chat__icon"><FaPhone /></span>
                      </button>
        
                      <button className="pet-chat__icon-btn" aria-label="Video">
                        <span className="pet-chat__icon"><AiOutlineVideoCamera /></span>
                      </button> */}

                                {/* <span className="pet-chat__divider" aria-hidden="true" /> */}

                                <button className="pet-chat__icon-btn" aria-label="More">
                                    <span className="pet-chat__icon"><SlOptionsVertical /></span>
                                </button>
                            </div>
                        </div>

                        {/* Pet Info Pill */}
                        <div className="pet-chat__pet-pill">
                            <span className="pet-chat__pill-item">{alldata?.pet?.breed}</span>
                            <span className="pet-chat__pill-sep" />
                            <span className="pet-chat__pill-item">{`${alldata?.pet?.age} Anos de Idade`}</span>
                            <span className="pet-chat__pill-sep" />
                            <span className="pet-chat__pill-item">{`${alldata?.pet?.address?.city}, ${alldata?.pet?.address?.state}`}</span>
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
                                                src={user?.id == alldata?.ownerId ? alldata?.userAdopter?.profileImg : alldata?.userOwner?.profileImg}
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
                                    placeholder="Esse Chat não está habilitado"
                                    readOnly
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
        </>
    )
}