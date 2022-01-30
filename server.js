import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is working");
});
app.post("/api/register", async (req, res) => {
  if (req.body.name === "")
    return res.json({ status: "error", error: "Please insert a valid name" });
  if (req.body.email === "")
    return res.json({ status: "error", error: "Please insert a valid email" });
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password,
    });
    return res.json({ status: "ok" });
  } catch (error) {
    return res.json({ status: "error", error: "Duplicate email" });
  }
});
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    return res.json({ status: "error", error: "Invalid login details" });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (user) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "physics007#"
    );
    return res.json({ status: "ok", user: token, name: user.name });
  } else {
    return res.json({ status: "error", user: false });
  }
});
// app.post("/api/calc", async (req, res) => {
//   console.log(req.body);
//   if (req.body.formData.rent_request === "") {
//     return res.json({
//       status: "error",
//       error: "Please enter a valid rent amount",
//     });
//   }
//   if (req.body.formData.monthly_plan === "") {
//     return res.json({
//       status: "error",
//       error: "Please enter a monthly plan",
//     });
//   }
//   if (
//     req.body.formData.monthly_plan !== "" &&
//     req.body.formData.rent_request !== "" &&
//     req.body.formData.monthly_salary !== ""
//   ) {
//     return res.json({
//       status: "ok",
//       success: "Congratulations, you're good to go",
//     });
//   }

//   const value =
//     (Number(req.body.formData.rent_request) +
//       0.02 * Number(req.body.formData.rent_request)) /
//     5;
//   return res.json({
//     status: "ok",
//     value: value,
//   });

//   //   const token = req.headers["x-access-token"];
//   //   try {
//   //     const decoded = jwt.verify(token, "physics007#");
//   //     const email = decoded.email;
//   //     const user = await User.updateOne(
//   //       { email: email },
//   //       { $set: { quote: req.body.quote } }
//   //     );
//   //     return res.json({ status: "ok" });
//   //   } catch (error) {
//   //     console.log(error);
//   //     return res.json({ status: "error", error: "Invalid Token" });
//   //   }
// });
app.post("/api/submit", async (req, res) => {
  if (req.body.formData.rent_request === "") {
    return res.json({
      status: "error",
      error: "Please enter a valid rent amount",
    });
  }
  if (req.body.formData.monthly_plan === "") {
    return res.json({
      status: "error",
      error: "Please select your preferred monthly plan",
    });
  }
  if (req.body.formData.monthly_salary === "") {
    return res.json({
      status: "error",
      error: "Please enter your monthly salary",
    });
  }
  if (
    req.body.formData.monthly_plan !== "" &&
    req.body.formData.rent_request !== "" &&
    req.body.formData.monthly_salary !== ""
  ) {
    return res.json({
      status: "ok",
      success: "Congratulations, your rent has been approved.",
    });
  }
});
// app.get("/api/quote", async (req, res) => {
//   const token = req.headers["x-access-token"];
//   try {
//     const decoded = jwt.verify(token, "physics007#");
//     const email = decoded.email;
//     const user = await User.findOne({ email: email });
//     return res.json({ status: "ok", quote: user.quote });
//   } catch (error) {
//     console.log(error);
//     return res.json({ status: "error", error: "Invalid Token" });
//   }
// });

// app.post("/api/quote", async (req, res) => {
//   const token = req.headers["x-access-token"];
//   try {
//     const decoded = jwt.verify(token, "physics007#");
//     const email = decoded.email;
//     const user = await User.updateOne(
//       { email: email },
//       { $set: { quote: req.body.quote } }
//     );
//     return res.json({ status: "ok" });
//   } catch (error) {
//     console.log(error);
//     return res.json({ status: "error", error: "Invalid Token" });
//   }
// });

const PORT = process.env.PORT || 5000;
const MODE = process.env.MODE;
mongoose
  .connect(process.env.CONNECTION_URL_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server is runnning on Port: ${PORT}`);
      console.log("mongodb connected");
    })
  )
  .catch((error) => console.log(error.message));
// app.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}, in ${MODE} Mode`);
// });
