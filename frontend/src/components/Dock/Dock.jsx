import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Children, cloneElement, useEffect, useRef, useState } from "react";

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-800 bg-black text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.18 }}
          className={`absolute -top-7 left-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1 font-mono text-[10px] font-medium text-white shadow-md ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 14 },
  magnification = 60,
  distance = 160,
  panelHeight = 58,
  baseItemSize = 42,
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <>
      <div className="hidden items-end sm:flex">
        <motion.div
          onMouseMove={({ pageX }) => {
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            mouseX.set(Infinity);
          }}
          className={`flex items-end gap-2.5 rounded-2xl border border-neutral-200 bg-white/90 px-3 py-2 shadow-[0_14px_35px_-10px_rgba(0,0,0,0.18)] backdrop-blur-xl ${className}`}
          style={{ height: panelHeight }}
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item, index) => (
            <DockItem
              key={index}
              onClick={item.onClick}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              label={item.label}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </motion.div>
      </div>

      <div
        className="flex items-center gap-1.5 rounded-2xl border border-neutral-200 bg-white/95 px-2.5 py-2 shadow-lg backdrop-blur-xl sm:hidden"
        role="toolbar"
        aria-label="Mobile dock"
      >
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={item.onClick}
            aria-label={item.label}
            title={item.label}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-transform duration-200 active:scale-95"
          >
            {item.icon}
          </button>
        ))}
      </div>
    </>
  );
}
