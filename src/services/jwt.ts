//@ts-nocheck
import jwt from 'jsonwebtoken'

// npm i --save-dev @types/jsonwebtoken

export function generateToken(data){
    //@ts-ignore
    const token = jwt.sign(data, process.env.JWT_SECRET, )
    return token;
}

export function verifyToken(token: string) {
    //@ts-ignore
  const data = jwt.verify(token, process.env.JWT_SECRET);
  return data;
}