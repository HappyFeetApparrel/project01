"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconType } from "react-icons/lib";
import { Separator } from "@/components/ui/separator";

// social media icons
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

interface SocialIcon {
  id: number;
  icon: IconType;
  name: string;
  link: string;
}
const socialIcons: SocialIcon[] = [
  { id: 1, icon: FaFacebookF, name: "Facebook", link: "https://facebook.com" },
  {
    id: 2,
    icon: FaInstagram,
    name: "Instagram",
    link: "https://instagram.com",
  },
  { id: 3, icon: FaTwitter, name: "Twitter", link: "https://twitter.com" },
];

// footer links
interface FooterLink {
  id: number;
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { id: 1, label: "Dashboard", href: "/dashboard" },
  { id: 2, label: "Sales", href: "/sales" },
  { id: 3, label: "Banking", href: "/banking" },
  { id: 4, label: "Records", href: "/records" },
  { id: 5, label: "Contact Us", href: "/contact-us" },
];

const Footer = () => {
  return (
    <footer className="p-5 bg-white">
      <div className="top-footer flex flex-col gap-8 py-8 lg:flex-row lg:items-start">
        <div className="space-y-5 basis-full lg:basis-4/12">
          <Link href="/">
            <Image src="/logo.png" alt="" width={136} height={36} />
          </Link>
          <h3>
            Cultivating Efficiency, Tracking Excellence — Your Trusted Inventory
            Management Partner
          </h3>
        </div>
        <div className="flex flex-col gap-8 basis-full lg:basis-8/12 lg:flex-col-reverse lg:items-end">
          <div className="social-media-icons flex gap-4">
            {socialIcons.map(({ id, icon: Icon, name, link }) => (
              <Link
                key={id}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className=" text-white border rounded-full p-1.5 bg-primary "
              >
                <Icon className="w-6 h-6" />
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 lg:flex-row">
            {footerLinks.map(({ id, label, href }) => (
              <Link key={id} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Separator />
      <div className="copyright flex flex-col gap-4 py-8 lg:flex-row lg:justify-between">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="terms-and-condition">Terms & Conditions</Link>
        <p className="font-semibold text-gray-500">
          © {new Date().getFullYear()} Happy Feet & Apparel
        </p>
      </div>
    </footer>
  );
};

export default Footer;
