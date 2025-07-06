"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const {
    _id,
    name,
    image,
    price,
    category,
    stock,
    measurement,
    unit,
  } = product;
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, id: _id }, 1);
  }

  const inStock = stock > 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div
      className="group relative bg-white hover:shadow-xl transition-all duration-300 product-card rounded-xl border border-gray-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
          isWishlisted
            ? "bg-red-500 text-white shadow-lg scale-110"
            : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110"
        }`}
      >
        <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
      </button>

      {/* Quick View Button */}
      <Link href={`/products/${_id}`}>
        <button className="absolute top-3 left-3 z-10 p-2 bg-white/80 text-gray-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:scale-110">
          <Eye size={18} />
        </button>
      </Link>

      {/* Image Container */}
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={image || "/img/placeholder.png"}
            alt={name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Stock Status Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && inStock && (
            <div className="absolute top-3 left-12 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              Only {stock} left
            </div>
          )}

          {/* Category Badge */}
          {category && (
            <span className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
              {category.name}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors leading-tight">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Price and Stock */}
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xl font-bold text-green-600">
              ৳{price}
              {unit !== "pcs" && (
                <span className="text-sm font-normal text-gray-500 ml-1">
                  / {measurement}
                  {unit === "l" ? "L" : unit}
                </span>
              )}
            </p>
            {unit === "pcs" && (
              <p className="text-sm text-gray-400 line-through">
                ৳{Math.round(price * 1.2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
        >
          <ShoppingCart size={18} className="mr-2" />
          <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
}
