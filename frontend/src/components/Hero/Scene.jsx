import { SylvaHero } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene({ background = false, className = "", style = {}, ...props } = {}) {
  return (
    <div
      className={`shader-frame ${background ? "shader-frame-background" : ""} ${className}`}
      style={style}
    >
      <SylvaHero
        variant="living-green"
        headingFont="lexend"
        bodyFont="lexend"
        headingWeight="300"
        bodyWeight="300"
        primaryColor="#ffffff"
        headingSize={63}
        bodySize={16.5}
        headingLetterSpacing={-0.006}
        backgroundCanvasSelector={background ? "#scene" : undefined}
        {...props}
      />
    </div>
  );
}

export default Scene;
