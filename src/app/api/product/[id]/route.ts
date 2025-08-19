// import prismaClient from "@/services/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req : NextRequest,{params} : {params :{id : string}}) {
//     const id = params.id;

//     if(!id){
//         return NextResponse.json({
//             sucess : false,
//             message : "no id provided"
//         })
//     }
//     const product = await prismaClient.product.findUnique({
//         where : {
//             id
//         }
        
//     })
//     return NextResponse.json({
//         success : true,
//         data : product
//     })
// }









import prismaClient from "@/services/prisma";
import { NextResponse } from "next/server";

// GET single product
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const product = await prismaClient.product.findUnique({
      where: { id }, // UUID string
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("GET Product Error:", err);
    return NextResponse.json({ message: "Error fetching product" }, { status: 500 });
  }
}

