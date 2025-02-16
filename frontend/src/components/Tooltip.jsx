import { useState } from "react";
import PropTypes from "prop-types";

const Tooltip = ({ text, children, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`absolute z-10 rounded-lg bg-gray-700 px-2 py-1 text-xs whitespace-nowrap text-white ${positions[position]} `}
        >
          {text}
          {/* Triangle pointer */}
          <div
            className={`absolute h-2 w-2 rotate-45 transform bg-gray-700 ${position === "top" ? "top-full left-1/2 -translate-x-1/2 -translate-y-1" : ""} ${position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 translate-y-1" : ""} ${position === "left" ? "top-1/2 left-full -translate-x-1 -translate-y-1/2" : ""} ${position === "right" ? "top-1/2 right-full -translate-y-1/2 translate-x-1" : ""} `}
          />
        </div>
      )}
    </>
  );
};

export default Tooltip;

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};
