"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const MENU_ITEMS = [
  { label: "About", href: "/#about" },
  { label: "Recognition", href: "/#recognition" },
  { label: "Works", href: "/#works" },
  { label: "Contact", href: "/#contact" },
];

const NAVBAR_STYLES = {
  scrolled: "bg-black/90 backdrop-blur-xl h-20 shadow-lg",
  default: "bg-black/90 backdrop-blur-md h-24",
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeHash, setActiveHash] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Update active hash on mount and hash change
    const updateHash = () => setActiveHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [pathname, activeHash]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (pathname === "/") {
      const hash = href.split("#")[1];
      return activeHash === `#${hash}` || (href === "/#about" && !activeHash);
    }
    return false;
  };

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex items-center justify-center ${
          scrolled ? NAVBAR_STYLES.scrolled : NAVBAR_STYLES.default
        }`}
      >
        <div className="w-full max-w-[1400px] h-[60px] px-4 sm:px-6 md:px-10 flex justify-between items-center">
          <Link href="/">
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/Logo.svg"
                alt="EPIK Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <motion.ul
            className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-white"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {MENU_ITEMS.map((item) => {
              const active = isActive(item.href);
              const isHovered = hoveredItem === item.label;

              return (
                <motion.li
                  key={item.label}
                  className="relative"
                  variants={{
                    hidden: { opacity: 0, y: -10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={item.href}
                    className={`transition-colors duration-200 inline-block ${
                      active
                        ? "text-cyan-400"
                        : "text-white/90 hover:text-cyan-400"
                    }`}
                  >
                    <motion.span
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {item.label}
                    </motion.span>
                  </Link>

                  <AnimatePresence>
                    {(active || isHovered) && (
                      <motion.div
                        layoutId={active ? "activeUnderline" : undefined}
                        className={`absolute left-0 -bottom-1 h-[2px] w-full ${
                          active ? "bg-cyan-400" : "bg-cyan-400/60"
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Mobile Burger Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white hover:text-cyan-400 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-[46px] h-[46px]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-[46px] h-[46px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden fixed left-0 right-0 z-40 mx-4 rounded-lg overflow-hidden shadow-2xl"
              style={{ top: scrolled ? "80px" : "96px" }}
            >
              <div className="bg-black/95 backdrop-blur-xl border border-white/10">
                <nav className="py-2">
                  {MENU_ITEMS.map((item, index) => {
                    const active = isActive(item.href);

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={handleMobileMenuClick}
                          className={`block px-6 py-4 text-sm tracking-wider uppercase transition-all ${
                            active
                              ? "bg-cyan-400/10 text-cyan-400 border-l-4 border-cyan-400"
                              : "text-white/90 hover:bg-white/5 hover:text-cyan-400 border-l-4 border-transparent"
                          }`}
                        >
                          <motion.span
                            className="inline-block"
                            whileTap={{ scale: 0.95 }}
                          >
                            {item.label}
                          </motion.span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
