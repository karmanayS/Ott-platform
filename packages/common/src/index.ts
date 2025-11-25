import * as z from "zod"

export const signupSchema = z.object({
    username: z.string().min(4,{error: "Username should be atleast 4 charachters long"}),
    email: z.email(),
    password: z.string().min(6,{error: "Password should be atleast 6 charachters long"})
})

export const signinSchema = z.object({
    email : z.email(),
    password: z.string().min(6,{error: "Password should be atleast 6 charachters long"})
})

export const JWT_SECRET = "SECRET"