"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Routes({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  const params = useParams<{ storeId: string }>();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "dashboard",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "billboards",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "categories",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/variants`,
      label: "variants",
      active: pathName === `/${params.storeId}/variants`,
    },
    {
      href: `/${params.storeId}/colours`,
      label: "colours",
      active: pathName === `/${params.storeId}/colours`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
