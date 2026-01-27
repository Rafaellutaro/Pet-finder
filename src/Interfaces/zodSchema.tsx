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

export const RegisterSchemaPart1 = z.object({
    email: z.email(),
}).loose()

export const RegisterSchemaPart2 = z.object({
    name: z.string().min(3),
    lastName: z.string().min(5),
    password: z.string().min(6),
    phone: z.string().max(12).regex(/^[0-9]{10,15}$/).or(z.literal("")).optional(),
}).loose()

export const RegisterSchemaPart3 = z.object({
    cep: z.string().regex(/^[0-9]{8}$/).min(8).max(8).or(z.literal("")).optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional()
}).loose()

const userFullSchema = RegisterSchemaPart1.extend(RegisterSchemaPart2.shape).extend(RegisterSchemaPart3.shape)

export type userFormFields = z.infer<typeof userFullSchema>


export const PetSchemaPart1 = z.object({
    //pet data
    name: z.string(),
    breed: z.string(),
    type: z.string(),
    age: z.string(),
    details: z.string(),
    gender: z.string(),
    wayOfLife: z.string(),
    image: z.instanceof(FileList),

    // pet address
    cep: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
}).loose();

export const PetSchemaPart2 = z.object({
    // personality
    friendly: z.number().min(0).max(100),
    energetic: z.number().min(0).max(100),
    smart: z.number().min(0).max(100),
    playful: z.number().min(0).max(100),
    loyal: z.number().min(0).max(100),
}).loose();

export const PetSchemaPart3 = z.object({
    // favorite stuff
    toy: z.string().nonempty(),
    food: z.string().nonempty(),
    playPlace: z.string().nonempty(),
    sleepPlace: z.string().nonempty(),
}).loose();

const PetFullSchema = PetSchemaPart1.extend(PetSchemaPart2.shape).extend(PetSchemaPart3.shape);

export type FormFields = z.infer<typeof PetFullSchema>