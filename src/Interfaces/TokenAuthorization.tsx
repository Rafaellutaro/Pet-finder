const apiFetch = async (url: string, options: any = {}, accessToken: string) => {

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      ...options.headers
    }
  });
};

export default apiFetch;
