import { useState, useEffect } from "react";

const LEGACY_BREAKPOINT = 992;
const NEW_BREAKPOINT = 1240;

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

const useWindowDimensionsHook = (isLegacy = true) => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const mobile = windowDimensions.width < (isLegacy ? LEGACY_BREAKPOINT : NEW_BREAKPOINT);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ...windowDimensions, mobile };
};

export { useWindowDimensionsHook };
