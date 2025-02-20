// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";

// import { FaCartPlus, FaHeart, FaTag } from "react-icons/fa";
// import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
// import { products } from "../../../util/mock/mockProducts";
// // Define a type that includes stock
// type ProductWithStock =
//   | {
//       id: number;
//       name: string;
//       price: number;
//       imageUrl: string;
//       stock: number;
//       oldPrice?: undefined;
//     }
//   | {
//       id: number;
//       name: string;
//       price: number;
//       oldPrice: number;
//       imageUrl: string;
//       stock: number;
//     };

// interface ProductListingsProps {
//   isProductsPage?: boolean;
// }

// export const ProductListings = ({
//   isProductsPage = false,
// }: ProductListingsProps) => {
//   const [isLoading, setIsLoading] = useState(true);

//   const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
//   const [visibleProductsCount, setVisibleProductsCount] = useState(
//     isProductsPage ? 12 : 4
//   );

//   const [selectedFilters, setSelectedFilters] = useState<{
//     price: string[];
//     size: string[];
//     color: string[];
//     discount: string[];
//     stock: string[];
//   }>({
//     price: [],
//     size: [],
//     color: [],
//     discount: [],
//     stock: [],
//   });

//   const [appliedFilters, setAppliedFilters] = useState<{
//     price: string[];
//     size: string[];
//     color: string[];
//     discount: string[];
//     stock: string[];
//   }>({
//     price: [],
//     size: [],
//     color: [],
//     discount: [],
//     stock: [],
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading delay
//     return () => clearTimeout(timer); // Cleanup timer on unmount
//   }, []);

//   const toggleFilter = (
//     filterType: keyof typeof selectedFilters,
//     value: string
//   ) => {
//     const newFilters = { ...selectedFilters };

//     if (newFilters[filterType].includes(value)) {
//       newFilters[filterType] = newFilters[filterType].filter(
//         (v) => v !== value
//       );
//     } else {
//       newFilters[filterType].push(value);
//     }

//     setSelectedFilters(newFilters);
//   };

//   const applyFilters = () => {
//     setAppliedFilters({ ...selectedFilters });
//   };

//   const resetFilters = () => {
//     setSelectedFilters({
//       price: [],
//       size: [],
//       color: [],
//       discount: [],
//       stock: [],
//     });
//     setAppliedFilters({
//       price: [],
//       size: [],
//       color: [],
//       discount: [],
//       stock: [],
//     });
//   };
//   // Function to load more products
//   const loadMoreProducts = () => {
//     setVisibleProductsCount((prevCount) =>
//       isProductsPage ? prevCount + 12 : prevCount + 4
//     );
//   };

//   // Filter products based on selected filters
//   const filteredProducts = products.filter((product) => {
//     const priceFilter =
//       appliedFilters.price.length > 0
//         ? appliedFilters.price.some((priceRange) => {
//             const [minPrice, maxPrice] = priceRange
//               .replace("₺", "")
//               .split(" - ")
//               .map(Number);
//             return product.price >= minPrice && product.price <= maxPrice;
//           })
//         : true;

//     const discountFilter =
//       appliedFilters.discount.length > 0
//         ? appliedFilters.discount.some((discountRange) => {
//             const [minDiscount, maxDiscount] = discountRange
//               .replace("%", "")
//               .split(" - ")
//               .map(Number);
//             const discountPercentage = product.oldPrice
//               ? ((product.oldPrice - product.price) / product.oldPrice) * 100
//               : 0;
//             return (
//               discountPercentage >= minDiscount &&
//               discountPercentage <= maxDiscount
//             );
//           })
//         : true;

//     const stockFilter =
//       appliedFilters.stock.length > 0
//         ? appliedFilters.stock.includes("Stokta Var")
//           ? (product as ProductWithStock).stock > 0
//           : (product as ProductWithStock).stock === 0
//         : true;

//     return priceFilter && discountFilter && stockFilter;
//   });

