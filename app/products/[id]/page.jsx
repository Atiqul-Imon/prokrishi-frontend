"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Check,
  X,
  Plus,
  Minus,
  Tag,
  Layers,
  Package,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getProductById } from "@/app/utils/api";
import { useCart } from "@/app/context/CartContext";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton"; // Assuming you have this

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      toast.error("Not enough stock available.");
      return;
    }
    if (quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="animate-pulse bg-gray-200 rounded-lg w-full h-[350px]"></div>
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-5 w-1/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-1/3 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-16 w-full rounded"></div>
            <div className="flex items-center gap-3">
              <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-40 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
    return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!product)
    return (
      <div className="text-center text-gray-500 py-12">Product not found.</div>
    );

  const isOutOfStock = product.stock === 0;

  const stockStatus = isOutOfStock
    ? {
        text: "Out of Stock",
        icon: <X className="w-4 h-4 mr-2" />,
        color: "text-red-600",
      }
    : product.stock <= product.lowStockThreshold
      ? {
          text: `Only ${product.stock} left`,
          icon: <Check className="w-4 h-4 mr-2" />,
          color: "text-yellow-600",
        }
      : {
          text: "In Stock",
          icon: <Check className="w-4 h-4 mr-2" />,
          color: "text-green-600",
        };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
              <img
                src={product.image || "/testp.webp"}
                alt={product.name}
                className="w-full h-auto max-h-[400px] sm:max-h-[450px] lg:max-h-[500px] object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start space-y-4">
            <div className="space-y-2">
              <Link
                href={`/products/category/${product.category.name.toLowerCase()}`}
                className="text-primary-600 hover:text-primary-800 font-medium text-sm uppercase tracking-wide transition-colors"
              >
                {product.category.name}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
            </div>

            <div className="my-3">
              <span className="text-3xl font-bold text-gray-900">
                ৳{product.price}
                {product.unit !== "pcs" && (
                  <span className="text-lg font-medium text-gray-600">
                    {" "}
                    / {product.measurement}
                    {product.unit === "l" ? "L" : product.unit}
                  </span>
                )}
              </span>
            </div>

            <div className="text-gray-600 text-sm leading-relaxed">
              <p>{product.description}</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center font-medium text-sm ${stockStatus.color}`}
                >
                  {stockStatus.icon}
                  {stockStatus.text}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={isOutOfStock || quantity <= 1}
                  className="p-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold text-base">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                <span>100% Secure Payments</span>
              </div>
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                <span>Fast Delivery Across the Country</span>
              </div>
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
                <span>Easy Returns & Exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
