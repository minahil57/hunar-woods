import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/icons";
import {
  footerAboutLinks,
  footerCustomerLinks,
  footerQuickLinks,
  footerShopLinks,
  socialLinks,
} from "@/lib/data/navigation";
import { isExternalHref, WHATSAPP_URL } from "@/lib/data/contact";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, rgba(196,165,116,0.18), transparent 40%), radial-gradient(circle at 88% 80%, rgba(255,255,255,0.06), transparent 35%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-20 lg:pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            {/* <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="Hunar Woods"
                width={492}
                height={199}å
                className="h-9 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </Link> */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Premium handmade solid wood furniture from Karachi. Crafting
              luxury that elevates your space and lasts for generations.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-forest-dark"
            >
              Chat on WhatsApp
              <span aria-hidden>→</span>
            </a>

            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all duration-300 hover:border-gold/40 hover:bg-gold hover:text-forest-dark"
                >
                  {social.icon === "facebook" && <FacebookIcon className="w-4 h-4" />}
                  {social.icon === "instagram" && <InstagramIcon className="w-4 h-4" />}
                  {social.icon === "tiktok" && <TikTokIcon className="w-4 h-4" />}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-6">
            <FooterColumn title="Shop" links={footerShopLinks} />
            <FooterColumn title="Company" links={[...footerAboutLinks, ...footerCustomerLinks]} />
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Visit
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/65">
                <p>Karachi, Pakistan</p>
                <p>Handmade solid wood furniture for modern homes</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white/85 transition-colors hover:text-gold"
                >
                  +92 316 1025858
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-white/45 sm:text-sm">
            © {new Date().getFullYear()} Hunar Woods. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerQuickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/45 transition-colors hover:text-gold sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            {isExternalHref(link.href) ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-white/65 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
