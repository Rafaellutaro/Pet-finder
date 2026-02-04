import { IoChatboxOutline } from "react-icons/io5";
import type { NotificationItem } from "../../Interfaces/notificationInterface";
import { BsChatSquareText } from "react-icons/bs";
import resendApiPrivate from "./resendApi";

export function onSocketNotification(n: any, setNotification: React.Dispatch<React.SetStateAction<NotificationItem[]>>) {
    let icon

    { n.type == "chat_created" ? icon = <IoChatboxOutline /> : <BsChatSquareText /> }

    const date = new Date(n.createdAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    const item: NotificationItem = {
        id: n.id,
        title: n.title,
        body: n.body,
        date: date,
        icon: icon,
        isRead: n.isRead,
        link: n.link,
        type: n.type,
    };

    setNotification((prev: any) => {
        if (prev.some((p: any) => p.id == item.id)) return prev;
        return [item, ...prev];
    });
}

export async function loadUnread(setNotification: React.Dispatch<React.SetStateAction<NotificationItem[]>>, token: string, verifyToken: () => Promise<void>) {
    let icon: any

    const data = await resendApiPrivate({ apiUrl: "http://localhost:3000/notifications/unread", options: { method: "GET" }, token: String(token), verifyToken: verifyToken });

    const mapped: NotificationItem[] = data.map((n: any) => ({

        id: n.id,
        title: n.title,
        body: n.body,
        date: new Date(n.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        }),
        icon: n.type == "chat_created" ? icon = <IoChatboxOutline /> : <BsChatSquareText /> ,
        isRead: n.isRead,
        link: n.link,
        type: n.type,
    }));

    setNotification(mapped);
}

export async function setAsRead(token: string, verifyToken: () => Promise<void>, id: string) {
    const data = await resendApiPrivate({ apiUrl: `http://localhost:3000/notifications/${id}/setAsRead`, options: { method: "PUT" }, token: String(token), verifyToken: verifyToken });

    console.log("setAsRead", data)
}