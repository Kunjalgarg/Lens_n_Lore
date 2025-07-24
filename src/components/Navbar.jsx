import React, { useState } from 'react';
import { Link } from 'react-scroll';
import { Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black text-white py-4 border-b border-white/10">
      <div className="max-w-9xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-black border-t border-white/10 px-6 py-6 space-y-5 shadow-lg"
            >
              {['Gallery', 'About', 'Services', 'Contact'].map((section) => (
                <Link
                  key={section}
                  to={section.toLowerCase()}
                  smooth={true}
                  duration={600}
                  onClick={closeMenu}
                  className="block text-base font-medium tracking-wide text-gray-300 hover:text-white transition-all"
                >
                  {section}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="tracking-wider space-x-3 items-center cursor-pointer flex">
          {/*Home Icon*/}
          <Link
            to="hero"
            smooth={true}
            duration={600}
            className="cursor-pointer text-gray-300 hover:text-white translate-y-[1px]"
            onClick={closeMenu}
          >
            <Home size={40} />
          </Link>
          <Link to="hero"
            smooth={true}
            duration={600}
            className="text-2xl font-sans-serif cursor-pointer hover:scale-105 duration-300"
            onClick={closeMenu}>
            Home
          </Link>
        </div>

        {/*Right Links*/}
        <div className="space-x-8 text-[15px] font-semibold tracking-wide hidden md:flex">
          {['Gallery', 'About', 'Services', 'Contact'].map((section) => (
            <Link
              key={section}
              to={section.toLowerCase()}
              smooth={true}
              duration={600}
              className="relative cursor-pointer hover:text-white transition-all"
            >
              <span className="hover-underline-animation">{section}</span>
            </Link>
          ))}
        </div>
        {/*Mobile Button*/}
        <div className="md:hidden">
          <button onClick={handleToggle}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
