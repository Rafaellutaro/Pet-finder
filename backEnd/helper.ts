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