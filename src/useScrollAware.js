import React, {
  useRef,
  useState,
  useEffect,
  useCallback
} from "react";

const useScrollAware = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();
  const animationFrame = useRef();

  const onScroll = useCallback(e => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    animationFrame.current = requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });
  }, []);

  useEffect(() => {
    const scrollContainer = ref.current;

    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  return [scrollTop, ref];
};

export default useScrollAware;
