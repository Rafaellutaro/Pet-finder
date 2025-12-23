import { z } from "zod"

export const SettingsSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    newPassword: z.string().min(6),
    phone: z.string().max(15),
    cep: z.string().min(8).max(8),
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    region: z.string()
})

export const RegisterSchema = z.object({
    name: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(6),
    phone: z.string().max(15),
    cep: z.string().min(8).max(8),
    street: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    region: z.string()
})


export const PetSchema = z.object({
    name: z.string(),
    breed: z.string(),
    type: z.string(),
    age: z.string(),
    details: z.string(),
    image: z.instanceof(FileList),

    cep: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
})