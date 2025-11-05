export async function geoCodeAddress(address: string) {
  const url = `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-ncp-apigw-api-key-id': import.meta.env.VITE_NAVER_MAP_CLIENT_ID,
      'x-ncp-apigw-api-key': import.meta.env.VITE_NAVER_MAP_CLIENT_SECRET,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Geocoding API 요청 실패');
  }

  const data = await response.json();

  if (data.addresses && data.addresses.length > 0) {
    return data.addresses;
  } else {
    return [];
  }
}