//@ts-nocheck
import { redirect } from 'next/navigation';
import React from 'react'
import { verifyToken } from '@/services/jwt'; 
import prismaClient from '@/services/prisma';

export default async function page() {

    const cookie= await cookies();
    if(!cookie.get('token')?.value) {
        redirect('/login');
        const data = verifyToken(cookie.get('token'));
    }
    let data;
    try{
        data = verifyToken(cookie.get('token')?.value);
    } catch (error) {
        redirect('/login');
    }
    const user = await prismaClient.user.findUnique({
        where: {
            id: data.id,
        },
        omit : {
            password: true,
        }
    });
    if (!user) {
        redirect('/login');
    }
    if (user.email !== data.email) {
        redirect('/login');
    }

  return (
    <div>
        {user?.name}
        {user?.email}
    </div>
  )
}
