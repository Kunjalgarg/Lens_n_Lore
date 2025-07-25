import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../index.css";
import { X, Download } from "lucide-react";


const mainImages = [
  "01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg",
  "06.jpg", "07.jpg", "08.jpg", "09.jpg", "010.jpg",
];

const subImagesMap = {
  "01.jpg": ["011.jpg", "012.jpg", "013.jpg"],
  "02.jpg": ["021.jpg", "022.jpg", "023.jpg", "024.jpg", "025.jpg"],
  "03.jpg": ["031.jpg", "032.jpg", "033.jpg", "034.jpg", "035.jpg"],
  "04.jpg": ["041.jpg", "042.jpg"],
  "05.jpg": ["051.jpg", "052.jpg", "053.jpg"],
  "06.jpg": ["061.jpg", "062.jpg", "063.jpg"],
  "07.jpg": ["071.jpg", "072.jpg", "073.jpg", "074.jpg", "075.jpg"],
  "08.jpg": ["081.jpg", "082.jpg", "083.jpg"],
  "09.jpg": ["091.jpg", "092.jpg", "093.jpg", "094.jpg"],
  "010.jpg": ["0101.jpg", "0102.jpg", "0103.jpg", "0104.jpg"],
};

const textOverlayMap = {
  "01.jpg": { title: "Veins of Earth", caption: "Captured in Haryana, Punjab, Delhi" },
  "02.jpg": { title: "Golden Hour", caption: "Shot on Phone" },
  "03.jpg": { title: "Sky Cotton", caption: "Natural Light" },
  "04.jpg": { title: "Urban Life", caption: "Winter Burn" },
  "05.jpg": { title: "Heights of Serenity", caption: "Framed in Himachal" },
  "06.jpg": { title: "Wispy Blues", caption: "Long Exposure" },
  "07.jpg": { title: "Monsoon Diaries", caption: "Stillness" },
  "08.jpg": { title: "Forest Walk", caption: "Ornamented by Nature" },
  "09.jpg": { title: "Crimson Fragrance", caption: "Phoolon Ka Saaz" },
  "010.jpg": { title: "मैं कैदी नंबर 213", caption: "गर्ग साहब" },
};

