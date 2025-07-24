import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const services = [
  {
    title: "Portrait Photography",
    description: "Capturing timeless emotions and elegant expressions in natural light.",
  },
  {
    title: "Wedding Photography",
    description: "Professional wedding shoots with fresh creativity and passionate attention to detail.",
  },
  {
    title: "Event Coverage",
    description: "Telling stories through vibrant candid shots of your special moments.",
  },

  {
    title: "Travel & Scenery",
    description: "Breathtaking landscapes and travel moments preserved forever.",
  }
];

const Services = () => {
  return (
    <section id="services" className="bg-black text-white py-20 px-6 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-[52px] font-serif sm:mt-16 mb-16 text-center 
        transform scale-y-105">
          Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-8 rounded-[15px] shadow-lg 
              transition-transform duration-300 cursor-pointer border border-white/10 w-full sm:w-70"
              whileHover={{
                y: -10,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              viewport={{ once: true }}
            >
              <Camera className="w-7 h-7 sm:w-6 h-6 text-neutral-100 mb-1 sm:mb-3 sm:mt-2" />

              <h3 className=" text-[25px] sm:text-[22px] mb-3 mt-1 sm:mb-3 sm:mt-5 font-serif text-center">{service.title}</h3>
              <p className="text-[19px] sm:text-[18px] text-gray-300 font-light leading-relaxed text-center">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