//   if (isLoading) {
//     return <LoadingSpinner />; // Show spinner if still loading
//   }
//   return (
//     <div className="container flex-col mx-auto px-4 md:px-16 py-8 flex bg-secondary ">
//       <div className="w-full mb-4 ">
//         <h1 className="text-3xl bg-white text-gray-700  font-bold text-center py-8 rounded-t-xl">
//           Ürün Kataloğumuz
//         </h1>
//       </div>
//       <div className="flex flex-row">
//         {/* Sliding Drawer for filters */}
//         {isProductsPage && (
//           <div
//             className={`fixed inset-y-0 left-0 w-3/4 bg-white p-6 z-50 transform shadow-lg rounded-r-lg ${
//               isFilterDrawerOpen ? "translate-x-0" : "-translate-x-full"
//             } transition-transform duration-300 ease-in-out lg:hidden`}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="font-bold text-xl text-gray-900">
//                 Ürünleri Filtrele
//               </h3>
//               <button
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => setIsFilterDrawerOpen(false)}
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Category Section */}
//             <div className="mb-8">
//               <h4 className="font-semibold text-lg mb-2 text-gray-800">
//                 Kategoriler
//               </h4>
//               <ul className="space-y-3">
//                 {["Çaylar", "Kremler", "Yağlar", "Baharatlar"].map(
//                   (category) => (
//                     <li key={category}>
//                       <a
//                         href="#"
//                         className="block text-gray-700 hover:text-tertiary transition duration-200"
//                       >
//                         {category}
//                       </a>
//                     </li>
//                   )
//                 )}
//               </ul>
//             </div>

//             {/* Price Range Section */}
//             <div className="mb-8">
//               <h4 className="font-semibold text-lg mb-2 text-gray-800">
//                 Fiyat Aralığı
//               </h4>
//               <ul className="space-y-3">
//                 {[
//                   "100₺ - 200₺",
//                   "200₺ - 300₺",
//                   "300₺ - 500₺",
//                   "500₺ - 1000₺",
//                   "1000₺ - 2000₺",
//                 ].map((price, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("price", price)}
//                       />
//                       <span className="text-gray-700">{price}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Discount Section */}
//             <div className="mb-8">
//               <h4 className="font-semibold text-lg mb-2 text-gray-800">
//                 İndirim
//               </h4>
//               <ul className="space-y-3">
//                 {["İndirimli Ürün"].map((discount, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("discount", discount)}
//                       />
//                       <span className="text-gray-700">{discount}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Stock Section */}
//             <div className="mb-8">
//               <h4 className="font-semibold text-lg mb-2 text-gray-800">Stok</h4>
//               <ul className="space-y-3">
//                 {["Stokta Var", "Stokta Yok"].map((stockStatus, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("stock", stockStatus)}
//                       />
//                       <span className="text-gray-700">{stockStatus}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               className="w-full bg-tertiary text-white py-3 rounded-lg hover:bg-tertiary transition duration-200"
//               onClick={applyFilters}
//             >
//               Filtreleri Uygula
//             </button>
//           </div>
//         )}

//         {/* Left Filtering Section */}
//         {isProductsPage && (
//           <aside className="hidden md:block md:w-1/4 pr-8 mr-8 border-r border-tertiary h-auto">
//             {/* Categories */}
//             <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
//               <h4 className="font-semibold text-lg mb-3 text-gray-800">
//                 Kategoriler
//               </h4>
//               <ul className="space-y-3">
//                 {["Çaylar", "Kremler", "Yağlar", "Baharatlar"].map(
//                   (category, index) => (
//                     <li key={index}>
//                       <a
//                         href="#"
//                         className="block text-gray-700 hover:text-tertiary transition duration-200"
//                       >
//                         {category}
//                       </a>
//                     </li>
//                   )
//                 )}
//               </ul>
//             </div>

//             {/* Price Range */}
//             <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
//               <h4 className="font-semibold text-lg mb-3 text-gray-800">
//                 Fiyat Aralığı
//               </h4>
//               <ul className="space-y-3">
//                 {[
//                   "100₺ - 200₺",
//                   "200₺ - 300₺",
//                   "300₺ - 500₺",
//                   "500₺ - 1000₺",
//                   "1000₺ - 2000₺",
//                 ].map((price, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("price", price)}
//                       />
//                       <span className="text-gray-700">{price}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Discount */}
//             <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
//               <h4 className="font-semibold text-lg mb-3 text-gray-800">
//                 İndirim
//               </h4>
//               <ul className="space-y-3">
//                 {["İndirimli Ürün"].map((discount, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("discount", discount)}
//                       />
//                       <span className="text-gray-700">{discount}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* New Stock Filter Section */}
//             <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
//               <h4 className="font-semibold text-lg mb-3 text-gray-800">Stok</h4>
//               <ul className="space-y-3">
//                 {["Stokta Var", "Stokta Yok"].map((stockStatus, index) => (
//                   <li key={index}>
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="form-checkbox h-4 w-4 text-tertiary transition duration-150 ease-in-out mr-2"
//                         onChange={() => toggleFilter("stock", stockStatus)}
//                       />
//                       <span className="text-gray-700">{stockStatus}</span>
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <button
//               className="bg-gray-200 py-2 mb-2 px-4 w-full text-gray-600 font-semibold"
//               onClick={resetFilters}
//             >
//               Filtreleri Temizle
//             </button>

