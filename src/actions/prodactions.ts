"use server";
import prismaClient from "@/services/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

// ==========================================================
// 📧 EMAIL HELPER (INTERNAL)
// ==========================================================
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Aurora Store" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

// ==========================================================
// 🛍️ PRODUCT ACTIONS (CRUD)
// ==========================================================

// 1. ADD NEW PRODUCT (Form Data Version)
export async function addNewProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized: Please login first" };

  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  if (!title || !price) return { success: false, message: "Missing required fields" };

  try {
    const product = await prismaClient.product.create({
      data: {
        title,
        price,
        category,
        description,
        thumbnail: image || "/placeholder.png",
        images: [image || "/placeholder.png"],
        ownerId: user.id,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/"); 
    
    // Return the new product so UI can update instantly
    return { success: true, newProduct: product }; 

  } catch (error: any) {
    console.error("Create Product Error:", error);
    return { success: false, message: "Failed to create product" };
  }
}

// 2. UPDATE PRODUCT
export async function updateProductInDb(data: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const existingProduct = await prismaClient.product.findUnique({
      where: { id: data.id },
    });

    if (!existingProduct) return { success: false, message: "Product not found" };
    
    if (existingProduct.ownerId !== user.id) {
        return { success: false, message: "You are not the owner of this product" };
    }

    await prismaClient.product.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        tags: data.tags || [],
        thumbnail: data.image_url,
        images: data.images || [data.image_url],
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

// 3. DELETE PRODUCT (With Full Cleanup)
export async function deleteProductFromDb(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) return { success: false, message: "Product not found" };

  if (product.ownerId !== user.id) {
    return { success: false, message: "You are not the owner!" };
  }

  try {
    // Transaction to delete everything related to this product
    await prismaClient.$transaction([
        // Delete Reviews
        prismaClient.review.deleteMany({
            where: { productId: id }
        }),
        // Delete from Carts
        prismaClient.cart.deleteMany({
            where: { productId: id }
        }),
        // Delete from Wishlists
        prismaClient.wishlist.deleteMany({
            where: { productId: id }
        }),
        // Finally Delete Product
        prismaClient.product.delete({
            where: { id }
        })
    ]);

    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("Delete Error:", err);
    return { success: false, message: "Failed to delete item: " + err.message };
  }
}

// 4. ADD PRODUCT (Legacy JSON Version)
export async function addProductToDb(data: any) {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Login required" };

    try {
      const product = await prismaClient.product.create({
        data: {
          title: data.title,
          description: data.description,
          price: parseFloat(data.price),
          category: data.category,
          thumbnail: data.image_url || "/placeholder.png",
          images: data.images || [],
          tags: data.tags || [],
          ownerId: user.id,
        },
      });
      revalidatePath("/");
      return { success: true, product };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
}

// ==========================================================
// 🛒 CART ACTIONS
// ==========================================================

export async function addProductToCart(productData: any) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please login to add items to cart" };

  try {
    const prodId = String(productData.id);
    const existingItem = await prismaClient.cart.findFirst({
      where: { userId: user.id, productId: prodId },
    });

    if (existingItem) {
      await prismaClient.cart.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      await prismaClient.cart.create({
        data: {
          userId: user.id,
          productId: prodId,
          title: productData.title,
          description: productData.description || "",
          price: parseFloat(productData.price),
          image_url: productData.thumbnail || "",
          quantity: 1,
        },
      });
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function updateQuantity(id: string, quantity: number) {
  if (quantity < 1) {
      return deleteProductFromCart(id);
  }
  await prismaClient.cart.update({ where: { id }, data: { quantity } });
  revalidatePath("/cart");
  return { success: true };
}

export async function deleteProductFromCart(id: string) {
  await prismaClient.cart.delete({ where: { id } });
  revalidatePath("/cart");
  return { success: true };
}

export async function clearCartInDb() {
  const user = await getCurrentUser();
  if (user) {
    await prismaClient.cart.deleteMany({ where: { userId: user.id } });
  }
  revalidatePath("/cart");
  return { success: true };
}

// ==========================================================
// 💳 ORDER ACTIONS (With Email Integration)
// ==========================================================

export async function placeOrder(formData: any, paymentId?: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Login required" };

  try {
    // 1. Fetch Cart Items
    const cartItems = await prismaClient.cart.findMany({ where: { userId: user.id } });
    if (cartItems.length === 0) return { success: false, message: "Cart is empty" };

    // 2. Calculate Total
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 3. Create Order in Database
    const order = await prismaClient.order.create({
      data: {
        userId: user.id,
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        totalAmount: total,
        status: paymentId ? "Paid" : "Processing",
        paymentId: paymentId || null,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          })),
        },
      },
    });

    // 4. Send Confirmation Email
    if (user.email) {
      console.log("Attempting to send email to:", user.email);
      
      await sendEmail(
        user.email,
        "Order Confirmed - AURORA",
        `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000; letter-spacing: -1px;">AURORA.</h1>
          <p style="color: #333; font-size: 16px;">Hi ${user.name || "Customer"},</p>
          <p style="color: #555;">Thank you for shopping with us! Your order has been placed successfully.</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order.id.slice(-6).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${total}</p>
            <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${paymentId ? "Paid Online" : "Processing"}</p>
          </div>

          <br/>
          <p style="color: #888; font-size: 12px; text-align: center;">© 2024 Aurora Store. Defining Luxury.</p>
        </div>
        `
      );
    }

    // 5. Clear Cart
    await prismaClient.cart.deleteMany({ where: { userId: user.id } });
    
    revalidatePath("/orders"); 
    revalidatePath("/cart");
    
    return { success: true, orderId: order.id };

  } catch (err: any) {
    console.error("Order Failed:", err);
    return { success: false, message: err.message };
  }
}

// ==========================================================
// 👤 AUTH & PROFILE ACTIONS
// ==========================================================

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}

