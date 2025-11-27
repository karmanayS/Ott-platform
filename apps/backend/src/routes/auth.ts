import express, { Router } from "express"
import { JWT_SECRET, signinSchema, signupSchema } from "@repo/common/schemas"
import prisma from "@repo/db/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "@repo/email/email";

export const authRouter: Router = express.Router()

authRouter.post("/signup", async (req, res) => {
  const { username, email, password } = req.body
  const result = signupSchema.safeParse({
    username, email, password
  })
  if (!result.success) return res.status(403).json({
    success: false,
    message: "invalid input"
  })
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiryDate = new Date()
    otpExpiryDate.setHours(otpExpiryDate.getHours() + 1)

    if (user) {
      if (user.isVerified) return res.status(409).json({
        success: false,
        message: "verified user already exists"
      })
      await prisma.user.update({
        where: {
          email
        }, data: {
          username,
          password: hashedPassword,
          otp,
          otpExpiry: otpExpiryDate
        }
      })

      //send email with otp
      const emailResponse = await sendEmail(otp, result.data.email, "SIGNUP")
      if (!emailResponse.success) {
        return res.status(403).json({
          success: false,
          message: "error while sending mail"
        })
      }
      return res.json({
        success: true,
        message: "Sent verification email",
        userId: user.id
      })
    }
    const newUser = await prisma.user.create({
      data: {
        username, email,
        password: hashedPassword,
        otp,
        otpExpiry: otpExpiryDate
      }
    })

    //send email with otp
    const emailResponse = await sendEmail(otp, result.data.email, "SIGNUP")

    if (!emailResponse.success) {
      return res.status(403).json({
        success: false,
        message: "error while sending mail"
      })
    }
    return res.json({
      success: true,
      message: "Sent verification email",
      userId: newUser.id
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Error while signing up"
    })
  }

})

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body
  const result = signinSchema.safeParse({
    email, password
  })
  if (!result.success) return res.status(403).json({
    success: false,
    message: "Invalid inputs"
  })
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) return res.json({
      success: false,
      message: "User not found"
    })
    const isValid = bcrypt.compare(password,user.password)
    if (!isValid) return res.json({success:false,message: "Incorrect password"})
    if (!user.isVerified) return res.json({
      success: false,
      message: "User is not verified, please signup"
    })
    const token = jwt.sign({ userId: user.id }, JWT_SECRET)
    res.json({
      success: true,
      token,
      message: "Signed in successfully"
    })
  } catch (err) {
    console.log(err)
    return res.json({
      success: false,
      message: "Error while signing in"
    })
  }
})
