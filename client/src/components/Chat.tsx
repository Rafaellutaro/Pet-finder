import { CiSearch } from "react-icons/ci";
import "../assets/css/Chat.css";
import { useEffect, useMemo, useState } from "react";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import type { chatInterface } from "../Interfaces/chatInterface";
import bannerDFT from "../assets/imgs/bannerDFT.png";
import { useNavigateWithFrom } from "./reusable/Redirect";
import Loader from "./reusable/Loader";
import noData from "../assets/imgs/noData.png";

type ConversationFilter = "ALL" | "PENDING" | "ACCEPTED" | "DECLINED";

function Chat() {
    const { token, verifyToken } = useUser();
    const [allChatsData, setAllChatsData] = useState<chatInterface[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState<ConversationFilter>("ALL");
    const [search, setSearch] = useState("");
    const nav = useNavigateWithFrom();

    const languageMap: Record<string, string> = {
        PENDING: "Pendente",
        ACCEPTED: "Aceita",
        DECLINED: "Rejeitada",
    };

    const statusClassMap: Record<string, string> = {
        PENDING: "pending",
        ACCEPTED: "accepted",
        DECLINED: "rejected",
    };

    const getAllChats = async () => {
        setIsLoading(true);

        const response = await resendApiPrivate({
            apiUrl: `${import.meta.env.VITE_SERVER_URL}/chat/allConversation`,
            options: { method: "GET" },
            token: String(token),
            verifyToken,
        });

        if (!response?.ok) return;

        setAllChatsData(response.data ?? [])

        setIsLoading(false);
    };

    useEffect(() => {
        if (!token) return;

        getAllChats();
    }, [token]);

    const normalized = useMemo(() => {
        return allChatsData.map((c) => {
            const content = c.lastMessage?.content?.trim();
            const sentMessageTime = c.lastMessage?.createdAt;

            const rawStatus = c.conversationStatus;
            const label = languageMap[rawStatus] ?? rawStatus;
            const statusClass = statusClassMap[rawStatus] ?? "pending";

            return {
                conversationId: c.id,
                petName: c.pet.name,
                conversationState: label,
                rawStatus,
                statusClass,
                ownerName: `${c.userOwner.name} ${c.userOwner.lastName}`,
                recentMessage: content ? content : "Nenhuma",
                recentMessageTime: sentMessageTime
                    ? new Date(sentMessageTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    : "Não há data",
                petPhotos: c.pet?.imgs?.[0]?.url,
                userPhoto: c.userOwner.profileImg ? c.userOwner.profileImg : bannerDFT,
                adoptionLink: c.adoptionProcess?.id ? `/PetAdoption/${c.adoptionProcess?.id}` : null,
                adoptionState: c.adoptionProcess?.step ?? null,
            };
        });
    }, [allChatsData]);

    const filteredChats = useMemo(() => {
        const q = search.trim().toLowerCase();

        const byState =
            conversationState == "ALL"
                ? normalized
                : normalized.filter((c) => c.rawStatus == conversationState);

        if (!q) return byState;

        return byState.filter((c) => {
            return (
                c.petName.toLowerCase().includes(q) ||
                c.ownerName.toLowerCase().includes(q) ||
                c.recentMessage.toLowerCase().includes(q)
            );
        });
    }, [normalized, conversationState, search]);

    if (isLoading) return <Loader />;

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="search-filters" role="tablist" aria-label="Filtros de conversas">
                    <button
                        className={`allBtn ${conversationState === "ALL" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setConversationState("ALL")}
                    >
                        Todas
                    </button>

                    <button
                        className={`pendingBtn ${conversationState === "PENDING" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setConversationState("PENDING")}
                    >
                        Pendente
                    </button>

                    <button
                        className={`acceptedBtn ${conversationState === "ACCEPTED" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setConversationState("ACCEPTED")}
                    >
                        Aceitas
                    </button>

                    <button
                        className={`rejectedBtn ${conversationState === "DECLINED" ? "isActive" : ""}`}
                        type="button"
                        onClick={() => setConversationState("DECLINED")}
                    >
                        Rejeitadas
                    </button>
                </div>
            </div>

            <div className="all-chats-list">
                {filteredChats.length > 0 ? (
                    filteredChats.map((c) => (
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
                                        <span className={`all-chat-status ${c.statusClass}`}>{c.conversationState}</span>
                                    </div>

                                    <div className="all-chat-ownerline">
                                        <img className="all-chat-ownerImg" src={c.userPhoto} alt="Foto do owner" />
                                        <span className="all-chat-ownerName">{c.ownerName}</span>
                                    </div>

                                    <span className="all-chat-lastMessage">{`Ultima Mensagem Enviada: ${c.recentMessage}`}</span>
                                </div>
                            </button>

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
                    ))
                ) : (
                    <div className="no-data-box">
                        <img src={noData} className="no-data" alt="No data" />
                    </div>
                )}
            </div>
        </section>
    );
}

export default Chat;