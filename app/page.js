"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { apiRequest } from "@/app/utils/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeaturedCategories from "@/components/FeaturedCategories";

const Section = ({ title, children, href }) => (
  <section className="py-16 md:py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="w-16 h-1 bg-green-600 rounded-full"></div>
        </div>
        {href && (
          <Link
            href={href}
            className="text-green-600 font-semibold hover:text-green-700 flex items-center group transition-colors duration-300"
          >
            View All 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      {children}
    </div>
  </section>
);

const CategoryCard = ({ category }) => (
  <Link href={`/products/category/${category._id}`}>
    <div className="group block text-center">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden border-2 border-gray-100 group-hover:border-green-300 transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:shadow-md">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors truncate">
        {category.name}
      </h3>
    </div>
  </Link>
);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, popRes] = await Promise.all([
          apiRequest("/product/featured"),
          apiRequest("/product/popular"),
        ]);
        setFeaturedProducts(featRes.products || []);
        setPopularProducts(popRes.products || []);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-gray-50">
      <HeroSection />

      <FeaturedCategories />

      <Section title="Featured Products" href="/products">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Section>

      <Section title="Popular Products" href="/products">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </Section>
    </main>
  );
}
