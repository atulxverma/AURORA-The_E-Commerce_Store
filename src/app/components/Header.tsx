// //@ts-nocheck
// 'use client';

// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import AddProdButton from './add-prod-button';
// import EditProdButton from './edit-prod-button';
// import products from '../constants/data';

// interface Product {
//   id: number;
//   title: string;
// }

// export default function Header() {
//   const [userInput, setUserInput] = useState('');
//   const [suggestions, setSuggestions] = useState([]);

//   function handleChange(event) {
//     setUserInput(event.target.value);
//   }

//   useEffect(() => {
//     async function getProds() {
//       if (userInput.trim().length === 0) {
//         setSuggestions([]);
//         return;
//       }

//       try {
//         const response = await fetch('https://dummyjson.com/products');
//         const data = await response.json();
//         const products = data.products;

//         const filteredSuggestions = products.filter((item) =>
//           item.title.toLowerCase().includes(userInput.toLowerCase())
//         );

//         setSuggestions(filteredSuggestions.slice(0, 10));
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//         setSuggestions([]);
//       }
//     }

//     getProds();
//   }, [userInput]);

//   return (
//     <div className="bg-gray-300 w-full p-6 relative z-50">
//       <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//         <Link href="/">
//           <h1 className="font-bold text-black text-2xl">E-commerce App</h1>
//         </Link>

//         <div className="relative w-full sm:w-[400px] mt-4 sm:mt-0">
//           <form action="/search" method="GET" className="flex">
//             <input
//               value={userInput}
//               onChange={handleChange}
//               type="text"
//               placeholder="Search products..."
//               name="q"
//               required
//               className="border rounded-l-md px-4 h-12 w-full"
//             />
//             <button className="bg-blue-700 px-4 text-white rounded-r-md">
//               Search
//             </button>
//           </form>

//           {suggestions.length > 0 && (
//             <ul className="absolute top-14 left-0 w-full bg-white border rounded-md shadow z-50 max-h-[300px] overflow-y-auto">
//               {suggestions.map((item) => (
//                 <li key={item.id} className="border-b hover:bg-gray-100">
//                   <Link
//                     href={`/product/${item.id}`}
//                     className="block px-4 py-2 text-sm text-gray-800"
//                   >
//                     {item.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <AddProdButton/>
//         <div className="flex gap-6 mt-4 sm:mt-0">
//           <Link href="/login">
//           <button className="border border-black px-3 py-2 rounded cursor-pointer hover:bg-gray-100">Login</button>
//           </Link>
//           <Link href="/cart">
//             <span className="text-lg font-medium text-blue-800">Cart</span>
//           </Link>
//         </div>
//       </header>
//     </div>
//   );
// }







//@ts-nocheck
'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import AddProdButton from './add-prod-button';

export default function Header() {
  const [userInput, setUserInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cartItems, setCartItems] = useState(0); // dynamic cart
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // Search suggestions
  useEffect(() => {
    async function getSuggestions() {
      if (!userInput.trim()) return setSuggestions([]);

      try {
        const res = await fetch('https://dummyjson.com/products');
        const data = await res.json();
        const filtered = data.products.filter((p: any) =>
          p.title.toLowerCase().includes(userInput.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 8));
      } catch {
        setSuggestions([]);
      }
    }
    getSuggestions();
  }, [userInput]);

  // Load cart items from localStorage (example)
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) setCartItems(JSON.parse(storedCart).length);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        <Link href="/" className="flex items-center gap-2">
          <img src="https://static.vecteezy.com/system/resources/previews/020/716/096/original/e-commers-logo-design-template-free-vector.jpg" alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold text-blue-700 hover:text-blue-900 transition">
            E-Commerce
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 flex-1 ml-8">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <form action="/search" method="GET">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
                <input
                  type="text"
                  placeholder="Search products..."
                  name="q"
                  value={userInput}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 p-2 flex items-center justify-center hover:bg-blue-700 transition"
                >
                  <FiSearch size={20} color="white" />
                </button>
              </div>
            </form>

            {suggestions.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto z-50">
                {suggestions.map((item: any) => (
                  <li
                    key={item.id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <Link href={`/product/${item.id}`} className="flex-1">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <AddProdButton>
            <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 transition cursor-pointer">
              <AiOutlinePlusCircle size={18} />
              <span className="font-medium text-sm">Add Product</span>
            </div>
          </AddProdButton>

          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-blue-700 hover:text-blue-900 transition"
          >
            <FiShoppingCart size={22} />
            <span className="text-sm font-medium">Cart</span>
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>

          <Link href="/login">
            <div className="flex items-center gap-1 border px-3 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
              <FiUser size={18} />
              <span className="font-medium text-sm">Login</span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            {mobileMenu ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-4 bg-white border-t shadow-md">
          <form action="/search" method="GET">
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
              <input
                type="text"
                placeholder="Search products..."
                name="q"
                value={userInput}
                onChange={handleChange}
                className="flex-1 px-4 py-2 focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 p-2 flex items-center justify-center hover:bg-blue-700 transition"
              >
                <FiSearch size={20} color="white" />
              </button>
            </div>
          </form>

          <AddProdButton>
            <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 transition cursor-pointer">
              <AiOutlinePlusCircle size={18} /> Add Product
            </div>
          </AddProdButton>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-blue-700 hover:text-blue-900 transition"
          >
            <FiShoppingCart size={22} /> Cart
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>

          <Link href="/login" className="flex items-center gap-2 border px-3 py-2 rounded-full hover:bg-gray-100 transition">
            <FiUser size={18} /> Login
          </Link>
        </div>
      )}
    </header>
  );
}

