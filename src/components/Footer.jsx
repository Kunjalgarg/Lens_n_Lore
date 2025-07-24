import React from "react";
import { motion } from 'framer-motion';
import { Link } from "react-scroll";

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Footer = () => {

  const links = [
    { to: "hero", label: "Home" },
    { to: "gallery", label: "Gallery" },
    { to: "about", label: "About" },
    { to: "services", label: "Services" },
    { to: "contact", label: "Contact" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-black text-white py-10 px-4 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center 
      gap-y-6">

        {/* Left Side */}
        <div className="text-sm opacity-70 text-center md:text-left w-full md:w-auto">
          &copy; {new Date().getFullYear()} <span className="text-[20px]">|</span> 
          <span className=""> All rights reserved.</span>
        </div>

        {/* Center - Smooth Scroll Navigation */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-light">
          {links.map((link, index) => (
            <motion.div
              key={link.to}
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={linkVariants}
              viewport={{ once: true }}
            >
              <Link
                to={link.to}
                smooth={true}
                duration={700}
                offset={0}
                className="cursor-pointer hover:underline transition duration-300"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Side */}
        <div className="text-sm opacity-70 text-center md:text-right w-full md:w-auto whitespace-nowrap">
          <span className="text-[20px] px-1">|</span>
          <span className="text-sm">
          Etched & Held by <span className="font-italic font-serif">Kunjal</span>
          </span>
        </div>
        
      </div>
    </motion.footer>
  );
};

export default Footer;