const getTouchDistance = (touches) => {
  const [touch1, touch2] = touches;
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const Gallery = () => {
  const imgRef = useRef(null);
  const [constraints, setConstraints] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeMain, setActiveMain] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(3); // 1 = normal, 2 = zoomed, 3 = max zoom
  const [isHovered, setIsHovered] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const scale = useMotionValue(1); // dynamic scale for pinch or click
  const controls = useAnimation();
  const lastTouchDistanceRef = useRef(null);
  const [activeSubIndex, setActiveSubIndex] = useState(null);
  const [activeParentMain, setActiveParentMain] = useState(null);
  const [isTouching, setIsTouching] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [showTouchOverlay, setShowTouchOverlay] = useState(false);
  const holdTimeoutRef = useRef(null);

  const handleDownloadRequest = async (imageName) => {
    console.log("🔔 Button clicked for:", imageName);
    const userName = prompt("Enter your name for download permission:");
    if (!userName) return;

    try {
      const response = await fetch(`https://lens-n-lore.onrender.com/api/request-download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageName,
          user: userName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.allowed) {
        console.log("✅ Approved. Proceeding with download...");
        const link = document.createElement("a");
        link.href = `https://lens-n-lore.onrender.com/api/image/${imageName}?user=${userName}`;
        link.download = imageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log("❌ Not approved. Showing alert only.");
        alert("Unknown user, contact admin for approval.");
      }

    } catch (err) {
      console.error("Download request failed:", err);
      alert("Something went wrong.");
    }
  };


  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.changedTouches[0].clientX);
  };


  const handleZoom = () => {
    const nextZoom = zoomLevel === 3 ? 1 : zoomLevel + 1;
    setZoomLevel(nextZoom);
    controls.start({ scale: nextZoom === 1 ? 1 : nextZoom === 2 ? 1.25 : 1.5 });
  };

  useLayoutEffect(() => {
    if (!imgRef.current || zoomLevel === 1) {
      setConstraints({ top: 0, bottom: 0, left: 0, right: 0 });
      return;
    }

    const container = imgRef.current.getBoundingClientRect();
    const zoomFactor = zoomLevel === 2 ? 1.25 : 1.5;

    const extraX = (container.width * zoomFactor - container.width) / 2;
    const extraY = (container.height * zoomFactor - container.height) / 2;

    setConstraints({
      top: -extraY,
      bottom: extraY,
      left: -extraX,
      right: extraX,
    });
  }, [zoomLevel]);

  useEffect(() => {
    return () => clearTimeout(holdTimeoutRef.current);
  }, []);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setZoomLevel(1);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) {
        // Sub-image navigation inside modal
        if (activeSubIndex !== null && activeParentMain) {
          const subImages = subImagesMap[activeParentMain];
          if (!subImages || subImages.length === 0) return;

          if (e.key === "ArrowRight") {
            const nextIndex = (activeSubIndex + 1) % subImages.length;
            setActiveMain(subImages[nextIndex]);
            setActiveSubIndex(nextIndex);
            setZoomLevel(1);
          } else if (e.key === "ArrowLeft") {
            const prevIndex = (activeSubIndex - 1 + subImages.length) % subImages.length;
            setActiveMain(subImages[prevIndex]);
            setActiveSubIndex(prevIndex);
            setZoomLevel(1);
          }
        }
      } else {
        // Main image slider navigation
        if (e.key === "ArrowRight") {
          setSlideDirection("right");
          setScrollIndex((prev) => (prev + 1) % mainImages.length);
        } else if (e.key === "ArrowLeft") {
          setSlideDirection("left");
          setScrollIndex((prev) => (prev === 0 ? mainImages.length - 1 : prev - 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, activeSubIndex, activeParentMain]);




  const handlePrev = () => {
    setSlideDirection("left");
    setScrollIndex((prev) => (prev === 0 ? mainImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideDirection("right");
    setScrollIndex((prev) => (prev + 1) % mainImages.length);
  };


  const goToSlide = (index) => {
    setScrollIndex(index);
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setSlideDirection("right");
      setScrollIndex((prev) =>
        prev === mainImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    const img = imgRef.current;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        lastTouchDistanceRef.current = getTouchDistance(e.touches);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
        const currentDistance = getTouchDistance(e.touches);
        const distanceDelta = currentDistance - lastTouchDistanceRef.current;

        if (Math.abs(distanceDelta) > 10) {
          // Simple scale steps
          setZoomLevel((prev) => {
            if (distanceDelta > 0 && prev < 3) return prev + 1;
            if (distanceDelta < 0 && prev > 1) return prev - 1;
            return prev;
          });
          controls.start({ scale: zoomLevel === 1 ? 1 : zoomLevel === 2 ? 1.25 : 1.5 });
          lastTouchDistanceRef.current = currentDistance;
        }
      }
    };



    const handleTouchEnd = (e) => {
      // 👇 Swipe gesture logic
      if (touchStartX !== null && touchEndX !== null) {
        const deltaX = touchStartX - touchEndX;

        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            // Swiped left → next
            setSlideDirection("right");
            setScrollIndex((prev) => (prev + 1) % mainImages.length);
          } else {
            // Swiped right → previous
            setSlideDirection("left");
            setScrollIndex((prev) =>
              prev === 0 ? mainImages.length - 1 : prev - 1
            );
          }
        }

        setTouchStartX(null);
        setTouchEndX(null);
      }

      // 👇 Reset pinch zoom tracker
      lastTouchDistanceRef.current = null;
    };


    if (img) {
      img.addEventListener("touchstart", handleTouchStart, { passive: false });
      img.addEventListener("touchmove", handleTouchMove, { passive: false });
      img.addEventListener("touchend", handleTouchEnd, { passive: false });
    }

    return () => {
      if (img) {
        img.removeEventListener("touchstart", handleTouchStart);
        img.removeEventListener("touchmove", handleTouchMove);
        img.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [zoomLevel, showModal]);



  const openModal = (mainImg) => {
    setActiveMain(mainImg);
    setShowModal(true);
    setZoomLevel(1);
    setActiveSubIndex(null);
    setActiveParentMain(mainImg);
  };


  return (
    <section className="py-16 bg-black text-white" id="gallery">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 text center">
        <h2 className="text-2xl sm:text-3xl md:text-[48px] font-serif mt-10 mb-7 text-center">
          Portfolio Gallery
        </h2>
        <div className="w-full flex flex-col items-center">
          {/* Main Image Slider */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scrollIndex}
              initial={{ opacity: 0, x: slideDirection === "right" ? 200 : -200, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: slideDirection === "right" ? -200 : 200, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative group cursor-pointer rounded-lg overflow-hidden w-full 
              max-w-[90vw] sm:max-w-[70vw] md:max-w-[50vw] 
              aspect-[7/4] flex items-center justify-center bg-black mx-auto"
              onClick={() => openModal(mainImages[scrollIndex])}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              // ✅ Full Mobile Gesture Support
              onTouchStart={(e) => {
                setIsTouching(true);
                const x = e.changedTouches[0].clientX;
                setTouchStartX(x);
                setTouchEndX(null);

                // Start long press overlay reveal
                holdTimeoutRef.current = setTimeout(() => {
                  setShowTouchOverlay(true);
                }, 500);
              }}
              onTouchMove={(e) => {
                const x = e.changedTouches[0].clientX;
                setTouchEndX(x);

                // If moved more than a small threshold, cancel the hold
                if (Math.abs(x - touchStartX) > 10) {
                  clearTimeout(holdTimeoutRef.current);
                  setShowTouchOverlay(false);
                }
              }}

              onTouchEnd={() => {
                setIsTouching(false);
                clearTimeout(holdTimeoutRef.current);
                setShowTouchOverlay(false);

                if (!touchStartX || !touchEndX) return;

                const distance = touchStartX - touchEndX;
                const threshold = 50;

                if (distance > threshold) {
                  // Swiped left
                  handleNext();
                } else if (distance < -threshold) {
                  // Swiped right
                  handlePrev();
                }
              }}

            >
              <img
                src={require(`../assets/${mainImages[scrollIndex]}`)}
                alt={`Main ${scrollIndex}`}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full max-h-[240px] sm:max-h-[400px] md:max-h-[450px] object-contain 
                          transition-transform duration-300 
                          group-hover:scale-95 group-hover:opacity-70 select-none "
              />

              {/* Text Overlay */}
              <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 
                          text-xs sm:text-sm md:text-base text-white opacity-0 group-hover:opacity-100 
                          transition-all duration-500 translate-y-4 group-hover:translate-y-0
                          group-hover:scale-110 transform origin-top-left 
                          group-hover:blur-0 blur-sm bg-black/50 px-2 sm:px-3 py-1 sm:py-2 rounded-md
       ${isHovered || showTouchOverlay ? "opacity-100 translate-y-0 scale-110 blur-0" : "opacity-0"}`}
              >
                <p className="font-semibold">{textOverlayMap[mainImages[scrollIndex]]?.title}</p>
                <p className="text-xs text-gray-300">{textOverlayMap[mainImages[scrollIndex]]?.caption}</p>

              </div>
            </motion.div>
          </AnimatePresence>


          {/* Arrows + Dots */}
          <div className="flex items-center justify-center mt-5 gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={handlePrev}
              className="p-2 sm:p-3 text-white bg-black/30 hover:bg-black/50 rounded-full transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {mainImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${idx === scrollIndex ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 sm:p-3 text-white bg-black/30 hover:bg-black/50 rounded-full transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4">
            <button
              onClick={() => handleDownloadRequest(activeMain)}
              className="absolute top-10 right-20 sm:top-5 sm:right-16 text-white text-2xl sm:text-2xl"
              title="Ask owner for Download"
            >
              <Download className="w-8 h-8 sm:w-6 sm:h-8" />
            </button>
            <button
              className="absolute top-10 right-8 sm:top-6 sm:right-6 text-white text-4xl sm:text-2xl"
              onClick={() => {
                setShowModal(false);
                setZoomLevel(1);
              }}
            >
              <FaTimes />
            </button>
            <div className="w-full max-w-6xl flex flex-col items-center justify-center">
              {/* Zoomable Main Image */}
              <div className="">
                <motion.img
                  ref={imgRef}
                  src={require(`../assets/${activeMain}`)}
                  alt="Main"
                  onClick={handleZoom}
                  drag={zoomLevel > 1}
                  dragConstraints={constraints}
                  dragElastic={0.2}
                  animate={controls}
                  style={{ scale }}
                  transition={{ duration: 0.4 }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`
                rounded-lg shadow-lg
                w-full sm:w-[75vw] max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw]
                h-auto max-h-[80vh] 
                object-contain select-none
                ${zoomLevel === 1 ? "cursor-zoom-in" : "cursor-move"}
  `}
                />

                {/* <button
                  onClick={() => handleDownloadRequest(activeMain)}
                  className="text-sm mt-1 mb-0 text-gray-400 px-3 py-1 hover:text-white"
                >
                  Download
                </button> */}


                <div className="flex justify-between items-center w-full px-4 mt-4 md:hidden">
                  <button
                    onClick={() => {
                      const subImages = subImagesMap[activeParentMain];
                      if (!subImages) return;
                      const prevIndex = (activeSubIndex - 1 + subImages.length) % subImages.length;
                      setActiveMain(subImages[prevIndex]);
                      setActiveSubIndex(prevIndex);
                      setZoomLevel(1);
                    }}
                    className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={() => {
                      const subImages = subImagesMap[activeParentMain];
                      if (!subImages) return;
                      const nextIndex = (activeSubIndex + 1) % subImages.length;
                      setActiveMain(subImages[nextIndex]);
                      setActiveSubIndex(nextIndex);
                      setZoomLevel(1);
                    }}
                    className="text-white bg-white/10 hover:bg-white/20 p-3 rounded-full"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

              </div>

              {/* Sub-images Below Current Main Image */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 px-2 sm:px-0">
                {subImagesMap[activeMain]?.map((sub, i) => (
                  <img
                    key={i}
                    src={require(`../assets/${sub}`)}
                    alt={sub}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={() => {
                      setActiveMain(sub);
                      setActiveSubIndex(i);
                      setActiveParentMain(activeParentMain);
                      setZoomLevel(1);
                    }}
                    className="h-20 md:h-28 w-auto rounded-md cursor-pointer hover:scale-105 transition 
                    duration-300 select-none "
                  />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Gallery;
