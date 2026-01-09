import bcrypt from "bcrypt"

export async function comparePassword(plain,hashed){
    return await bcrypt.compare(plain,hashed);
}