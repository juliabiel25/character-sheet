import type { ReactNode } from "react";
import * as SA from "@radix-ui/react-scroll-area";
import "./styles/ScrollArea.css";

interface ScrollAreaProps {
  children: ReactNode;
  type: "horizontal" | "vertical";
  className?: string;
}

const ScrollArea = ({ children, type, className }: ScrollAreaProps) => {
  return (
    <SA.Root className={`${className} ScrollAreaRoot`}>
      <SA.Viewport className="ScrollAreaViewport">{children}</SA.Viewport>
      <SA.Scrollbar className="ScrollAreaScrollbar" orientation={type}>
        <SA.Thumb className="ScrollAreaThumb" />
      </SA.Scrollbar>
    </SA.Root>
  );
};

export default ScrollArea;
