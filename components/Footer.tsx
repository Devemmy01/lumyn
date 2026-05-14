"use client";

import Link from "next/link";

const footerLinks = {
  Studio: [
    { label: "About", href: "/about" },
    { label: "Our Method", href: "/philosophy" },
    { label: "Contact", href: "/contact" },
  ],
  Products: [
    { label: "Mindfuel", href: "/products#mindfuel" },
    { label: "Summai", href: "/products#summai" },
    { label: "EdTurbo", href: "/products#edturbo" },
  ],
  Journal: [{ label: "Articles", href: "/journal" }],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 pt-20 pb-10">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-block mb-6"
            >
              {/* <Image
                src="/footer.png"
                alt="Lumyn"
                width={100}
                height={30}
                className="h-6 w-auto"
              /> */} <h2 className="text-[24px] font-[900] ">Lumyn<span className="text-[#7c6cf6] text-[30px]">.</span></h2>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
              We design and engineer digital experiences that push boundaries
              and reshape industries.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            {Object.entries(footerLinks).map(([cat, links]) => (
              <div key={cat} className="min-w-[120px]">
                <h4 className="text-white font-semibold mb-6 tracking-wide">
                  {cat}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-neutral-400 text-sm font-medium hover:text-white transition-colors duration-300 relative group"
                      >
                        <span>{link.label}</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-neutral-500 font-medium">
          <p>&copy; {year} Lumyn Product Studio.</p>
        </div>
      </div>
    </footer>
  );
}
