import { useEffect, useMemo, useState } from "react";
import { useUser } from "../Interfaces/GlobalUser";
import RegisterUserpart1 from "./forms/RegisterUser.part1";
import { useForm } from "react-hook-form";
import { RegisterSchemaPart1, RegisterSchemaPart2, RegisterSchemaPart3 } from "../Interfaces/zodSchema";
import type { userFormFields } from "../Interfaces/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterUserPart2 from "./forms/RegisterUser.part2";
import RegisterUserPart3 from "./forms/RegisterUser.part3";
import { cepSearch } from "./functions/userFunctions";
import { useNavigateWithFrom } from "./reusable/Redirect";
import { emptyToNull } from "./functions/userFunctions";

function RegisterPage() {
  const [formPart, setFormPart] = useState(1)
  const LoginPage = useNavigateWithFrom()

  // const { setUser, setToken, setLoggedIn } = useUser();

  const resolver = useMemo(() => {
    if (formPart == 1) return zodResolver(RegisterSchemaPart1);
    if (formPart == 2) return zodResolver(RegisterSchemaPart2);
    return zodResolver(RegisterSchemaPart3);
  }, [formPart]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting }
  } = useForm<userFormFields>({
    resolver: resolver as any,
    shouldUnregister: false
  });

  // const register = async (e: any) => {
  //   e.preventDefault();

  //   console.log("eu aqui")
  // }

  const handleGoogle = async (e: any) => {
    e.preventDefault();

    console.log("google aqui")
  }

  const onContinue = () => {
    setFormPart(i => i + 1);
    console.log(watch())
  };

  const onSubmit = async (data: any) => {
    const userData = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: emptyToNull(data.phone),
      password: data.password
    };

    const addressData = {
      cep: emptyToNull(data.cep),
      street: emptyToNull(data.street),
      neighborhood: emptyToNull(data.neighborhood),
      city: emptyToNull(data.city),
      region: emptyToNull(data.region)
    };

    const allUserData = { userData, addressData };
    console.log("Final payload:", allUserData);

    try {
      const res = await fetch('http://localhost:3000/users/insert', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(allUserData)
      });
      if (res.ok) {
        const result = await res.json();
        console.log("API result:", result);
        LoginPage("/Login")
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cep = watch("cep");
  useEffect(() => {
      cepSearch(setValue, String(cep));
  }, [cep]);

  return (
    <>
      {formPart == 1 && (
        <RegisterUserpart1 register={register} errors={errors} handleSubmit={handleSubmit} onContinue={onContinue} isSubmitting={isSubmitting} />
      )}

      {formPart == 2 && (
        <RegisterUserPart2 register={register} errors={errors} handleSubmit={handleSubmit} onContinue={onContinue} isSubmitting={isSubmitting} formPart={formPart} control={control} />
      )}

      {formPart == 3 && (
        <RegisterUserPart3 register={register} errors={errors} handleSubmit={handleSubmit} onSubmit={onSubmit} isSubmitting={isSubmitting} formPart={formPart} control={control} />
      )}
    </>
  )
}

export default RegisterPage;