import apiFetch from "../../Interfaces/TokenAuthorization";

type resendApiType = {
    apiUrl: string
    options: any
    token: string
    verifyToken: () => Promise<void>
}

export default async function resendApiPrivate({ apiUrl, options, token, verifyToken }: resendApiType) {
    try {
        const response = await apiFetch(apiUrl,
            options
            , token)
        
        if (response.ok) {
            const data = await response.json()
            return {
                data: data.data,
                ok: true,
                status: data.status
            }
        }
        
        const newToken = await verifyToken()

        const newResponse = await apiFetch(apiUrl,
            options
            , String(newToken))
            
        if (newResponse.ok) {
            const data = await newResponse.json()
            return {
                data: data.data,
                ok: true,
                status: data.status
            }
        }else if (!newResponse.ok){
            const data = await newResponse.json()
            return {
                message: data.message,
                ok: false,
                status: data.status
            }
        }
    } catch (e) {
        console.log(e)
    }

}

