// "use client";

// import React, { useState } from 'react';
// import Header from '../components/Header';
// import { useSearchParams, useRouter } from 'next/navigation';

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const searchParams = useSearchParams();
//   const searchTerm = searchParams.get('q') || '';
//   const minAm = searchParams.get('min') || '';
//   const maxAm = searchParams.get('max') || '';

//   const [min, setMin] = useState(minAm);
//   const [max, setMax] = useState(maxAm);

//   const router = useRouter();

//   function handleMin(event: React.ChangeEvent<HTMLInputElement>) {
//     setMin(event.target.value);
//   }

//   function handleMax(event: React.ChangeEvent<HTMLInputElement>) {
//     setMax(event.target.value);
//   }

//   function handleGo() {
//     let url = '/search?';
//     const query = [];

//     if (searchTerm) {
//       query.push(`q=${searchTerm}`);
//     }
//     if (min) {
//       query.push(`min=${min}`);
//     }
//     if (max) {
//       query.push(`max=${max}`);
//     }

//     url += query.join('&');
//     router.push(url);
//   }

//   return (
//     <div>
//       <Header />
//       <div className="flex">

//         <aside className="w-64 h-screen p-4 bg-gray-100 border-r">
//           <h2 className="text-lg font-bold mb-4">Filter by Price</h2>

//           <div className="mb-4">
//             <label className="block text-sm font-medium">Min Price</label>
//             <input
//               type="number"
//               value={min}
//               onChange={handleMin}
//               className="w-full border rounded px-2 py-1 mt-1"
//               placeholder="Min amount"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium">Max Price</label>
//             <input
//               type="number"
//               value={max}
//               onChange={handleMax}
//               className="w-full border rounded px-2 py-1 mt-1"
//               placeholder="Max amount"
//             />
//           </div>

//           <button
//             onClick={handleGo}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Go
//           </button>

//           {searchTerm && (
//             <p className="mt-4 text-sm text-gray-600">
//               Current Search: <strong>{searchTerm}</strong>
//             </p>
//           )}
//         </aside>

//         <main className="flex-1 p-4">{children}</main>
//       </div>
//     </div>
//   );
// }







"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import { useSearchParams, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const minAm = searchParams.get("min") || "";
  const maxAm = searchParams.get("max") || "";

  const [min, setMin] = useState(minAm);
  const [max, setMax] = useState(maxAm);

  const router = useRouter();

  function handleGo() {
    const query = [];
    if (searchTerm) query.push(`q=${searchTerm}`);
    if (min) query.push(`min=${min}`);
    if (max) query.push(`max=${max}`);

    router.push("/search?" + query.join("&"));
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 h-auto md:h-screen p-4 bg-gray-100 border-r">
          <h2 className="text-lg font-bold mb-4">Filter by Price</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Min Price</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Min amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Max Price</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Max amount"
            />
          </div>

          <button
            onClick={handleGo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Go
          </button>

          {searchTerm && (
            <p className="mt-4 text-sm text-gray-600">
              Current Search: <strong>{searchTerm}</strong>
            </p>
          )}
        </aside>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

