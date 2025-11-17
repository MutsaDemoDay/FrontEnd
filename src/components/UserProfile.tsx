export interface UserProfileProps {
    nickname: string;
    gender: 'male' | 'female';
    profileImageUrl?: string;
    regularShopAddresses: string[];
    error?: string;
}