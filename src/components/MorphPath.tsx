// @ts-ignore
import { interpolate } from "flubber";
import { animate, Spring, Tween } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type MorphPathProps = {
  fromPath: string;
  toPath: string;
  animation?: (Tween | Spring) & { delay?: number; type?: "tween" | "spring" };
};

const MorphPath = ({ fromPath, toPath, animation }: MorphPathProps) => {
  // create interpolator for smooth transition paths from fromPath to toPath
  const interpolatorRef = useRef<any>();
  useEffect(() => {
    interpolatorRef.current = interpolate(fromPath, toPath, {
      maxSegmentLength: 1
    });
  }, [fromPath, toPath]);

  // animate value from 0 to 1
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    animate(0, 1, {
      ...animation,
      onUpdate: (val) => {
        setProgress(val);
      }
    });
  }, [fromPath, toPath, animation]);

  // for each new animated progress value invoking
  // interpolator and set a new inperpolated path into React state
  const [path, setPath] = useState<null | string>(null);
  useEffect(() => {
    if (interpolatorRef.current) {
      setPath(interpolatorRef.current(progress));
    }
  }, [progress]);

  if (!path) {
    return null;
  }

  return <path d={path} fill="#FBB503" />;
};

export default MorphPath;
