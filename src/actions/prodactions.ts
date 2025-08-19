//@ts-nocheck
"use server";
import { generateToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function addProductToDb(data: {
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}) {
  try {
    const product = await prisma.product.create({
      data,
    });

    return { success: true, product };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, message: "Error adding product" };
  }
}

export async function deleteProductFromDb(id: string) {
  try {
    const data = await prismaClient.product.delete({
      where: {
        id: id,
      },
    });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateProductInDb(id: string, productData: any) {
  try {
    const product = await prismaClient.product.update({
      where: { id: id },
      data: productData,
    });
    return {
      success: true,
      data: product,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function signUpUser(data) {
  // const email = formData.get("email") as string;
  // const name = formData.get("name") as string;
  // const username = formData.get("username") as string;
  // const password = formData.get("password") as string;

  const user = {
    email: data.email,
    password: data.password,
    name: data.name,
    username: data.username,
  };
  try {
    const newUser = await prismaClient.user.create({
      data: user,
    });
    return {
      success: true,
      data: newUser,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function signInUser(data) {
  const user = await prismaClient.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "No user found",
    };
  }
  if (user.password != data.password) {
    return {
      success: false,
      message: "Invalid Credentials",
    };
  }
  const token = generateToken({
    id: user.id,
  });
  const cookie = await cookies();
  cookie.set("token", token);
  redirect("/");
  return {
    success: true,
    message: "user logged in successfully",
    data: user,
  };
}
export async function logOutUser() {
    const cookie = await cookies();
    if (cookie.get("token")) {
      cookie.delete("token");
      redirect("/login");
    } else {
      return {
        success: false,
        message: "No user is logged in",
      };
    }
  }


  export async function addProductToCart(productData: any) {
  try {
    const existingProduct = await prismaClient.cart.findUnique({
      where: {
        id: productData.id,
      },
    })

    if(existingProduct) {
      //update the quantity 
    } else{
    const product = await prismaClient.cart.create({
      data: productData,
    });
  }
    return {
      success: true,
      data: product,
    };
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: "Something wrong happened",
    };
  }
}

export async function deleteProductFromCart(id: string) {
  try {
    const data = await prismaClient.cart.delete({
      where: {
        id: id,
      },
    });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function updateQuantity(id: string , quantity: number) {
  try {
    const data = await prismaClient.cart.delete({
      where: {
        id: id,
      },
      data:{
        quantity
      }
    });
    return {
      success: true,
    };
  } catch (err) {
    console.log(err.message);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}