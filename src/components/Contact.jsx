import React from "react";
import { FiMail } from "react-icons/fi";

const Contact = ({ onOpenForm }) => {
  return (
    <section
      id="contact"
      className="text-white bg-gradient-to-br from-black to-neutral-900 text-white 
      px-4 sm:px-6 lg:px-12 py-20 sm:py-24 md:py-32
      text-center font-serif scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-[46px] font-serif mb-6 sm:mt-4 sm:mb-10 text-center 
        transform scale-y-125 tracking-wider">
          Get in Touch
        </h2>

        <p className="px-2 text-base sm:text-lg md:text-xl opacity-70 font-sans font-light mb-12 sm:mb-16 max-w-4xl mx-auto">
          Ready to capture your story? Let's discuss your vision and bring it to life through photography.
        </p>

        {/* Contact Cards Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Email Card */}
          <div className="bg-neutral-900 text-white p-6 rounded-md w-full max-w-xs md:w-[320px] h-auto
          flex flex-col items-center shadow-lg hover:shadow-xl transition duration-300">
            <div className="flex items-center gap-2 opacity-80">
              <FiMail size={20} className="mb-4" />
              <h3 className="text-[12px] mb-3">Email Me</h3>
            </div>
            <p className="text-[21px] font-white break-words">kunjal@example.com</p>
          </div>
        </div>
          <button
            onClick={onOpenForm}
            className="mt-10 sm:mt-12 px-6 py-3 bg-white text-sm sm:text-base sm:text-[18px] text-black 
            rounded-sm hover:bg-transparent hover:text-white border border-white 
            transition-all hover:scale-105 duration-300"
          >
            Start a Project
          </button>
      </div>
    </section>
  );
};

export default Contact;
