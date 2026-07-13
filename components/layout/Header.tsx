"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { SearchDialog } from "@/components/search/SearchDialog";
import { mainNavLinks } from "@/lib/data/navigation";
import { isExternalHref } from "@/lib/data/contact";
import { useCart } from "@/lib/cart/cart-context";

function NavItem({
  link,
  pathname,
  className,
  onClick,
  dataActive,
}: {
  link: { label: string; href: string };
  pathname: string;
  className: string;
  onClick?: () => void;
  dataActive?: boolean;
}) {
  const active = dataActive ?? isNavActive(pathname, link.href);

  if (isExternalHref(link.href)) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      data-active={dataActive !== undefined ? dataActive : active}
      aria-current={active ? "page" : undefined}
      className={className}
      onClick={onClick}
    >
      {link.label}
    </Link>
  );
}

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { totals, isHydrated } = useCart();
  const cartCount = isHydrated ? totals.itemCount : 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between lg:h-16">
          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/images/logo.png"
              alt="Hunar Woods"
              width={492}
              height={199}
              className="h-8 lg:h-9 w-auto object-contain object-left"
              priority
              unoptimized
            />
          </Link>

          <DesktopNav pathname={pathname} />

          <div className="flex items-center gap-0.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon className="w-[18px] h-[18px] text-muted group-hover:text-forest transition-colors duration-200" />
            </IconButton>
            <IconButton label="Account" href="/account">
              <UserIcon className="w-[18px] h-[18px] text-muted group-hover:text-forest transition-colors duration-200" />
            </IconButton>
            <IconButton label="Cart" href="/cart" badge={cartCount}>
              <CartIcon className="w-[18px] h-[18px] text-muted group-hover:text-forest transition-colors duration-200" />
            </IconButton>
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-forest hover:bg-cream transition-colors duration-200"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="lg:hidden border-t border-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-0.5">
            {mainNavLinks.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                pathname={pathname}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                  isNavActive(pathname, link.href)
                    ? "font-semibold text-forest bg-cream border-l-2 border-gold pl-[10px]"
                    : "font-medium text-muted hover:text-forest hover:bg-cream/60"
                }`}
              />
            ))}
          </div>
        </nav>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const activeLink = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!activeLink) return;

    setIndicator({
      left: activeLink.offsetLeft,
      width: activeLink.offsetWidth,
    });
  }, []);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [pathname, updateIndicator]);

  return (
    <nav
      ref={navRef}
      className="relative hidden lg:flex items-center gap-0.5 pb-1"
    >
      <span
        aria-hidden
        className="absolute top-0 bottom-1 rounded-lg bg-cream transition-all duration-300 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />

      {mainNavLinks.map((link) => {
        const active = isNavActive(pathname, link.href);

        return (
          <NavItem
            key={link.href}
            link={link}
            pathname={pathname}
            dataActive={active}
            className={`relative z-10 px-3.5 py-2 text-xs font-medium tracking-wide rounded-lg transition-colors duration-200 ${
              active
                ? "text-forest font-semibold"
                : "text-muted hover:text-forest"
            }`}
          />
        );
      })}

      <span
        aria-hidden
        className="absolute bottom-0 h-[2px] rounded-full bg-gold transition-all duration-300 ease-out"
        style={{
          left: indicator.left + 8,
          width: Math.max(indicator.width - 16, 0),
        }}
      />
    </nav>
  );
}

function IconButton({
  children,
  label,
  href,
  badge = 0,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  badge?: number;
  onClick?: () => void;
}) {
  const className =
    "group relative flex p-2 rounded-lg hover:bg-cream transition-colors duration-200";

  const content = (
    <>
      {children}
      {badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-gold text-forest-dark text-[10px] font-bold leading-none">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      {content}
    </button>
  );
}
