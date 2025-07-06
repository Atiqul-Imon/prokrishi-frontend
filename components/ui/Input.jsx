import React from "react";
import { motion } from "framer-motion";

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = "default",
  size = "md",
  fullWidth = true,
  className = "",
  ...props
}, ref) => {
  const baseClasses = "w-full border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border-gray-300 focus:border-green-500 focus:ring-green-500/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500/20",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-4 text-base",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = error ? variants.error : variants[variant];
  
  const classes = `${baseClasses} ${variantClass} ${sizes[size]} ${widthClass} ${className}`;
  
  return (
    <div className={`${fullWidth ? "w-full" : ""} space-y-2`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={`${classes} ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""}`}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="flex items-center space-x-2">
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input; 