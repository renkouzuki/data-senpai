import React from "react";
import { LinkProps } from "../core/types";
import { preloadData } from "../core/fetch";

export function Link({
  href,
  prefetch,
  children,
  onMouseEnter,
  ...props
}: LinkProps): React.ReactElement {
  const isClient = typeof window !== "undefined";

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onMouseEnter) {
      onMouseEnter(e);
    }

    if (isClient && prefetch) {
      preloadData(prefetch);
    }
  };

  return (
    <a href={href} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </a>
  );
}

export default Link;
