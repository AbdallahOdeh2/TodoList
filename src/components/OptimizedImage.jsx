import React from "react";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  ...props
}) => {
  // Generate WebP version path
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, ".webp");

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
