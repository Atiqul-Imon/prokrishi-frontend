"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFeaturedCategories } from "@/app/utils/api";

const CategoryCard = ({ category }) => (
  <Link
    href={`/products/category/${category.slug}`}
    className="group block text-center"
  >
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 overflow-hidden rounded-2xl border-2 border-gray-100 group-hover:border-green-300 transition-all duration-300 group-hover:scale-110 shadow-sm hover:shadow-md bg-white">
      <img
        src={category.image || "/placeholder.svg"}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <h3 className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-300 capitalize truncate leading-tight">
      {category.name}
    </h3>
  </Link>
);

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getFeaturedCategories();
        setCategories(data.categories || []);
      } catch (err) {
        setError("Failed to load featured categories.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; // Don't render the section if there are no featured categories
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Explore our carefully curated categories of fresh, organic products
          </p>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6 justify-center">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
