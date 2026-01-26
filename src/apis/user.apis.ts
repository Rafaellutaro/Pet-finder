import apiFetch from "../Interfaces/TokenAuthorization"


export async function userProfileImage(token: string, img: {}) {
    const response = await apiFetch(`http://localhost:3000/users/profileImg`, {
        method: "POST",
        body: JSON.stringify(img)
    }, String(token))

    return response
}

export async function userBannerImage(token: string, img: {}) {
    const response = await apiFetch(`http://localhost:3000/users/banner`, {
        method: "POST",
        body: JSON.stringify(img)
    }, String(token))

    return response
}