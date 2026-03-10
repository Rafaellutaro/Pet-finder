const apiFetch = async (url: string, options: any = {}, accessToken: string) => {

  return fetch(url, {
    ...options,
    ...options.credentials,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      ...options.headers,
    },
    ...options.body
  });
};

export default apiFetch;
