import { useRef, useState } from "react";
import type { UserData } from '../../Interfaces/userInterface'
import SupabaseUpload from "./SupabaseUpload";
import apiFetch from "../../Interfaces/TokenAuthorization";
import { useUser } from "../../Interfaces/GlobalUser";
import Loader from "./Loader";
import "../../assets/css/Profile.css"
import bannerDFT from "../../assets/imgs/bannerDFT.png"

interface User {
    user: UserData
}

function FancyHeader({ user }: User) {
    const complete_name: string = `${user!.name} ${user!.lastName}`
    const fileBannerRef = useRef<HTMLInputElement>(null);
    const fileProfileRef = useRef<HTMLInputElement>(null);
    const { verifyToken } = useUser()
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [userBanner, setUserBanner] = useState(user.bannerImg)
    const [userProfileImg, setUserProfileImg] = useState(user.profileImg)

    {userBanner ? user.bannerImg : setUserBanner(bannerDFT)}
    {userProfileImg ? user.profileImg : setUserProfileImg(bannerDFT)}

    const handleBannerChange = async (e: any) => {
        console.log("banner change")
        setLoadingUpload(true)
        const file = e.target.files[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;

        const imageUrl = await SupabaseUpload({ fileName: fileName, file: file, bucketName: "users", })
        const token = await verifyToken()

        const img = {
            url: imageUrl
        }

        const response = await apiFetch(`http://localhost:3000/users/banner`, {
            method: "POST",
            body: JSON.stringify(img)
        }, String(token))

        const res = await response.json()

        setLoadingUpload(false)
        setUserBanner(res.data.bannerImg)

        console.log(res)

    };

    const handleProfileImgChange = async (e: any) => {
        console.log("profile change")
        setLoadingUpload(true)
        const file = e.target.files[0];
        if (!file) return;

        const fileName = `${Date.now()}_${file.name}`;

        const imageUrl = await SupabaseUpload({ fileName: fileName, file: file, bucketName: "users", })
        const token = await verifyToken()

        const img = {
            url: imageUrl
        }

        const response = await apiFetch(`http://localhost:3000/users/profileImg`, {
            method: "POST",
            body: JSON.stringify(img)
        }, String(token))

        const res = await response.json()

        setLoadingUpload(false)
        setUserProfileImg(res.data.profileImg)

        console.log(res)

    };

    return (
        <div className="ProfilePage-mainContainer">
            <div className="profile-header-li">

                {/* Banner */}
                {loadingUpload == false ? (
                    <div
                        className="profile-banner"
                        style={{ backgroundImage: `url(${userBanner})` }}
                        onClick={() => fileBannerRef.current?.click()}
                    >
                        <input
                            ref={fileBannerRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleBannerChange}
                            onAbort={() => setLoadingUpload(false)}
                        />
                    </div>
                ) : <Loader />}



                {/* Info bar */}
                <div className="profile-infoBar">
                    <div className="profile-infoInner">
                        <div className="name-header">
                            <p className="profile-name">{complete_name}</p>
                            <p className="profile-info">{user?.email}</p>
                            <p className="profile-info">{user?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Overlapping avatar */}
                <div className="profile-avatarSlot" onClick={() => fileProfileRef.current?.click()}>
                    <img className="profile-avatar" src={userProfileImg} alt="profile avatar"/>

                    <input
                            ref={fileProfileRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleProfileImgChange}
                            onAbort={() => setLoadingUpload(false)}
                        />
                </div>

            </div>
        </div>
    );


}

export default FancyHeader;