import prisma from "../lib/prisma";
import { verifyToken } from "../middlewares/authMiddleware";
import { comparePassword } from "../utils/comparePassword";
import {
  generateRandomCode,
  generateExpiryOfOtp,
  generateJwtToken,
} from "../utils/generateToken";
import hashPassword from "../utils/hashPassword";
import { sendEmails } from "../utils/sendEmail";
interface RegisterUserInterface {
  name: string;
  email: string;
  password: string;
  otpCode?: string;
  expiryOfOtp?: Date;
}

export async function registerUser(data) {
  const { name, email, password } = data;

  // check if email exist or not
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  console.log("existingUser-", existingUser);

  if (existingUser) {
    if (existingUser.emailVerified === false) {
      if (existingUser.expiryOfOtp > new Date()) {
        // const hpassword = await hashPassword(password);
        // existingUser.password = hpassword
        // await prisma.user.update({
        //   data: { ...existingUser },
        //   where: {email:existingUser.email}
        // })

        throw new Error("OTP Already Sended on Email");
      } else {
        await prisma.user.delete({ where: { email } });
      }
    } else {
      throw new Error("Email already registered");
    }
  }

  //   hash password
  const hashedPassword = await hashPassword(password);
  const otpCode = generateRandomCode(2);
  const user: RegisterUserInterface = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      expiryOfOtp: generateExpiryOfOtp(),
      otpCode,
    },
  });
  const subject = "Email Verification Code";
  const body = `OTP: ${otpCode}`;

  await sendEmails([email], subject, body);

  delete user.password;

  return user;
}

export async function loginUser(email, password) {
  // find user email
  console.log("a1")
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invaild email or password");
  }
  if (user.emailVerified == false) {
    throw new Error("Email is not Verified");
  }
  console.log("a2")
  
  // compoare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invaild email or password");
  }
  
  console.log("a3")
  // Remove password from response
  const { password: _, ...cleanUser } = user;
  
  console.log("a4-",user)
  console.log("a4.2-")
  const payload = {
    id:user.id
  }
  const token = generateJwtToken(payload)
  console.log("a5-",token)
  return {
    user: cleanUser,
    token:token
  };
}

export async function verifycode(email:string,otpCode: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email");
  }
  if(user.emailVerified){
    throw new Error("Email already verified");
  }
  

  // Compare OTP
  if (user.otpCode !== otpCode) {
    throw new Error("Wrong OTP");
  }

  // Optional: Check OTP Expiry
  if (user.expiryOfOtp && new Date() > new Date(user.expiryOfOtp)) {
    console.log(
      new Date(),
      " - ",
      new Date(user.expiryOfOtp),
      " - ",
      new Date() > new Date(user.expiryOfOtp)
    );
    throw new Error("OTP expired");
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
      isActive: true,
      otpCode: null,
      expiryOfOtp: null,
    },
  });
  const payload = {
    id:updatedUser.id
  }
  const token = generateJwtToken(payload)

  return { user: updatedUser,token: token };
}

export async function verifytoken(id: string) {
 
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  if (!user) {
    throw new Error("Invalid token - user not found");
  }
  delete user.password
  return { user };
}
