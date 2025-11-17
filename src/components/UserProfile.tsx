export interface UserProfileProps {
    nickname: string;
    gender: 'male' | 'female';
    profileImageUrl?: string;
    favStoreId: string[];
    address: string; // 주소 state 추가
    latitude: number; // 위도 state 추가
    longitude: number; // 경도 state 추가
    error?: string;
}