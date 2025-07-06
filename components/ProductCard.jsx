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
      className="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 product-card"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-300 ${
          isWishlisted
            ? "bg-red-500 text-white shadow-md"
            : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
        }`}
      >
        <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
      </button>

      {/* Quick View Button */}
      <Link href={`/products/${_id}`}>
        <button className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 text-gray-600 rounded-full hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <Eye size={16} />
        </button>
      </Link>

      {/* Image Container */}
      <Link href={`/products/${_id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={image || "/img/placeholder.png"}
            alt={name}
            className="w-full h-40 sm:h-48 md:h-56 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Stock Status Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && inStock && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Only {stock} left
            </div>
          )}
        </div>

        {/* Category Badge */}
        {category && (
          <span className="absolute top-2 left-10 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
            {category.name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-2 sm:p-3">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary transition-colors">
          <Link href={`/products/${_id}`}>{name}</Link>
        </h3>

        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg sm:text-xl font-bold text-primary">
              ৳{price}
              {unit !== "pcs" && (
                <span className="text-sm font-normal text-gray-600">
                  {" "}
                  / {measurement}
                  {unit === "l" ? "L" : unit}
                </span>
              )}
            </p>
            {unit === "pcs" && (
              <p className="text-sm text-gray-500 line-through">
                ৳{Math.round(price * 1.2)}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="w-full bg-gray-800 text-white font-medium py-2 px-3 rounded text-sm flex items-center justify-center transition-all duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          <ShoppingCart size={16} className="mr-1" />
          <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
}
