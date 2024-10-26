import React from "react";

function Button({ children, className = "",type="button", ...props }) {
  return (
    <button
      type={type}
      style={{
        outline: "none",
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
