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
            return data.data
        }
        
        const newToken = await verifyToken()

        const newResponse = await apiFetch(apiUrl,
            options
            , String(newToken))
            
        if (newResponse.ok) {
            const data = await newResponse.json()
            return data.data
        }else if (!newResponse.ok){
            const data = await response.json()
            return data.message
        }
    } catch (e) {
        console.log(e)
    }

}

