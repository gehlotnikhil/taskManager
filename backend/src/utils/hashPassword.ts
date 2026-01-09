import bcrypt from "bcrypt"

export default async function hashPassword(password){
    const saltRound = 10;
    return await bcrypt.hash(password,saltRound)
}