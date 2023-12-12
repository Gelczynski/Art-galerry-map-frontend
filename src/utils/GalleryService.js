const API = "http://192.168.0.137:1337/api";

export const getAllGalleries = async () => {
  const response = await fetch(`${API}/galleries`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 1f354051d002d1dbc055a3e116ef3e654a51051ba8e69ac124d9334119a3df9397eab5325792a305ed75b0a7f79c2cbc17db466403b88f77535213c2bf0ff52503a0b9ad7a3f0243c6a3a9ac7853f4e7f57a15f32b5c13ebc6cea2ee1fb7490bde2657bed2fd1934f89872af1b27370c9ee7de91fe73222c15a7cbe27bd88d0e`,
    },
  });

  return response;
};

export const getMyVisitedGalleries = async (username) => {
  const response = await fetch(
    `${API}/user-visits?filters[username][$eq]=${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 1f354051d002d1dbc055a3e116ef3e654a51051ba8e69ac124d9334119a3df9397eab5325792a305ed75b0a7f79c2cbc17db466403b88f77535213c2bf0ff52503a0b9ad7a3f0243c6a3a9ac7853f4e7f57a15f32b5c13ebc6cea2ee1fb7490bde2657bed2fd1934f89872af1b27370c9ee7de91fe73222c15a7cbe27bd88d0e`,
      },
    }
  );

  return response;
};

export const setGalleryAsVisited = async (username, galleryId) => {
  const galId = String(galleryId);
  const visit = {
    username,
    galleryId: galId,
  };
  const response = await fetch(`${API}/user-visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 1f354051d002d1dbc055a3e116ef3e654a51051ba8e69ac124d9334119a3df9397eab5325792a305ed75b0a7f79c2cbc17db466403b88f77535213c2bf0ff52503a0b9ad7a3f0243c6a3a9ac7853f4e7f57a15f32b5c13ebc6cea2ee1fb7490bde2657bed2fd1934f89872af1b27370c9ee7de91fe73222c15a7cbe27bd88d0e`,
    },
    body: JSON.stringify({ data: visit }),
  });

  return response;
};
