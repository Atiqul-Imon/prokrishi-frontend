import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef(({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  className = "",
  onClick,
  type = "button",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-lg hover:shadow-xl hover:scale-105",
    accent: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-lg hover:shadow-xl hover:scale-105",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500 shadow-sm hover:shadow-lg hover:scale-105",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 hover:scale-105",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:scale-105",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-lg hover:shadow-xl hover:scale-105",
    dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500 shadow-lg hover:shadow-xl hover:scale-105",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;
  
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };
  
  return (
    <motion.button
      ref={ref}
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button; 