type notification = {
    userId: number,
    type: string,
    title: string,
    body: string,
    link: string
}

export async function createNotification({ userId, type, title, body, link }: notification, prisma: any) {
    try {
        const notification = await prisma.notification.create({
            data: { userId, type, title, body, link },
        })

        return notification
    } catch (e) {
        console.log(e)

    }
}

export async function isUserAllowedInAdoptionProcess(userId: number, prisma: any) {
    const isUserAllowed = await prisma.adoptionProcess.findFirst({
        where: {
            OR: [{ ownerId: userId }, { adopterId: userId }]
        },
        select: { id: true }
    })

    return isUserAllowed
}

export async function verifyUserInConversation(id: number, prisma: any) {
    try {
        const verify = await prisma.conversation.findUnique({
            where: {
                id: id
            },
            select: {
                ownerId: true,
                adopterId: true,
            }
        })

        return verify
    } catch (e) {
        console.log(e)
    }
}

export function maskEmail(email: string) {
    const [name, domain] = email.split("@");
    return name[0] + "***@" + domain;
}

export function maskPhone(phone: string) {
    return phone.slice(0, 2) + "****" + phone.slice(-2);
}

export function parseBRDateTime(dateStr: string, timeStr: string): Date | null {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    const [hh, min] = timeStr.split(":").map(Number);

    if (!dd || !mm || !yyyy || !hh || min == undefined) return null;
    if (yyyy < 1900 || yyyy > 2100) return null;
    if (mm < 1 || mm > 12) return null;
    if (hh < 0 || hh > 23) return null;
    if (min < 0 || min > 59) return null;

    const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);

    if (
        d.getFullYear() !== yyyy ||
        d.getMonth() !== mm - 1 ||
        d.getDate() !== dd
    ) return null;

    return d;
}
