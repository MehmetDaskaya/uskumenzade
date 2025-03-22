"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FaTag, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
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

  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const applyFilters = () => {
    setAppliedFilters({ ...selectedFilters });
    if (showMobileFilters) {
      setShowMobileFilters(false);
    }
  };

  const resetFilters = () => {
    setSelectedFilters({ price: [], stock: [], category: [] });
    setAppliedFilters({ price: [], stock: [], category: [] });
    setSearchTerm("");
    setResetKey((prevKey) => prevKey + 1);
  };

  // Apply filters and search to the fetched products
  const filteredProducts = products.filter((product) => {
    // Search filter
    const searchFilter =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Price filter
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

    // Stock filter
    const stockFilter =
      appliedFilters.stock.length === 0 ||
      appliedFilters.stock.includes("Stokta Var") === product.stock > 0;

    // Category filter
    const categoryFilter =
      appliedFilters.category.length === 0 ||
      appliedFilters.category.includes(product.category.name);

    return searchFilter && priceFilter && stockFilter && categoryFilter;
  });

  // Get unique categories
  const uniqueCategories = Object.keys(
    products.reduce((uniqueCategories, product) => {
      uniqueCategories[product.category.name] = true;
      return uniqueCategories;
    }, {} as Record<string, boolean>)
  );

  // Calculate active filters count
  const activeFiltersCount =
    appliedFilters.price.length +
    appliedFilters.stock.length +
    appliedFilters.category.length;

  if (loading) {
    return <LoadingSpinner />;
  }

  const FilterSection = ({ mobile = false }) => (
    <div className={mobile ? "p-4" : ""}>
      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-4 pr-10 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-tertiary focus:border-transparent"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      {/* Categories */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
          Kategoriler
        </h4>
        <ul className="space-y-3" key={`category-${resetKey}`}>
          {uniqueCategories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-tertiary rounded border-gray-300 focus:ring-tertiary mr-3"
                  checked={selectedFilters.category.includes(cat)}
                  onChange={() => toggleFilter("category", cat)}
                />
                <span className="text-gray-700 group-hover:text-tertiary transition-colors">
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
          Fiyat Aralığı
        </h4>
        <ul className="space-y-3" key={`price-${resetKey}`}>
          {["100₺ - 200₺", "200₺ - 300₺", "300₺ - 500₺", "500₺ - 1000₺"].map(
            (range) => (
              <li key={range}>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-tertiary rounded border-gray-300 focus:ring-tertiary mr-3"
                    checked={selectedFilters.price.includes(range)}
                    onChange={() => toggleFilter("price", range)}
                  />
                  <span className="text-gray-700 group-hover:text-tertiary transition-colors">
                    {range}
                  </span>
                </label>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Stock Status */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h4 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-2">
          Stok Durumu
        </h4>
        <ul className="space-y-3" key={`stock-${resetKey}`}>
          {["Stokta Var", "Stokta Yok"].map((status) => (
            <li key={status}>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-tertiary rounded border-gray-300 focus:ring-tertiary mr-3"
                  checked={selectedFilters.stock.includes(status)}
                  onChange={() => toggleFilter("stock", status)}
                />
                <span className="text-gray-700 group-hover:text-tertiary transition-colors">
                  {status}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Actions */}
      <div className="space-y-3">
        <button
          className="bg-tertiary text-white py-3 px-4 w-full font-semibold rounded-md hover:bg-opacity-90 transition-colors shadow-md"
          onClick={applyFilters}
        >
          Filtreleri Uygula
        </button>
        <button
          className="bg-gray-200 py-3 px-4 w-full text-gray-600 font-semibold rounded-md hover:bg-gray-300 transition-colors"
          onClick={resetFilters}
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`flex-col mx-auto px-4 md:px-16 py-8 flex ${
        isProductsPage
          ? "bg-gradient-to-b from-quaternary to-tertiary min-h-screen"
          : ""
      }`}
    >
      <div className="w-full mb-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isProductsPage && (
            <h1 className="text-3xl text-gray-700 font-bold text-center pt-8 pb-2">
              Ürün Kataloğumuz
            </h1>
          )}

          {isProductsPage && (
            <div className="px-4 pb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Mobile Filters Toggle */}
              <button
                className="md:hidden flex items-center gap-2 bg-tertiary text-white py-2 px-4 rounded-lg"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <FaFilter />
                <span>Filtreler</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-tertiary rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">
                    Aktif Filtreler:
                  </span>
                  {appliedFilters.category.map((cat) => (
                    <span
                      key={`cat-${cat}`}
                      className="bg-tertiary bg-opacity-10 text-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {cat}
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            category: prev.category.filter((c) => c !== cat),
                          }));
                          setAppliedFilters((prev) => ({
                            ...prev,
                            category: prev.category.filter((c) => c !== cat),
                          }));
                        }}
                      />
                    </span>
                  ))}
                  {appliedFilters.price.map((price) => (
                    <span
                      key={`price-${price}`}
                      className="bg-tertiary bg-opacity-10 text-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {price}
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            price: prev.price.filter((p) => p !== price),
                          }));
                          setAppliedFilters((prev) => ({
                            ...prev,
                            price: prev.price.filter((p) => p !== price),
                          }));
                        }}
                      />
                    </span>
                  ))}
                  {appliedFilters.stock.map((stock) => (
                    <span
                      key={`stock-${stock}`}
                      className="bg-tertiary bg-opacity-10 text-tertiary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {stock}
                      <FaTimes
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedFilters((prev) => ({
                            ...prev,
                            stock: prev.stock.filter((s) => s !== stock),
                          }));
                          setAppliedFilters((prev) => ({
                            ...prev,
                            stock: prev.stock.filter((s) => s !== stock),
                          }));
                        }}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile Filters */}
      {isProductsPage && showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Filtreler</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <FilterSection mobile={true} />
          </div>
        </div>
      )}
      <div className="flex flex-row">
        {/* Desktop Filters Sidebar */}
        {isProductsPage && (
          <aside className="hidden md:block md:w-1/4 pr-6 h-auto">
            <div className="sticky top-4">
              <FilterSection />
            </div>
          </aside>
        )}

        {/* Product Listings */}
        <div className={`w-full ${isProductsPage ? "lg:w-3/4" : ""}`}>
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts
                  .slice(0, visibleProductsCount)
                  .map((product) => (
                    <Link
                      key={product.id}
                      href={`/urunler/detaylar/${product.id}`}
                      className="block"
                    >
                      <div className="relative group bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 transform hover:-translate-y-1 h-full flex flex-col">
                        <div className="w-full h-48 mb-4 overflow-hidden rounded-lg border border-gray-300">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            width={500}
                            height={192}
                          />
                        </div>

                        {/* Discount Badge */}
                        {product.discounted_price !== null &&
                          product.discounted_price !== undefined &&
                          product.discounted_price > 0 &&
                          product.discounted_price < product.price && (
                            <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-2 w-14 h-14 flex flex-col items-center justify-center shadow-md">
                              <FaTag className="text-lg" />
                              <span className="text-xs font-bold">
                                {Math.round(
                                  ((product.price - product.discounted_price) /
                                    product.price) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          )}

                        {/* Out of Stock Badge */}
                        {product.stock === 0 && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full p-2 w-14 h-14 flex flex-col items-center justify-center shadow-md">
                            <FaTag className="text-lg" />
                            <span className="text-xs font-bold">Tükendi</span>
                          </div>
                        )}

                        {/* Product Details */}
                        <div className="text-center mt-auto">
                          <h3 className="font-semibold text-gray-800 mb-2 text-lg line-clamp-2 h-14">
                            {product.name}
                          </h3>
                          <div className="flex justify-center space-x-2 items-center">
                            {product.discounted_price &&
                            product.discounted_price > 0 &&
                            product.discounted_price < product.price ? (
                              <>
                                <p className="text-gray-400 line-through text-sm">
                                  {product.price.toFixed(0)} ₺
                                </p>
                                <p className="text-tertiary font-bold text-xl">
                                  {product.discounted_price.toFixed(0)} ₺
                                </p>
                              </>
                            ) : (
                              <p className="text-tertiary font-bold text-xl">
                                {product.price.toFixed(0)} ₺
                              </p>
                            )}
                          </div>

                          {/* Stock Indicator */}
                          <div className="mt-2">
                            {product.stock > 0 ? (
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Stokta: {product.stock}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Stokta Değil
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {/* "Load More" Button */}
              {visibleProductsCount < filteredProducts.length &&
                isProductsPage && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMoreProducts}
                      className="bg-secondary hover:bg-opacity-90 text-white py-3 px-8 rounded-lg transition duration-300 shadow-md font-semibold"
                    >
                      Daha Fazla Gör (
                      {filteredProducts.length - visibleProductsCount} ürün
                      daha)
                    </button>
                  </div>
                )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-12 text-center shadow-md">
              <FaSearch size={64} className="text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Ürün Bulunamadı
              </h2>
              <p className="text-gray-500 mb-6">
                Arama kriterlerinize uygun ürün bulunamadı. Lütfen
                filtrelerinizi değiştirin veya başka bir arama terimi deneyin.
              </p>
              <button
                onClick={resetFilters}
                className="bg-tertiary text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors shadow-md"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
