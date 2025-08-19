const products = [
  {
    id: 1,
    title: "Essence Mascara Lash Princess",
    description:
      "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    rating: 2.56,
    price: 9.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  },
  {
    id: 2,
    title: "Eyeshadow Palette with Mirror",
    description:
      "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
    rating: 2.86,
    price: 19.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
  },
  {
    id: 3,
    title: "Powder Canister",
    description:
      "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
    rating: 4.64,
    price: 14.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
  },
  {
    id: 4,
    title: "Red Lipstick",
    description:
      "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
    rating: 4.36,
    price: 12.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
  },
  {
    id: 5,
    title: "Red Nail Polish",
    description:
      "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
    rating: 4.32,
    price: 8.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
  },
  {
    id: 6,
    title: "Calvin Klein CK One",
    description:
      "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
    rating: 4.37,
    price: 49.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
  },
  {
    id: 7,
    title: "Chanel Coco Noir Eau De",
    description:
      "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
    rating: 4.26,
    price: 129.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
  },
  {
    id: 8,
    title: "Dior J'adore",
    description:
      "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
    rating: 3.8,
    price: 89.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
  },
  {
    id: 9,
    title: "Dolce Shine Eau de",
    description:
      "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
    rating: 3.96,
    price: 69.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
  },
  {
    id: 10,
    title: "Gucci Bloom Eau de",
    description:
      "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
    rating: 2.74,
    price: 79.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
  },
  {
    id: 11,
    title: "Annibale Colombo Bed",
    description:
      "The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.",
    rating: 4.77,
    price: 1899.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
  },
  {
    id: 12,
    title: "Annibale Colombo Sofa",
    description:
      "The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.",
    rating: 3.92,
    price: 2499.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
  },
  {
    id: 13,
    title: "Bedside Table African Cherry",
    description:
      "The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.",
    rating: 2.87,
    price: 299.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
  },
  {
    id: 14,
    title: "Knoll Saarinen Executive Conference Chair",
    description:
      "The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.",
    rating: 4.88,
    price: 499.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
  },
  {
    id: 15,
    title: "Wooden Bathroom Sink With Mirror",
    description:
      "The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.",
    rating: 3.59,
    price: 799.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
  },
  {
    id: 16,
    title: "Apple",
    description:
      "Fresh and crisp apples, perfect for snacking or incorporating into various recipes.",
    rating: 4.19,
    price: 1.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
  },
  {
    id: 17,
    title: "Beef Steak",
    description:
      "High-quality beef steak, great for grilling or cooking to your preferred level of doneness.",
    rating: 4.47,
    price: 12.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
  },
  {
    id: 18,
    title: "Cat Food",
    description:
      "Nutritious cat food formulated to meet the dietary needs of your feline friend.",
    rating: 3.13,
    price: 8.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
  },
  {
    id: 19,
    title: "Chicken Meat",
    description:
      "Fresh and tender chicken meat, suitable for various culinary preparations.",
    rating: 3.19,
    price: 9.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
  },
  {
    id: 20,
    title: "Cooking Oil",
    description:
      "Versatile cooking oil suitable for frying, sautéing, and various culinary applications.",
    rating: 4.8,
    price: 4.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
  },
  {
    id: 21,
    title: "Cucumber",
    description:
      "Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.",
    rating: 4.07,
    price: 1.49,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
  },
  {
    id: 22,
    title: "Dog Food",
    description:
      "Specially formulated dog food designed to provide essential nutrients for your canine companion.",
    rating: 4.55,
    price: 10.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
  },
  {
    id: 23,
    title: "Eggs",
    description:
      "Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.",
    rating: 2.53,
    price: 2.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
  },
  {
    id: 24,
    title: "Fish Steak",
    description:
      "Quality fish steak, suitable for grilling, baking, or pan-searing.",
    rating: 3.78,
    price: 14.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
  },
  {
    id: 25,
    title: "Green Bell Pepper",
    description:
      "Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.",
    rating: 3.25,
    price: 1.29,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
  },
  {
    id: 26,
    title: "Green Chili Pepper",
    description:
      "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
    rating: 3.66,
    price: 0.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
  },
  {
    id: 27,
    title: "Honey Jar",
    description:
      "Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.",
    rating: 3.97,
    price: 6.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
  },
  {
    id: 28,
    title: "Ice Cream",
    description:
      "Creamy and delicious ice cream, available in various flavors for a delightful treat.",
    rating: 3.39,
    price: 5.49,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
  },
  {
    id: 29,
    title: "Juice",
    description:
      "Refreshing fruit juice, packed with vitamins and great for staying hydrated.",
    rating: 3.94,
    price: 3.99,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
  },
  {
    id: 30,
    title: "Kiwi",
    description:
      "Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.",
    rating: 4.93,
    price: 2.49,
    thumbnail:
      "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
  },
];

export default products;