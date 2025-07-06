import React from "react";
import { Package, Search, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";

const EmptyState = ({ 
  type = "products", 
  title, 
  description, 
  actionText, 
  actionHref,
  icon: Icon = Package 
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case "products":
        return {
          title: "No Products Found",
          description: "We couldn't find any products matching your criteria. Try adjusting your search or browse our categories.",
          actionText: "Browse All Products",
          actionHref: "/products",
          icon: Package
        };
      case "search":
        return {
          title: "No Search Results",
          description: "We couldn't find any products matching your search. Try different keywords or browse our categories.",
          actionText: "Browse Categories",
          actionHref: "/products",
          icon: Search
        };
      case "cart":
        return {
          title: "Your Cart is Empty",
          description: "Looks like you haven't added any products to your cart yet. Start shopping to see items here.",
          actionText: "Start Shopping",
          actionHref: "/products",
          icon: ShoppingCart
        };
      case "wishlist":
        return {
          title: "No Wishlist Items",
          description: "You haven't added any products to your wishlist yet. Start exploring to save your favorite items.",
          actionText: "Explore Products",
          actionHref: "/products",
          icon: Heart
        };
      case "orders":
        return {
          title: "No Orders Yet",
          description: "You haven't placed any orders yet. Start shopping to see your order history here.",
          actionText: "Start Shopping",
          actionHref: "/products",
          icon: Package
        };
      default:
        return {
          title: "Nothing Found",
          description: "We couldn't find what you're looking for. Please try again or contact support.",
          actionText: "Go Home",
          actionHref: "/",
          icon: Package
        };
    }
  };

  const content = {
    title: title || getDefaultContent().title,
    description: description || getDefaultContent().description,
    actionText: actionText || getDefaultContent().actionText,
    actionHref: actionHref || getDefaultContent().actionHref,
    icon: Icon || getDefaultContent().icon
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <content.icon className="w-12 h-12 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {content.title}
      </h3>
      
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
        {content.description}
      </p>
      
      {content.actionHref && (
        <Link href={content.actionHref}>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            {content.actionText}
          </button>
        </Link>
      )}
    </div>
  );
};

// Specific empty state components for common use cases
export const NoProductsFound = (props) => (
  <EmptyState type="products" {...props} />
);

export const NoSearchResults = (props) => (
  <EmptyState type="search" {...props} />
);

export const EmptyCart = (props) => (
  <EmptyState type="cart" {...props} />
);

export const EmptyWishlist = (props) => (
  <EmptyState type="wishlist" {...props} />
);

export const NoOrders = (props) => (
  <EmptyState type="orders" {...props} />
);

export default EmptyState;