//             <button
//               className="bg-gray-200 py-2 px-4 w-full text-gray-600 font-semibold"
//               onClick={applyFilters}
//             >
//               Filtreleri Uygula
//             </button>
//           </aside>
//         )}
//         {/* Right Product Listing Section */}
//         <div className={`w-full ${isProductsPage && "lg:w-3/4"}`}>
//           <div className="flex justify-between items-center mb-6">
//             {/* Flex container for Filter and Sorting buttons */}
//             <div className="flex space-x-4 items-center w-full justify-between md:justify-end">
//               {/* Filter button for mobile view, aligned horizontally */}
//               {isProductsPage && (
//                 <button
//                   className="bg-tertiary text-white py-2 px-4 rounded-full md:hidden"
//                   onClick={() => setIsFilterDrawerOpen(true)}
//                 >
//                   Filtre
//                 </button>
//               )}
//               {/* Sorting Dropdown */}
//               {isProductsPage && (
//                 <button className="border px-4 py-2 text-gray-600 flex items-center">
//                   <span className="mr-2">Önerilen Sıralama</span>

//                   <svg
//                     className="w-4 h-4"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredProducts.slice(0, visibleProductsCount).map((product) => (
//               <div key={product.id} className="relative group">
//                 <Link
//                   href={`/urunler/detaylar/${product.id}`}
//                   className="relative z-10"
//                 >
//                   <img
//                     src={product.imageUrl}
//                     alt={product.name}
//                     className="w-full h-100 object-contain mb-4 cursor-pointer rounded-lg"
//                   />

//                   {/* Add this block for discount badge */}
//                   {product.oldPrice && (
//                     <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-2 flex flex-col items-center justify-center w-10 h-10">
//                       <FaTag />
//                       <span className="text-[9px]">İndirim</span>
//                     </div>
//                   )}
//                 </Link>
//                 <h3 className="font-semibold text-gray-700">{product.name}</h3>
//                 <div className="flex justify-end space-x-2">
//                   {product.oldPrice && (
//                     <p className="text-gray-400 line-through text-lg">
//                       {product.oldPrice.toFixed(0)} ₺
//                     </p>
//                   )}
//                   <p className="text-yellow-100 font-bold text-lg">
//                     {product.price.toFixed(0)} ₺
//                   </p>
//                 </div>
//                 {/* Action icons */}
//                 {isProductsPage && (
//                   <div className="hidden md:flex absolute inset-0 flex-row justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-24 space-x-8 z-20">
//                     <button className="bg-tertiary text-white py-2 px-2 rounded-full mb-2">
//                       <FaCartPlus className="text-white" /> {/* Cart Icon */}
//                     </button>
//                     <button className="bg-red-500 text-white py-2 px-2 rounded-full mb-2">
//                       <FaHeart className="text-white" /> {/* Favorites Icon */}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//           {/* "See More" button */}

//           {visibleProductsCount < filteredProducts.length && isProductsPage && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={loadMoreProducts}
//                 className="bg-tertiary text-white py-3 px-6 rounded-lg hover:bg-tertiary transition duration-200"
//               >
//                 Daha Fazla Gör
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

import { FaTag } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { RootState, AppDispatch } from "@/redux/store";

interface ProductListingsProps {
  isProductsPage?: boolean;
}

