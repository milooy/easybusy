"use client";

import { css } from "../../../styled-system/css";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div
      className={css({
        bg: "white",
        p: "6",
        borderRadius: "xl",
        boxShadow: "sm",
      })}
    >
      <div
        className={css({
          fontSize: "2xl",
          mb: "3",
        })}
      >
        {icon}
      </div>
      <h3
        className={css({
          fontSize: "lg",
          fontWeight: "semibold",
          color: "gray.900",
          mb: "2",
        })}
      >
        {title}
      </h3>
      <p className={css({ color: "gray.600", fontSize: "sm" })}>{description}</p>
    </div>
  );
}
