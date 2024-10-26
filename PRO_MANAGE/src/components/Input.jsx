import React from "react";

function Input({ type = "text", className = " ", id = "", ...props }, ref) {
  return (
    <input
      type={type}
      className={className}
      id={id}
      ref={ref && ref}
      {...props}
    />
  );
}

export default React.forwardRef(Input);
