import prismaClient from "./prisma";

export async function seedDB() {
  try{
    const res = await fetch("https://dummyjson.com/products/?limit=194");
  const data = await res.json();
  const Dummyproduct = data.products;

  //@ts-ignore
  const filteredProducts = Dummyproduct.map((p) => {
    return {
      title: p.title,
      description: p.description,
      brand: p.brand || null,
      category: p.category,
      price: p.price,
      originalPrice: p.price / (1 - p.discountPercentage / 100),
      discountPercentage: p.discountPercentage,
      rating: p.rating,
      availabilityStatus: p.stock > 0 ? "In Stock" : "Out of Stock",
      tags: p.tags || [],
      thumbnail: p.thumbnail,
    };
  });

  await prismaClient.products.createMany({data: filteredProducts});
  console.log("Database seeded successfully with Dummy JSON data.");
  }
  catch (error) {
    console.error("Error seeding database:", error);
  }
}
