import { z } from "zod"

export const SettingsSchema = z.object({
    email: z.email().optional(),
    password: z.string().min(6, "minimo de 6 characteres").optional(),
    newPassword: z.string().min(6, "minimo de 6 characteres").optional(),
    phone: z.string().min(15, "numero invalido").max(15).optional(),
    cep: z.string().min(9, "cep invalido").max(9).optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional()
})

export const RegisterSchemaPart1 = z.object({
    email: z.email(),
}).loose()

export const RegisterSchemaPart2 = z.object({
    name: z.string().min(3),
    lastName: z.string().min(5),
    password: z.string().min(6),
    phone: z.string().max(15).optional(),
}).loose()

export const RegisterSchemaPart3 = z.object({
    cep: z.string().min(9).max(9).optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional()
}).loose()

const userFullSchema = RegisterSchemaPart1.extend(RegisterSchemaPart2.shape).extend(RegisterSchemaPart3.shape)

export type userFormFields = z.infer<typeof userFullSchema>


export const PetSchemaPart1 = z.object({
    //pet data
    name: z.string().min(2),
    breed: z.string().min(1, "Insira Algo"),
    type: z.string().min(1, "Insira Algo"),
    age: z.string().min(1, "Insira Algo"),
    details: z.string().min(255, "insira no minimo 255 characteres").max(600, "você excedeu o limite de 600 characteres"),
    gender: z.string().min(1, "Insira Algo"),
    wayOfLife: z.string().min(1, "Insira Algo"),
    image: z.instanceof(FileList).refine((files) => files.length > 0, "Insira pelo menos 1 foto"),

    // pet address
    cep: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
}).loose();

export const PetSchemaPart1Edited = z.object({
    //pet data
    name: z.string().min(2),
    breed: z.string().min(1, "Insira Algo"),
    type: z.string().min(1, "Insira Algo"),
    age: z.string().min(1, "Insira Algo"),
    details: z.string().min(255, "insira no minimo 255 characteres").max(600, "você excedeu o limite de 600 characteres"),
    gender: z.string().min(1, "Insira Algo"),
    wayOfLife: z.string().min(1, "Insira Algo"),
    image: z.instanceof(FileList).refine((files) => files.length > 0, "Insira pelo menos 1 foto"),

    // pet address
    cep: z.string().min(9, "Um cep tem 9 characteres").max(9),
    street: z.string().min(1, "insira o cep"),
    neighborhood: z.string().min(1, "insira o cep"),
    city: z.string().min(1, "insira o cep"),
    region: z.string().min(1, "insira o cep"),
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
    toy: z.string().min(1, "Insira Algo"),
    food: z.string().min(1, "Insira Algo"),
    playPlace: z.string().min(1, "Insira Algo"),
    sleepPlace: z.string().min(1, "Insira Algo"),
}).loose();

const PetFullSchema = PetSchemaPart1.extend(PetSchemaPart2.shape).extend(PetSchemaPart3.shape);
const PetFullSchemaEdited = PetSchemaPart1Edited.extend(PetSchemaPart2.shape).extend(PetSchemaPart3.shape);

export type FormFields = z.infer<typeof PetFullSchema>
export type FormFieldsEdited = z.infer<typeof PetFullSchemaEdited>