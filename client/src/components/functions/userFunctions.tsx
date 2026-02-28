import { Controller, type Control } from "react-hook-form";
import { PatternFormat } from 'react-number-format';

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

export function emptyToNullObject<T extends Record<string, any>>(values: T) {
    console.log("aqui")
    return Object.fromEntries(
        Object.entries(values).map(([k, v]) => [
            k,
            v == "" ? null : v,
        ])
    ) as {
            [K in keyof T]: T[K] | null;
        };
}

export function parseBRDateTime(dateStr: string, timeStr: string): Date | null {
  const [dd, mm, yyyy] = dateStr.split("/").map(Number);
  const [hh, min] = timeStr.split(":").map(Number);

  if (yyyy < 1900 || yyyy > 2100) return null;
  if (mm < 1 || mm > 12) return null;
  if (hh < 0 || hh > 23) return null;
  if (min < 0 || min > 59) return null;

  const d = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);

  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) return null;

  return d;
}

export function isWithinNextDays(target: Date, days: number) {
  const now = new Date();
  const max = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return target >= now && target <= max;
}

