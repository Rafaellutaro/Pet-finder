import { CiSearch } from "react-icons/ci";
import "../assets/css/Chat.css"

const imgTest = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1770660942218_2026-01-21T19-35-18.jpg"

function Chat() {
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

        <button className="allBtn isActive" type="button">
          Todas
        </button>
        <button className="pendingBtn" type="button">
          Pendente
        </button>
        <button className="acceptedBtn" type="button">
          Aceitas
        </button>
        <button className="rejectedBtn" type="button">
          Rejeitadas
        </button>
      </div>

      <div className="all-chats-list">
        {/* Chat row (Unread) */}
        <button className="all-chats-container isUnread" type="button">
          <div className="all-chat-petImg">
            <img src={imgTest} alt="Foto do pet" />
          </div>

          <div className="all-chat-details">
            <div className="all-chat-topline">
              <h2>Nome do Pet</h2>
              <span className="all-chat-status pending">Pendente</span>
            </div>

            <div className="all-chat-ownerline">
              <img className="all-chat-ownerImg" src={imgTest} alt="Foto do owner" />
              <span className="all-chat-ownerName">Nome do owner</span>
            </div>

            <span className="all-chat-lastMessage">
              Mensagem mais recente aparecendo aqui… (preview curto)
            </span>
          </div>

          <div className="all-chats-container-end">
            {/* NEW: horizontal meta row */}
            <div className="all-chat-metaRow">
              <span className="all-chat-time">12:44</span>
              <span className="all-chat-unreadCount">2</span>
            </div>
          </div>
        </button>

        {/* Chat row (Read) */}
        <button className="all-chats-container" type="button">
          <div className="all-chat-petImg">
            <img src="" alt="Foto do pet" />
          </div>

          <div className="all-chat-details">
            <div className="all-chat-topline">
              <h2>Outro Pet</h2>
              <span className="all-chat-status accepted">Aceita</span>
            </div>

            <div className="all-chat-ownerline">
              <img className="all-chat-ownerImg" src="" alt="Foto do owner" />
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
        </button>
      </div>
    </section>
  );
}

export default Chat;