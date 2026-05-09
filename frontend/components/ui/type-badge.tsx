"use client";

import { useLang } from "@/contexts/LanguageContext";
import { getTruckTypeColor, getTruckTypeLabel } from "@/app/constants/truck-types";
import { getProductTypeColor, getProductTypeLabel } from "@/app/constants/product-types";

interface TypeBadgeProps {
  type: "truck" | "product";
  value: string;
  size?: "sm" | "md" | "lg";
}

export function TypeBadge({ type, value, size = "sm" }: TypeBadgeProps) {
  const { lang } = useLang();

  const colorSet = type === "truck"
    ? getTruckTypeColor(value)
    : getProductTypeColor(value);

  const label = type === "truck"
    ? getTruckTypeLabel(value, lang)
    : getProductTypeLabel(value, lang);

  const sizeStyles = {
    sm: { fontSize: "10px", padding: "3px 8px" },
    md: { fontSize: "12px", padding: "4px 10px" },
    lg: { fontSize: "14px", padding: "6px 12px" },
  };

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: colorSet.bg,
        color: colorSet.text,
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 700,
        letterSpacing: "0.5px",
        padding: sizeStyles[size].padding,
        borderRadius: "999px",
        textTransform: "uppercase" as const,
        border: colorSet.border ? `1.5px solid ${colorSet.border}` : "none",
      }}
    >
      {label}
    </span>
  );
}

interface TruckTypeBadgeProps {
  value: string;
  size?: "sm" | "md" | "lg";
}

export function TruckTypeBadge({ value, size = "sm" }: TruckTypeBadgeProps) {
  return <TypeBadge type="truck" value={value} size={size} />;
}

interface ProductTypeBadgeProps {
  value: string;
  size?: "sm" | "md" | "lg";
}

export function ProductTypeBadge({ value, size = "sm" }: ProductTypeBadgeProps) {
  return <TypeBadge type="product" value={value} size={size} />;
}