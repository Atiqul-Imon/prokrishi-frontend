"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/app/utils/api";
import toast from "react-hot-toast";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [results, setResults] = useState({
    products: [],
    pagination: {},
    filters: {},
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Get search parameters from URL
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const page = searchParams.get("page") || "1";
  const status = searchParams.get("status") || "active";

  // Local state for filters
  const [filters, setFilters] = useState({
    q: query,
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice,
    sortBy: sortBy,
    sortOrder: sortOrder,
    status: status,
  });

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const searchParams = new URLSearchParams();

      // Add all search parameters
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          searchParams.append(key, filters[key]);
        }
      });

      // Only perform search if there's a query or other filters
      if (query || category || minPrice || maxPrice) {
        const data = await searchProducts({
          q: query,
          category,
          minPrice: minPrice || 0,
          maxPrice: maxPrice || 999999,
          sortBy,
          sortOrder,
          page,
          status,
        });

        setResults(data);
      } else {
        // No search query, show empty state
        setResults({
          products: [],
          pagination: { totalProducts: 0 },
          filters: {},
          categories: [],
        });
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL with new filters
    const params = new URLSearchParams();
    Object.keys(updatedFilters).forEach((key) => {
      if (updatedFilters[key] !== undefined && updatedFilters[key] !== "") {
        params.append(key, updatedFilters[key]);
      }
    });

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
      sortOrder: "asc",
      status: "active",
    });
    router.push("/search");
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar - Prominent on mobile, also on desktop for consistency */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto lg:mx-0">
            <input
              type="text"
              value={filters.q}
              onChange={(e) => updateFilters({ q: e.target.value })}
              placeholder="Search for products..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              autoFocus={!query}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? (
              <>
                Search Results
                <span className="text-gray-600"> for "{query}"</span>
              </>
            ) : (
              "Search Products"
            )}
          </h1>
          {query && results.pagination?.totalProducts !== undefined && (
            <p className="text-gray-600">
              {results.pagination.totalProducts} product
              {results.pagination.totalProducts !== 1 ? "s" : ""} found
            </p>
          )}
          {!query && (
            <p className="text-gray-600">
              Enter a search term to find products
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
                >
                  {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
              </div>

              <div
                className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}
              >
                {/* Search Query - Hidden on mobile since we have prominent search bar */}
                <div className="hidden lg:block">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Query
                  </label>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => updateFilters({ q: e.target.value })}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {results.categories?.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={filters.minPrice}
                      onChange={(e) =>
                        updateFilters({ minPrice: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        updateFilters({ maxPrice: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <div className="space-y-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilters({ sortBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="createdAt">Date Added</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => updateFilters({ sortOrder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilters({ status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="all">All</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
                  >
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={performSearch}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : results.products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {results.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {results.pagination && results.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(parseInt(page) - 1)}
                      disabled={parseInt(page) <= 1}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    
                    <span className="px-4 py-2 text-gray-700">
                      Page {page} of {results.pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(parseInt(page) + 1)}
                      disabled={parseInt(page) >= results.pagination.totalPages}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
