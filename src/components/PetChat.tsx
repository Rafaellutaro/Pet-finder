import "../assets/css/PetChat.css"
import { useParams } from "react-router-dom";
import resendApiPrivate from "./reusable/resendApi";
import { useUser } from "../Interfaces/GlobalUser";
import { useEffect, useState } from "react";
import Loader from "./reusable/Loader";
import useRedirect from "./reusable/Redirect";
import type { singleChatInterface } from "../Interfaces/chatInterface";
import { RejectedChat, WorkingChat } from "./reusable/ChatModifications";

function PetChat() {
  const { token, verifyToken, user, socket } = useUser()
  const { id } = useParams()
  const [alldata, setAlldata] = useState<singleChatInterface | null>(null)
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState<any[]>([])

  const backRedirect = useRedirect()

  const getData = async () => {
    const response = await resendApiPrivate({
      apiUrl: `http://localhost:3000/chat/conversation/${id}`,
      options: { method: "GET" },
      token: String(token),
      verifyToken: verifyToken
    })

    if (!response) return backRedirect()
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

    if (!response) return backRedirect()
    return response
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

    const handleConversationStatus = (payload: { conversationId: Number; status: string }) => {
      if (payload.conversationId !== Number(id)) return;

      setAlldata((prev: any) => ({
        ...prev,
        conversationStatus: payload.status,
      }));
    }

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:status", handleConversationStatus)

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:status", handleConversationStatus)
      socket.emit("conversation:leave", { conversationId: id });
    };
  }, [socket, id]);

  if (!alldata) return <Loader />

  return (
    <>
      {alldata.conversationStatus == "PENDING" && (
        <WorkingChat
          token={String(token)}
          verifyToken={verifyToken}
          alldata={alldata}
          user={user}
          setMessage={setMessage}
          setAlldata={setAlldata}
          message={message}
          allMessages={allMessages}
          id={Number(id)} />
      )}

      {alldata.conversationStatus == "ACCEPTED" && (
        <WorkingChat
          token={String(token)}
          verifyToken={verifyToken}
          alldata={alldata}
          user={user}
          setMessage={setMessage}
          setAlldata={setAlldata}
          message={message}
          allMessages={allMessages}
          id={Number(id)} />
      )}

      {alldata.conversationStatus == "DECLINED" && (
        <RejectedChat
          alldata={alldata}
          allMessages={allMessages}
          user={user} />
      )}
    </>
  )
}

export default PetChat;