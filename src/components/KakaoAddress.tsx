export interface KakaoAddress {
  address_name: string; // 전체 주소
  address_type: string; // 주소 타입 (도로명, 지번 등)
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_3depth_h_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
    // ... 추가 필드
  } | null;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_3depth_h_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
    // ... 추가 필드
  } | null;
}

