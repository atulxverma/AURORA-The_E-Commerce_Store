"use server";
import prismaClient from "@/services/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==========================================
// PRODUCT ACTIONS (CRUD)
// ==========================================

// 1. ADD NEW PRODUCT (Updated for Profile Modal)
export async function addNewProduct(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const title = formData.get("title") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;

  if (!title || !price) return { success: false, message: "Missing fields" };

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
    
    // *** IMPORTANT: Return the new product so UI can update instantly ***
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

    if (!existingProduct) return { success: false, message: "Not found" };
    if (existingProduct.ownerId !== user.id)
      return { success: false, message: "Not allowed" };

    // Update Logic
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

// 3. DELETE PRODUCT
export async function deleteProductFromDb(id: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const product = await prismaClient.product.findUnique({ where: { id } });
  if (!product) return { success: false, message: "Not found" };

  if (product.ownerId !== user.id) {
    return { success: false, message: "You are not the owner!" };
  }

  try {
    // 1. Clean up Cart
    await prismaClient.cart.deleteMany({
      where: {
        productId: id,
      },
    });

    // 2. Delete Product
    await prismaClient.product.delete({ where: { id } });

    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("Delete Error:", err);
    return { success: false, message: "Failed to delete item" };
  }
}

// 4. ADD PRODUCT (Legacy JSON - Keeping for safety)
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

// ==========================================
// CART & ORDER ACTIONS
// ==========================================

export async function addProductToCart(productData: any) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please login" };

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
  if (quantity < 1) return deleteProductFromCart(id);
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

export async function placeOrder(formData: any) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Login required" };

  try {
    const cartItems = await prismaClient.cart.findMany({
      where: { userId: user.id },
    });

    if (cartItems.length === 0) {
      return { success: false, message: "Cart empty" };
    }

    const total = cartItems.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );

    const order = await prismaClient.order.create({
      data: {
        userId: user.id,
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
        totalAmount: total,
        status: "Processing",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url,
          })),
        },
      },
    });

    await prismaClient.cart.deleteMany({ where: { userId: user.id } });
    revalidatePath("/orders");
    revalidatePath("/cart");

    return { success: true, orderId: order.id };
  } catch (err: any) {
    console.error("Order Error:", err);
    return { success: false, message: "Failed to place order: " + err.message };
  }
}

// ==========================================
// PROFILE & AUTH ACTIONS
// ==========================================

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

// ==========================================
// REVIEW ACTIONS (UPDATED FOR INSTANT UI)
// ==========================================


export async function addReview(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please login to review" };

  const productId = formData.get("productId") as string;
  const comment = formData.get("comment") as string;
  const rating = parseInt(formData.get("rating") as string);

  if (!comment || !rating) return { success: false, message: "All fields required" };

  try {
    // 1. Pehle check karo product DB me hai ya nahi
    let product = await prismaClient.product.findUnique({ where: { id: productId } });

    // --- IF PRODUCT NOT IN DB (API PRODUCT) ---
    if (!product) {
        // Fetch details from API
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!res.ok) return { success: false, message: "Product not found" };
        
        const apiData = await res.json();

        // Save API product to our DB (Taaki hum uspe review laga sakein)
        product = await prismaClient.product.create({
            data: {
                id: productId, // IMPORTANT: Use same ID from API
                title: apiData.title,
                description: apiData.description,
                price: apiData.price,
                category: apiData.category,
                thumbnail: apiData.thumbnail,
                images: apiData.images || [],
                // OwnerId null rakhenge kyunki ye system product hai
                ownerId: null 
            }
        });
    }

    // 2. Self Review Check (Sirf agar owner exist karta ho)
    if (product.ownerId && product.ownerId === user.id) {
        return { success: false, message: "You cannot review your own product." };
    }

    // 3. Check Duplicate Review
    const existing = await prismaClient.review.findFirst({
        where: { userId: user.id, productId: productId }
    });

    if(existing) return { success: false, message: "You already reviewed this item" };

    // 4. Create Review
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
    console.error("Review Error:", err);
    // Agar ID format MongoDB jaisa nahi hai (API IDs alag hoti hain kabhi kabhi)
    if(err.code === 'P2002' || err.message.includes("Malformed ObjectID")) {
         return { success: false, message: "System products cannot be reviewed yet." };
    }
    return { success: false, message: err.message };
  }
}