export const ProductListings = ({
  isProductsPage = false,
}: ProductListingsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.product
  );

  const [visibleProductsCount, setVisibleProductsCount] = useState(
    isProductsPage ? 12 : 4
  );

  const [selectedFilters, setSelectedFilters] = useState<{
    price: string[];
    stock: string[];
    category: string[];
  }>({
    price: [],
    stock: [],
    category: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<{
    price: string[];
    stock: string[];
    category: string[];
  }>({
    price: [],
    stock: [],
    category: [],
  });

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const loadMoreProducts = () => {
    setVisibleProductsCount((prevCount) =>
      isProductsPage ? prevCount + 12 : prevCount + 4
    );
  };

  const toggleFilter = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((v) => v !== value)
        : [...prevFilters[filterType], value],
    }));
  };

  const applyFilters = () => setAppliedFilters({ ...selectedFilters });

  const resetFilters = () => {
    setSelectedFilters({ price: [], stock: [], category: [] });
    setAppliedFilters({ price: [], stock: [], category: [] });
    setResetKey((prevKey) => prevKey + 1); // Trigger re-render of checkboxes
  };

  // Apply filters to the fetched products
  const filteredProducts = products.filter((product) => {
    const priceFilter =
      appliedFilters.price.length === 0 ||
      appliedFilters.price.some((range) => {
        const [min, max] = range
          .split(" - ")
          .map((p) => parseInt(p.replace("₺", ""), 10));
        return (
          product.discounted_price >= min && product.discounted_price <= max
        );
      });

    const stockFilter =
      appliedFilters.stock.length === 0 ||
      appliedFilters.stock.includes("Stokta Var") === product.stock > 0;

    const categoryFilter =
      appliedFilters.category.length === 0 ||
      appliedFilters.category.includes(product.category.name);

    return priceFilter && stockFilter && categoryFilter;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex-col mx-auto px-4 md:px-16 py-8 flex bg-secondary ">
      <div className="w-full mb-4 ">
        <h1 className="text-3xl bg-white text-gray-700 font-bold text-center py-8 rounded-t-xl">
          Ürün Kataloğumuz
        </h1>
      </div>
      <div className="flex flex-row">
        {isProductsPage && (
          <aside className="hidden md:block md:w-1/4 pr-8 mr-8 border-r border-tertiary h-auto">
            {/* Kategoriler */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                Kategoriler
              </h4>
              <ul className="space-y-3" key={`category-${resetKey}`}>
                {Object.keys(
                  products.reduce((uniqueCategories, product) => {
                    uniqueCategories[product.category.name] = true;
                    return uniqueCategories;
                  }, {} as Record<string, boolean>)
                ).map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-tertiary mr-2"
                        onChange={() => toggleFilter("category", cat)}
                      />
                      <span className="text-gray-700">{cat}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {/* Fiyat Aralığı */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                Fiyat Aralığı
              </h4>
              <ul className="space-y-3" key={`price-${resetKey}`}>
                {[
                  "100₺ - 200₺",
                  "200₺ - 300₺",
                  "300₺ - 500₺",
                  "500₺ - 1000₺",
                ].map((range) => (
                  <li key={range}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-tertiary mr-2"
                        onChange={() => toggleFilter("price", range)}
                      />
                      <span className="text-gray-700">{range}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            {/* Stok Durumu */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">
                Stok Durumu
              </h4>
              <ul className="space-y-3" key={`stock-${resetKey}`}>
                {["Stokta Var", "Stokta Yok"].map((status) => (
                  <li key={status}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-tertiary mr-2"
                        onChange={() => toggleFilter("stock", status)}
                      />
                      <span className="text-gray-700">{status}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filtre İşlemleri */}
            <button
              className="bg-gray-200 py-2 px-4 w-full text-gray-600 font-semibold rounded-md"
              onClick={applyFilters}
            >
              Filtreleri Uygula
            </button>
            <button
              className="bg-gray-200 py-2 mt-2 px-4 w-full text-gray-600 font-semibold rounded-md"
              onClick={resetFilters}
            >
              Filtreleri Temizle
            </button>
          </aside>
        )}

        {/* Product Listings */}
        <div className={`w-full ${isProductsPage && "lg:w-3/4"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.slice(0, visibleProductsCount).map((product) => (
              <Link
                key={product.id}
                href={`/urunler/detaylar/${product.id}`}
                className="block"
              >
                <div className="relative group bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-md border border-gray-300">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      width={500} // Set an appropriate width
                      height={192}
                    />
                  </div>

                  {/* Discount Badge */}
                  {product.discounted_price < product.price && (
                    <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-2 w-12 h-12 flex flex-col items-center justify-center">
                      <FaTag className="text-lg" />
                      <span className="text-[10px]">İndirim</span>
                    </div>
                  )}
                  {/* Out of Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full p-2 w-12 h-12 flex flex-col items-center justify-center">
                      <FaTag className="text-lg" />
                      <span className="text-[10px]">Tükendi</span>
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                      {product.name}
                    </h3>
                    <div className="flex justify-center space-x-2 items-center">
                      {product.discounted_price < product.price && (
                        <p className="text-gray-400 line-through text-sm">
                          {product.price.toFixed(0)} ₺
                        </p>
                      )}
                      <p className="text-tertiary font-bold text-xl">
                        {product.discounted_price.toFixed(0)} ₺
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* "Load More" Button */}
          {visibleProductsCount < filteredProducts.length && isProductsPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMoreProducts}
                className="bg-secondary text-white py-3 px-6 rounded-lg hover:bg-tertiary transition duration-300"
              >
                Daha Fazla Gör
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
