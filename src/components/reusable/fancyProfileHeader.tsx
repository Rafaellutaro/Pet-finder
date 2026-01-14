import type { UserData } from "../../Interfaces/GlobalUser";

const bannerUrl = 'https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg'

interface User {
    user: UserData
}

function FancyHeader({user}: User) {
    const complete_name: string = `${user!.name} ${user!.lastName}`

    return (
        <div className="profile-header">
                <div className="profile-banner" style={{backgroundImage: `url(${bannerUrl})`}}></div>
                
                <div className="profile-content">
                    <div className="avatar-wrapper">
                        <img
                            className="profile-avatar"
                            src="https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg"
                            alt="profile avatar"
                        />
                    </div>

                    <div className="name-header">
                        {/* I cant add sensitive data here on the public version, i need to create different versions (memo) */}
                        <p className="profile-name">{complete_name}</p>
                        <p className="profile-info">{user!.email}</p>
                        <p className="profile-info">{user!.phone}</p>
                    </div>
                </div>
            </div>
    )
}

export default FancyHeader;