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
  socialLinks,
} from "@/lib/data/navigation";
import { isExternalHref } from "@/lib/data/contact";

export function Footer() {
  return (
    <footer className="bg-section-dark text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div>
            <Link
              href="/"
              className="font-serif text-2xl font-semibold tracking-wide"
            >
              Hunar Woods
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
              Premium handmade solid wood furniture from Karachi. Crafting
              luxury that elevates your space and lasts for generations.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full bg-white/10 hover:bg-gold hover:text-forest transition-colors"
                >
                  {social.icon === "facebook" && <FacebookIcon />}
                  {social.icon === "instagram" && <InstagramIcon />}
                  {social.icon === "tiktok" && <TikTokIcon />}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Customer Service" links={footerCustomerLinks} />
          <FooterColumn title="About" links={footerAboutLinks} />

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">
              Subscribe
            </h3>
            <p className="text-sm text-white/70 mb-4">
              Get updates on new arrivals, deals, and exclusive offers.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-gold text-forest-dark text-sm font-semibold hover:bg-gold-light transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Hunar Woods. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerQuickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-gold transition-colors"
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
      <h3 className="font-serif text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            {isExternalHref(link.href) ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-white/70 hover:text-gold transition-colors"
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
