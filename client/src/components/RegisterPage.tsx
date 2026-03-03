import { useEffect, useMemo, useState } from "react";
import RegisterUserpart1 from "./forms/RegisterUser.part1";
import { useForm } from "react-hook-form";
import { RegisterSchemaPart1, RegisterSchemaPart2, RegisterSchemaPart3, RegisterSchemaPart4 } from "../Interfaces/zodSchema";
import type { userFormFields } from "../Interfaces/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterUserPart2 from "./forms/RegisterUser.part2";
import RegisterUserPart3 from "./forms/RegisterUser.part3";
import { cepSearch } from "./functions/userFunctions";
import { useNavigateWithFrom } from "./reusable/Redirect";
import { emptyToNull } from "./functions/userFunctions";
import VerifyEmailCode from "./forms/VerifyEmailCode";
import catDog from "../assets/imgs/catDog.png"

function RegisterPage() {
  const [formPart, setFormPart] = useState(1)
  const LoginPage = useNavigateWithFrom()

  // const { setUser, setToken, setLoggedIn } = useUser();

  const subtitle = formPart == 1 ? "Digite seu e-mail para receber um código de confirmação." : formPart == 3 ? "Digite seus dados pessoais" : formPart == 4 ? "Endereço (opcional)" : "Confirme o seu email"

  const resolver = useMemo(() => {
    if (formPart == 1) return zodResolver(RegisterSchemaPart1);
    if (formPart == 2) return zodResolver(RegisterSchemaPart2);
    if (formPart == 3) return zodResolver(RegisterSchemaPart3);
    return zodResolver(RegisterSchemaPart4);
  }, [formPart]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
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

    return alert("Em Desenvolvimento")
  }

  const onContinue = async () => {
    if (formPart == 1){
      const email = {
        email: getValues("email")
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/createEmailCode`, {
          method: "POST",
          headers: {
                    'content-type': 'application/json',
                },
          body: JSON.stringify(email)
        })

        if (!res.ok) return

        const data = await res.json();

        console.log(data)
      } catch (e) {
        console.log(e)
      }
    }

    setFormPart(i => i + 1);
  };

  const verifyCode = async () => {
    const email = getValues("email")
    const code = getValues("code")

    const payload = {
      email: email,
      code: code
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/verifyEmailCode`, {
          method: "POST",
          headers: {
                    'content-type': 'application/json',
                },
          body: JSON.stringify(payload)
        })

      if (!res.ok) return

      const data = await res.json()
      
      if (data.data == true){
        setFormPart(i => i + 1);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = async (data: userFormFields) => {
    const userData = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: emptyToNull(String(data.phone)),
      password: data.password
    };

    const addressData = {
      cep: emptyToNull(String(data.cep)),
      street: emptyToNull(String(data.street)),
      neighborhood: emptyToNull(String(data.neighborhood)),
      city: emptyToNull(String(data.city)),
      region: emptyToNull(String(data.region)).toUpperCase() ?? null
    };

    const allUserData = { userData, addressData };

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/insert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(allUserData)
      });
      if (res.ok) {
        const result = await res.json();
        if (!result) return
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
      <section className="register-page">
        <div className="register-card">
          <div className="register-left" aria-hidden="true">
            <img className="register-image" src={catDog} alt="" />
            <div className="register-imageOverlay" />
          </div>

          <div className="register-right">

            <div className="register-header">
              <h1 className="register-title">Criar conta</h1>
              <p className="register-subtitle">{subtitle}</p>
              <div className="register-step">Passo {formPart} de 4</div>
            </div>

            {formPart == 1 && (
              <RegisterUserpart1 
              register={register} 
              errors={errors} 
              handleSubmit={handleSubmit} 
              onContinue={onContinue} 
              isSubmitting={isSubmitting} 
              handlegoogle={handleGoogle} />
            )}

            {formPart == 2 && (
              <VerifyEmailCode 
              watch={watch}
              handleSubmit={handleSubmit} 
              getValues={getValues} 
              verifyCode={verifyCode}
              control={control}
              setFormPart={setFormPart}
              />
            )}

            {formPart == 3 && (
              <RegisterUserPart2 
              register={register} 
              errors={errors} 
              handleSubmit={handleSubmit} 
              onContinue={onContinue} 
              isSubmitting={isSubmitting} 
              control={control} />
            )}

            {formPart == 4 && (
              <RegisterUserPart3 
              register={register} 
              errors={errors} 
              handleSubmit={handleSubmit} 
              onSubmit={onSubmit} 
              isSubmitting={isSubmitting} 
              control={control} />
            )}

          </div>
        </div>
      </section>
    </>
  )
}

export default RegisterPage;