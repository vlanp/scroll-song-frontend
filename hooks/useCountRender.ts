import { useEffect, useRef } from "react";

const useCountRender = (debugId?: string) => {
  const numberOfRender = useRef<number>(0);

  useEffect(() => {
    numberOfRender.current++;
    if (numberOfRender.current === 1) {
      console.log(`Component mount${debugId ? ` for id ${debugId}` : ""}`);
    } else {
      console.log(
        `Rerender number ${numberOfRender.current - 1}${debugId ? ` for id ${debugId}` : ""}`
      );
    }
  });

  useEffect(() => {
    return () => {
      console.log(`Component unmount${debugId ? ` for id ${debugId}` : ""}`);
    };
  }, []);
};

export default useCountRender;
