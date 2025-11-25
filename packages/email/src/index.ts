import { Resend } from "resend"
import 'dotenv/config'

//TODO:figure out how to handle .env's in turborepo and place process.env here
const resend = new Resend("re_LfGxDFEq_79BSVJkCn9EwAL6PsBRfbdqd");

/*
//TODO: use this enum inthe sendEmail function 
enum emailTypes {
  SIGNUP
}
 * */


export async function sendEmail(otp: string, sendTo: string, type: string) {

  const { data, error } = await resend.emails.send({
    from: 'Nagmani <nagmani@email.nagmaniupadhyay.com.np>',
    to: [sendTo],
    subject: "signup OTP",
    html: `<strong>Thanks for signing up this is your otp: ${otp}</strong>`
  });

  if (error) {
    console.log(error);
    return {
      success: false,
      message: "error sending email"
    };
  }

  return {
    success: true,
    message: "sent email successfully"
  }


}
