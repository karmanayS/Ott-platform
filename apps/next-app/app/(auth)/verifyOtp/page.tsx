"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
//import { toast } from "sonner"

export default function Verify() {
    const [value, setValue] = useState("")
    const router = useRouter()    

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Enter OTP</CardTitle>
                    <CardDescription>Enter the one-time password sent to your email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <InputOTP
                    maxLength={6}
                    value={value}
                    onChange={(value:string) => setValue(value)}
                    >
                        <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </CardContent>
                <CardFooter>
                    <Button onClick={async() => {
                        const userId = localStorage.getItem("userId")
                        const response = await axios.post(`http://localhost:3001/otp/verify/${userId}`,{
                            otp: value
                        })
                        if (!response.data.success) return //toast.error(response.data.message)
                        //toast.success(response.data.message)
                        router.push("/signin")
                    }} >Submit</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