export async function deleteAccount() {
  return deleteUserAccount();
}

export async function deleteUserAccount() {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Not logged in" };

  try {
    const userOrders = await prismaClient.order.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    const orderIds = userOrders.map((o) => o.id);

    await prismaClient.$transaction([
      prismaClient.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }),
      prismaClient.order.deleteMany({ where: { userId: user.id } }),
      prismaClient.cart.deleteMany({ where: { userId: user.id } }),
      prismaClient.wishlist.deleteMany({ where: { userId: user.id } }),
      prismaClient.product.deleteMany({ where: { ownerId: user.id } }),
      prismaClient.user.delete({ where: { id: user.id } }),
    ]);

    const cookieStore = await cookies();
    cookieStore.delete("token");
    return { success: true };
  } catch (err: any) {
    console.error("Delete Account Error:", err);
    return { success: false, message: err.message };
  }
}

// ==========================================================
// ❤️ WISHLIST ACTIONS
// ==========================================================

export async function toggleWishlist(product: any) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Login required" };

  try {
    const prodId = String(product.id);
    const existing = await prismaClient.wishlist.findFirst({
      where: { userId: user.id, productId: prodId },
    });

    if (existing) {
      await prismaClient.wishlist.delete({ where: { id: existing.id } });
      revalidatePath("/");
      return { success: true, action: "removed" };
    } else {
      await prismaClient.wishlist.create({
        data: {
          userId: user.id,
          productId: prodId,
          title: product.title,
          price: parseFloat(product.price),
          image_url:
            product.thumbnail || product.image_url || "",
        },
      });
      revalidatePath("/");
      return { success: true, action: "added" };
    }
  } catch (err) {
    return { success: false, message: "Failed" };
  }
}

export async function getWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];
  return await prismaClient.wishlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

// ==========================================================
// ⭐ REVIEW ACTIONS
// ==========================================================

export async function addReview(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please login to review" };

  const productId = formData.get("productId") as string;
  const comment = formData.get("comment") as string;
  const rating = parseInt(formData.get("rating") as string);

  if (!comment || !rating) return { success: false, message: "All fields required" };

  try {
    // 1. Check Product in DB
    let product = await prismaClient.product.findUnique({ where: { id: productId } });

    // 2. If API Product, Create in DB
    if (!product) {
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!res.ok) return { success: false, message: "Product not found" };
        const apiData = await res.json();
        product = await prismaClient.product.create({
            data: {
                id: productId,
                title: apiData.title,
                description: apiData.description,
                price: apiData.price,
                category: apiData.category,
                thumbnail: apiData.thumbnail,
                images: apiData.images || [],
                ownerId: null 
            }
        });
    }

    // 3. Prevent Self Review
    if (product.ownerId && product.ownerId === user.id) {
        return { success: false, message: "Cannot review own product." };
    }

    // 4. Check Duplicate
    const existing = await prismaClient.review.findFirst({
        where: { userId: user.id, productId: productId }
    });

    if(existing) return { success: false, message: "Already reviewed" };

    // 5. Create Review
    const newReview = await prismaClient.review.create({
      data: {
        userId: user.id,
        productId: productId,
        rating: rating,
        comment: comment
      },
      include: {
        user: { select: { name: true } }
      }
    });

    revalidatePath(`/product/${productId}`);
    return { success: true, newReview };

  } catch (err: any) {
    if(err.code === 'P2002' || err.message.includes("Malformed")) {
         return { success: false, message: "Reviews disabled for this item." };
    }
    return { success: false, message: err.message };
  }
}