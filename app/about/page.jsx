"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Users, Truck, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Prokrishi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting local farmers with consumers through our organic food marketplace. 
            Fresh, healthy, and sustainable food directly from farm to table.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Supporting Local Farmers
                </h3>
                <p className="text-gray-600 mb-6">
                  We believe in the power of local agriculture and the importance of 
                  supporting our farming communities. By connecting farmers directly 
                  with consumers, we create a sustainable ecosystem that benefits everyone.
                </p>
                <p className="text-gray-600">
                  Our platform provides farmers with fair prices for their produce 
                  while ensuring consumers get the freshest, highest-quality organic 
                  products available.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <Leaf className="w-8 h-8 text-green-600 mr-3" />
                  <h4 className="text-xl font-semibold text-gray-800">Organic Focus</h4>
                </div>
                <p className="text-gray-600">
                  We prioritize organic farming practices that are better for the 
                  environment and your health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Sustainability
              </h3>
              <p className="text-gray-600">
                Promoting environmentally friendly farming practices and reducing 
                food waste through direct farm-to-consumer connections.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                Building strong relationships between farmers and consumers, 
                fostering trust and mutual support in our local communities.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Quality
              </h3>
              <p className="text-gray-600">
                Ensuring the highest standards of food safety and quality, 
                with transparent sourcing and rigorous quality control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Farmers List Products
              </h3>
              <p className="text-gray-600">
                Local farmers upload their fresh, organic products to our platform 
                with detailed descriptions and pricing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Customers Order
              </h3>
              <p className="text-gray-600">
                Customers browse and order fresh products directly from local farms, 
                with secure payment and delivery options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Fresh Delivery
              </h3>
              <p className="text-gray-600">
                Products are harvested fresh and delivered directly to your doorstep, 
                ensuring maximum freshness and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join the Prokrishi Community
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Start your journey towards healthier eating and supporting local farmers. 
            Discover fresh, organic products today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Join as Farmer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 