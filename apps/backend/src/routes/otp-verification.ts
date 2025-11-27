import { JWT_SECRET } from "@repo/common/schemas"
import prisma from "@repo/db/client"
import express, { Router } from "express"
import jwt from "jsonwebtoken"

export const otpRouter: Router = express.Router()

otpRouter.post("/verify/:userId", async (req, res) => {
  const { otp } = req.body
  const userId = Number(req.params.userId)
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if (!user) return res.status(404).json({ success: false, message: "user not found" })
    if (otp !== user.otp) return res.json({ success: false, message: "Incorrect otp, please check again" })
    if (new Date(user.otpExpiry) < new Date()) return res.json({ success: false, message: "otp has expired please generate new otp" })
    
    await prisma.user.update({
      where: {
        id : userId
      }, data: {
        isVerified: true
      }
    })  

    const token = jwt.sign({ userId }, JWT_SECRET)
    return res.json({
      success: true,
      token,
      message: "otp verified successfully"
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Error while verifying otp"
    })
  }
})
