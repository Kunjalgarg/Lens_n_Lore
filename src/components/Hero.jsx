import React from 'react';
import { Link } from 'react-scroll';

const Hero = () => {
    return (
        <section
            id="hero"
            className="min-h-fit flex flex-col items-center justify-center bg-gradient-to-tr from-black 
            to-neutral-900 text-white sm:px-6 sm:pt-28 px-4 pt-24 pb-2 sm:pb-12"

        >
            <div className="max-w-4xl text-center space-y-*">
                <h1 className="text-4xl sm:text-5xl md:text-[90px] font-open font-light font-serif mb-1 
                leading-tight tracking-wide">
                    Lens & Lore
                </h1>
                <p className="mt-0 mb-5 text-base sm:text-sm md:text-[14px] italic font-open font-light 
                opacity-80 leading-loose w-full tracking-wider">
                    "Not Just What You See — But What You Almost Missed"
                </p>

                <p className="mt-4 mb-9 font-serif text-sm sm:text-lg text-neutral-400 md:text-[24px] font-medium ">
                    Kunjal Garg
                </p>

                <p className="text-sm sm:text-[20px] md:text-[19px] mt-6 sm:mt-6 sm:mb-3 leading-[2.4] max-w-auto 
                sm:max-w-[700px] mx-auto text-neutral-400 opacity-90 whitespace-pre-line text-center">
                    Capturing life's fleeting moments and profound emotions through my lens. As a
                    passionate photographer starting my journey, I find beauty in everyday scenes and
                    extraordinary stories. My work focuses on authentic moments, natural light, and the
                    poetry of life itself.
                </p>

                <Link
                    to="gallery"
                    smooth={true}
                    duration={600}
                    className="inline-block bg-white text-black px-6 py-3 sm:px-7 sm:py-4 mt-8 rounded-sm 
                    text-base sm:text-xl font-medium border border-transparent hover:border-white 
                    hover:text-white hover:bg-black hover:scale-105 duration-300 transition-all"

                >
                    <button> View My Work </button>
                </Link>
            </div>
        </section>
    );
};

export default Hero;
