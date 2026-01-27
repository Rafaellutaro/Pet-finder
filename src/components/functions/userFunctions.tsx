import { Controller, type Control } from "react-hook-form";
import { PatternFormat } from 'react-number-format';
import type { userFormFields } from "../../Interfaces/zodSchema";

export function cepSearch(setValue: any, cep: string) {
    const cepDigits = (cep || "").replace(/\D/g, "");

    if (cepDigits.length < 8) {
        setValue("street", undefined);
        setValue("neighborhood", undefined);
        setValue("city", undefined);
        setValue("region", undefined);
    } else if (cepDigits.length == 8) {
        fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
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

type ControllerType = {
    control: Control<any>
}

export function UserCepController({ control }: ControllerType) {
    return (
        <Controller
            name="cep"
            control={control}
            render={({ field }) => (
                <PatternFormat
                    id="cep"
                    inputMode="numeric"
                    placeholder="99999-999"
                    format="#####-###"
                    mask="_"
                    value={field.value || undefined}
                    onValueChange={(vals) => {
                        if (!vals.value) {
                            field.onChange(undefined)
                            return
                        }

                        field.onChange(vals.formattedValue)
                    }
                    }
                />
            )}
        />
    )
}

export function UserPhoneController({ control }: ControllerType) {
    return (
        <Controller
            name="phone"
            control={control}
            render={({ field }) => (
                <PatternFormat
                    id="phone"
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    format="(##) #####-####"
                    mask="_"
                    value={field.value || undefined}
                    onValueChange={(vals) => {
                        if (!vals.value) {
                            field.onChange(undefined)
                            return
                        }

                        field.onChange(vals.formattedValue)
                    }}
                />
            )}
        />
    )
}

export function emptyToNull(value: string) {
    value == "" ? null : value;
    return value;
} 