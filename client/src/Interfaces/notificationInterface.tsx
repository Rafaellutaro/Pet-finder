export interface NotificationItem {
    id: string | number;
    title: string;
    body: string;
    date: string;
    icon: React.ReactNode;
    isRead: boolean;
    link: string;
    type?: "";
};