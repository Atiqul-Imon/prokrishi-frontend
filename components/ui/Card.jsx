import React from "react";
import { motion } from "framer-motion";

const Card = React.forwardRef(({
  children,
  variant = "default",
  padding = "md",
  hover = true,
  className = "",
  onClick,
  ...props
}, ref) => {
  const baseClasses = "bg-white rounded-xl border transition-all duration-300";
  
  const variants = {
    default: "border-gray-100 shadow-sm hover:shadow-lg",
    elevated: "border-gray-100 shadow-lg hover:shadow-xl",
    outlined: "border-gray-200 shadow-none hover:border-gray-300",
    ghost: "border-transparent shadow-none bg-transparent",
    primary: "border-green-100 shadow-sm hover:shadow-lg hover:border-green-200",
  };
  
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };
  
  const hoverClasses = hover ? "hover:-translate-y-1" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${hoverClasses} ${className}`;
  
  const Component = onClick ? motion.div : "div";
  
  return (
    <Component
      ref={ref}
      className={classes}
      onClick={onClick}
      whileHover={hover && onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </Component>
  );
});

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`pb-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`pt-6 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

Card.displayName = "Card";

export default Card; 