type notification = {
    userId: number,
    type: string,
    title: string,
    body: string,
    link: string
}

export async function createNotification({userId, type, title, body, link}: notification, prisma: any){
    try {
        const notification = await prisma.notification.create({
            data: { userId, type, title, body, link },
        })

        return notification
    } catch (e) {
        console.log(e)
        
    }
}