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
    let icon: any = null

    const data = await resendApiPrivate({ apiUrl: `${import.meta.env.VITE_SERVER_URL}/notifications/unread`, options: { method: "GET" }, token: String(token), verifyToken: verifyToken });

    if (!data?.ok) return

    const mapped: NotificationItem[] = data?.data?.map((n: any) => ({

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

export async function setAsRead(token: string, verifyToken: () => Promise<void>, id: string, setNotification: React.Dispatch<React.SetStateAction<NotificationItem[]>>) {
    const data = await resendApiPrivate({ apiUrl: `${import.meta.env.VITE_SERVER_URL}/notifications/${id}/setAsRead`, options: { method: "PUT" }, token: String(token), verifyToken: verifyToken });

    if (!data?.ok) return

    setNotification((prev: any) => {
        return prev.filter((n: any) => String(n.id) !== String(data?.data?.id));
    });
}

export async function setAllAsRead(token: string, verifyToken: () => Promise<void>, setNotification: React.Dispatch<React.SetStateAction<NotificationItem[]>>) {
    const data = await resendApiPrivate({ apiUrl: `${import.meta.env.VITE_SERVER_URL}/notifications/setAllAsRead`, options: { method: "PUT" }, token: String(token), verifyToken: verifyToken });

    if (!data?.ok) return
    setNotification([])
}