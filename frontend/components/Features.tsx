import React from "react";
import FeatureCard from "./FeatureCard";
import { FaReact, FaDatabase, FaShieldAlt } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiStripe } from "react-icons/si";

const Features = () => {
  const features = [
    {
      icon: SiNextdotjs,
      title: "Next.js 14",
      description: "App dir, Routing, Layouts, components, and more.",
    },
    {
      icon: FaReact,
      title: "React 18",
      description: "Server and Client Components. using hooks and context.",
    },
    {
      icon: FaDatabase,
      title: "Database",
      description: "Postgres basic database and other cool features to come.",
    },
    {
      icon: SiTailwindcss,
      title: "Components",
      description: "Awesome components built with Tailwind CSS and more to come.",
    },
    {
      icon: FaShieldAlt,
      title: "Authentication",
      description: "Talk about your authentication features built into your app.",
    },
    {
      icon: SiStripe,
      title: "Subscriptions",
      description: "Talk about your subscription features and how they work.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">Features</h2>
          <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 font-light">
            Highlight cool features of your app using the beautifully designed custom cards with icons. You can use any
            icon you want.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
