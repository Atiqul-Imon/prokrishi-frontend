import React from "react";
import { Facebook, Instagram, Mail, Phone, MapPin, Leaf } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Leaf className="w-8 h-8 text-green-300 mr-3" />
              <h3 className="text-2xl font-bold text-white">Prokrishi</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Pure & organic food directly from local farmers. Eat clean, live
              healthy, and support sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 bg-green-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-green-300 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  Dhaka, Bangladesh<br />
                  Local Farm Network
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+880 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@prokrishi.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Prokrishi. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors duration-300">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
