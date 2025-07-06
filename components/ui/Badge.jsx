import React from "react";

const Badge = React.forwardRef(({
  children,
  variant = "primary",
  size = "md",
  rounded = true,
  className = "",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium transition-colors duration-200";
  
  const variants = {
    primary: "bg-green-100 text-green-800 border border-green-200",
    secondary: "bg-orange-100 text-orange-800 border border-orange-200",
    accent: "bg-purple-100 text-purple-800 border border-purple-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200",
    gray: "bg-gray-100 text-gray-800 border border-gray-200",
    outline: "border border-green-200 text-green-700 bg-transparent",
    dark: "bg-gray-800 text-white border border-gray-700",
  };
  
  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-sm",
  };
  
  const roundedClass = rounded ? "rounded-full" : "rounded-lg";
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${roundedClass} ${className}`;
  
  return (
    <span
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge; 