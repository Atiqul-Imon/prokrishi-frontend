import React from "react";

const Badge = React.forwardRef(({
  children,
  variant = "primary",
  size = "md",
  rounded = true,
  className = "",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium";
  
  const variants = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    accent: "bg-accent-100 text-accent-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    error: "bg-error-100 text-error-800",
    gray: "bg-gray-100 text-gray-800",
    outline: "border border-primary-200 text-primary-700 bg-transparent",
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  };
  
  const roundedClass = rounded ? "rounded-full" : "rounded-md";
  
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