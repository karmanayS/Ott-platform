import express from "express";
import cors from "cors";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";
import { otpRouter } from "./routes/otp-verification";

const app = express();
app.use(express.json());
app.use(cors())

app.use("/admin",adminRouter)
app.use("/auth",authRouter)
app.use("/otp",otpRouter)


app.listen(3000, () => {
  console.log("server running on port 3000");
});
