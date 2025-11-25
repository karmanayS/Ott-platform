import express from "express";
import prisma from "@repo/db/client";

const app = express();
app.use(express.json());


app.listen(3000, () => {
  console.log("server running on port 3000");
});
