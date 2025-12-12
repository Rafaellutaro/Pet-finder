export function cepSearch(setValue: any, cep: string) {
    if (cep.length < 8) {
        setValue("street", "");
        setValue("neighborhood", "");
        setValue("city", "");
        setValue("region", "");
    } else if (cep.length == 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.erro) {
                setValue("street", data.logradouro);
                setValue("neighborhood", data.bairro);
                setValue("city", data.localidade);
                setValue("region", data.uf);
            }
        });
    }
}

export async function getUserLanguage() {
    try {
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      const region = data.region;
      
      return region

    } catch (error) {
      console.error("Error fetching IP info:", error);
    }
  }