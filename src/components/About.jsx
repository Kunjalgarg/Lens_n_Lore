import React from 'react';
import aboutImage from '../assets/about.jpg'; 
import { motion } from "framer-motion";

const cardData = [
  { title: "Fresh", description: "New Perspective", delay: 0 },
  { title: "10+", description: "Portfolio Photos", delay: 0.1 },
  { title: "Creative", description: "Vision", delay: 0.2 },
  { title: "Passionate", description: "About Stories", delay: 0.3 },
];

const About = () => {
  return (
    <section id="about"
      className="bg-gradient-to-br from-black to-neutral-900  text-white py-14 px-6">
      <div className="max-w-[1080px] mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-1">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group w-full max-w-[300px] sm:max-w-[265px] sm:w-96">
            <img
              src={aboutImage}
              alt="About me"
              className="rounded-[14px] shadow-lg w-full bg-transparent sm:mt-14 select-none pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Text overlay */}
            <div
              className="absolute sm:left-3 sm:top-16 top-3 left-3 text-sm sm:text-base font-serif font-semibold 
                 text-[#131E3A] opacity-0 group-hover:opacity-100 
                 group-active:opacity-100 transition-opacity duration-300"
            >
              <span className="text-[#b90e0A] text-[20px] sm:text-[22px] font-bold">|</span>{" "}
              <span>Kunjal Garg</span>
            </div>
          </div>
        </div>

        {/* Text Column */}
        <div className="w-full md:w-1/2 space-y-*">
          <h2 className="text-3xl md:text-[48px] font-serif mt-9 mb-7">About Me</h2>
          <p className="text-gray-300 text-sm md:text-[18px] leading-relaxed text-left">
            I’m a BTech student and an aspiring freelance photographer, deeply
            inspired by stillness, movement, and moments that often go
            unnoticed. With an eye for detail and emotion, I aim to capture the
            stories hidden in silence and simplicity. Every photo I take is a page
            from my life — raw, real, and quietly powerful.
          </p>

          {/*Cards BELOW paragraph */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 sm:gap-x-0 
          gap-x-3 gap-y-3 sm:gap-y-5 pt-2">
            {cardData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: card.delay, duration: 0.6 }}
                className="bg-neutral-900 text-white p-6 md:p-8 w-full rounded-[8px] shadow-md 
                  hover:shadow-xl transition-all max-w-[230px] mx-auto "
              >
                <h3 className="text-[22px] md:text-[30px] text-center font-serif mb-1">{card.title}</h3>
                <p className="text-[11px] md:text-[15px] text-center text-neutral-500">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default About;
