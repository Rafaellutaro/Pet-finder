import { CiSearch } from "react-icons/ci";
import "../assets/css/Chat.css"
import { useEffect, useState } from "react";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import type { chatInterface } from "../Interfaces/chatInterface";
import bannerDFT from "../assets/imgs/bannerDFT.png"
import { useNavigateWithFrom } from "./reusable/Redirect";

function Chat() {
    const { token, verifyToken } = useUser()
    const [allChatsData, setAllChatsData] = useState<chatInterface[]>([])
    const [conversationState, setConversationState] = useState("ALL")
    const nav = useNavigateWithFrom()

    const getAllChats = async () => {
        const response = await resendApiPrivate({ apiUrl: "http://localhost:3000/chat/allConversation", options: { method: "GET" }, token: String(token), verifyToken: verifyToken })

        if (!response) return
        setAllChatsData(response)
    }

    useEffect(() => {
        if (!token) return
        getAllChats()
    }, [])

    const languageMap: Record<string, string> = {
        PENDING: "Pendente",
        ACCEPTED: "Aceita",
        DECLINED: "Rejeitada"
    }

    console.log(allChatsData)

    const unreadChatView = allChatsData.map((c) => {
        const content = c.lastMessage?.content?.trim()
        const sentMessageTime = c.lastMessage?.createdAt

        return {
            conversationId: c.id,
            petName: c.pet.name,
            conversationState: languageMap[c.conversationStatus] ? languageMap[c.conversationStatus] : c.conversationStatus,
            ownerName: `${c.userOwner.name} ${c.userOwner.lastName}`,
            recentMessage: content ? content : "Nenhuma mensagem enviada ainda",
            recentMessageTime: sentMessageTime ? new Date(sentMessageTime).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            }) : "Não há data",
            petPhotos: c.pet?.imgs[0]?.url,
            userPhoto: c.userOwner.profileImg ? c.userOwner.profileImg : bannerDFT,
            adoptionLink: c.adoptionProcess?.id ? `/PetAdoption/${c.adoptionProcess?.id}` : null,
            adoptionState: c.adoptionProcess?.step ? c.adoptionProcess?.step : null,
        }
    })

    const filteredChats =
        conversationState == "ALL"
            ? unreadChatView
            : unreadChatView.filter(c => c.conversationState == conversationState)

    return (
        <section className="Chats-Main-Container">
            <div className="search-bar">
                <CiSearch className="search-icon" />

                <input
                    type="search"
                    name="searchBar"
                    id="searchBar"
                    placeholder="Procure por conversas, pets ou mensagens"
                    autoComplete="off"
                />

                <button className={`allBtn ${conversationState == "ALL" ? "isActive" : ""}`} type="button" onClick={() => setConversationState("ALL")}>
                    Todas
                </button>
                <button className={`pendingBtn ${conversationState == "PENDING" ? "isActive" : ""}`} type="button" onClick={() => setConversationState("PENDING")}>
                    Pendente
                </button>
                <button className={`acceptedBtn ${conversationState == "ACCEPTED" ? "isActive" : ""}`} type="button" onClick={() => setConversationState("ACCEPTED")}>
                    Aceitas
                </button>
                <button className={`rejectedBtn ${conversationState == "DECLINED" ? "isActive" : ""}`} type="button" onClick={() => setConversationState("DECLINED")}>
                    Rejeitadas
                </button>
            </div>

            <div className="all-chats-list">
                {/* Chat row (Unread) */}
                {filteredChats.map((c) => (
                    <div key={c.conversationId} className="all-chats-container">
                        <button
                            type="button"
                            className="all-chat-openBtn"
                            onClick={() => nav(`/Chat/${c.conversationId}`)}
                        >
                            <div className="all-chat-petImg">
                                <img src={c.petPhotos} alt="Foto do pet" />
                            </div>

                            <div className="all-chat-details">
                                <div className="all-chat-topline">
                                    <h2>{c.petName}</h2>
                                    <span className="all-chat-status pending">{c.conversationState}</span>
                                </div>

                                <div className="all-chat-ownerline">
                                    <img className="all-chat-ownerImg" src={c.userPhoto} alt="Foto do owner" />
                                    <span className="all-chat-ownerName">{c.ownerName}</span>
                                </div>

                                <span className="all-chat-lastMessage">
                                    {`Ultima Mensagem Enviada: ${c.recentMessage}`}
                                </span>
                            </div>
                        </button>

                        {/* Right side meta + confirm */}
                        <div className="all-chats-container-end">
                            <div className="all-chat-metaRow">
                                <span className="all-chat-time">{`Mensagem Enviada às: ${c.recentMessageTime}`}</span>
                            </div>

                            {c.adoptionState && (
                                <button
                                    type="button"
                                    className="all-chat-confirm-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nav(String(c.adoptionLink));
                                    }}
                                >
                                    Ir para confirmação
                                </button>
                            )}
                        </div>
                    </div>
                ))}


                {/* Chat row (Read) */}
                {/* <button className="all-chats-container" type="button">
                    <div className="all-chat-petImg">
                        <img src={imgTest} alt="Foto do pet" />
                    </div>

                    <div className="all-chat-details">
                        <div className="all-chat-topline">
                            <h2>Outro Pet</h2>
                            <span className="all-chat-status accepted">Aceita</span>
                        </div>

                        <div className="all-chat-ownerline">
                            <img className="all-chat-ownerImg" src={imgTest} alt="Foto do owner" />
                            <span className="all-chat-ownerName">Outro usuário</span>
                        </div>

                        <span className="all-chat-lastMessage">
                            Última mensagem (lida) aparece aqui.
                        </span>
                    </div>

                    <div className="all-chats-container-end">
                        <div className="all-chat-metaRow">
                            <span className="all-chat-time">Ontem</span>
                            <span className="all-chat-unreadCount isHidden">0</span>
                        </div>
                    </div>
                </button> */}
            </div>
        </section>
    );
}

export default Chat;