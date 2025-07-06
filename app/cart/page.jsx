"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ArrowRight,
  Package,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

function CartPage() {
  const {
    cart,
    cartTotal,
    cartCount,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const router = useRouter();

  function handleCheckout() {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout");
  }

  function handleQuantityChange(id, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  }

  function handleClearCart() {
    if (cart.length === 0) {
      toast.error("Cart is already empty");
      return;
    }

    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 py-4">
                      <div className="w-20 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <EmptyState type="cart" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-base sm:text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
          <button
            onClick={handleClearCart}
            className="flex items-center text-red-600 hover:text-red-700 transition-colors text-base sm:text-lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || "/img/placeholder.png"}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-2 text-center min-w-[2.5rem] sm:min-w-[3rem]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-bold text-primary">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              ৳{item.price} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white rounded-xl shadow-lg border p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>৳{cartTotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 sm:py-3.5 sm:px-6 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-green-500/50"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </button>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <Truck className="w-5 h-5 mr-2" />
                  <span className="text-xs sm:text-sm font-medium">
                    Free delivery on orders over ৳500
                  </span>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <Package className="w-5 h-5 mr-2" />
                  <span className="text-xs sm:text-sm font-medium">
                    Secure checkout with SSL encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
