import { toast } from "react-toastify"
import resendApiPrivate from "../components/reusable/resendApi"


export async function userProfileImage(token: string, img: {}, verifyToken: () => Promise<void>, setUserProfileImg: (value: React.SetStateAction<string>) => void, setLoadingUpload: (value: React.SetStateAction<boolean>) => void) {
    try {
        await toast.promise(
            resendApiPrivate({
                apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/profileImg`,
                options: { method: "POST", body: JSON.stringify(img) },
                token: String(token),
                verifyToken: verifyToken
            }).then((response) => {
                if (!response?.ok) {
                    throw new Error("Erro ao tentar fazer upload");
                }

                setUserProfileImg(response?.data)
                setLoadingUpload(false)
            }),
            {
                pending: {
                    render() {
                        return "Tentando fazer upload da foto de perfil...";
                    },
                },
                success: {
                    render() {
                        return "Perfil trocado com sucesso!";
                    },
                },
                error: {
                    render() {
                        return "Erro ao tentar fazer upload da foto de perfil";
                    },
                },
            }
        )
    } catch (e) {
        console.log(e)
        setLoadingUpload(false)
    }
}

export async function userBannerImage(token: string, img: {}, verifyToken: () => Promise<void>, setUserBanner: (value: React.SetStateAction<string>) => void, setLoadingUpload: (value: React.SetStateAction<boolean>) => void) {
    try {
        await toast.promise(
            resendApiPrivate({
                apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/banner`,
                options: { method: "POST", body: JSON.stringify(img) },
                token: String(token),
                verifyToken: verifyToken
            }).then((response) => {
                if (!response?.ok) {
                    throw new Error("Erro ao tentar fazer upload");
                }

                setUserBanner(response?.data)
                setLoadingUpload(false)
            }),
            {
                pending: {
                    render() {
                        return "Tentando fazer upload do banner...";
                    },
                },
                success: {
                    render() {
                        return "Banner trocado com sucesso!";
                    },
                },
                error: {
                    render() {
                        return "Erro ao tentar fazer upload do banner";
                    },
                },
            }
        )
    } catch (e) {
        console.log(e)
        setLoadingUpload(false)
    }
}