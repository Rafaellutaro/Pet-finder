export interface UserData {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    profileImg: string;
    bannerImg: string;
    createdAt: Date;
    updatedAt: Date;
    addresses: any[];
    pets: any[];
    preferences: any[];
    views: any[];
    hearts: any[];
}