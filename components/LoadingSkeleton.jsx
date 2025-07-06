import React from "react";
import { motion } from "framer-motion";

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 sm:h-56 md:h-64 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="ml-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </td>
  </tr>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    <div className="animate-pulse">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: 4 }).map((_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Page Skeleton
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <NavbarSkeleton />
    <HeroSkeleton />
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
        </div>
        <CategoryGridSkeleton />
      </div>
    </div>
    <div className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-1 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Spinner Component
export const Spinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "border-primary-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}
    ></div>
  );
};

// Loading Overlay
export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 flex flex-col items-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Pulse Loading
export const PulseLoading = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center space-x-2">
    <div className="flex space-x-1">
      <motion.div
        className="w-2 h-2 bg-primary-600 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary-600 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary-600 rounded-full"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
    <span className="text-gray-600">{text}</span>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="text-center animate-pulse">
    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl bg-gray-200"></div>
    <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
  </div>
);

export const CategoryGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CategoryCardSkeleton key={index} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 md:py-20 lg:py-28 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto lg:mx-0 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-8"></div>
          <div className="h-6 bg-gray-200 rounded mb-8 w-3/4"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="h-80 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    </div>
  </div>
);

export const NavbarSkeleton = () => (
  <div className="sticky top-0 z-50 bg-white shadow-md py-4 px-6 flex items-center justify-between animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="h-8 w-24 bg-gray-200 rounded"></div>
    </div>
    <div className="hidden md:flex space-x-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-4 w-16 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="flex items-center space-x-6">
      <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

export default {
  ProductCardSkeleton,
  CategoryCardSkeleton,
  ProductGridSkeleton,
  CategoryGridSkeleton,
  HeroSkeleton,
  NavbarSkeleton,
  PageSkeleton,
};
