import { useEffect, useRef } from "react";

const useCountRender = () => {
  const numberOfRender = useRef<number>(0);

  useEffect(() => {
    numberOfRender.current++;
    if (numberOfRender.current === 1) {
      console.log("Component mount");
    } else {
      console.log("Rerender number " + (numberOfRender.current - 1));
    }
  });

  useEffect(() => {
    return () => {
      console.log("Component unmount");
    };
  }, []);
};

export default useCountRender;
