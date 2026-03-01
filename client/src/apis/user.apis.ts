import resendApiPrivate from "../components/reusable/resendApi"


export async function userProfileImage(token: string, img: {}, verifyToken: () => Promise<void>) {
    const response = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/profileImg`, 
        options: {method: "POST", body: JSON.stringify(img)}, 
        token: String(token), 
        verifyToken: verifyToken})

    return response
}

export async function userBannerImage(token: string, img: {}, verifyToken: () => Promise<void>) {
    const response = await resendApiPrivate({
        apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/banner`, 
        options: {method: "POST",  body: JSON.stringify(img)}, 
        token: String(token), 
        verifyToken: verifyToken})

    return response
}