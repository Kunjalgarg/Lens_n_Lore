import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  // const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Message sent successfully!");
    setMessageSent(true);
    setFormData({ name: "", email: "", message: "" });
    // setLoading(true);
    // setStatus("");

    try {
      const res = await fetch("https://lens-n-lore.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Something went wrong!");
        setMessageSent(false);
      }
      // if (res.ok) {
      //   setStatus("Message sent successfully!");
      //   setFormData({ name: "", email: "", message: "" });
      // } else {
      //   setStatus(data.error || "Something went wrong!");
      // }
    } catch (error) {
      setStatus("Server error. Try again later.");
      setMessageSent(false);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="relative bg-white text-black w-full max-w-lg p-8 rounded-lg shadow-lg animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl hover:text-red-600 transition"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center font-serif">Start a Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 
              focus:outline-none focus:ring focus:ring-black"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 
              focus:outline-none focus:ring focus:ring-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Message</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 
              focus:outline-none focus:ring focus:ring-black resize-none"
              placeholder="Tell us about your project..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-white hover:text-black 
            border border-black transition-all"
          >
            {messageSent ? "Send Another Message" : "Send Message"}
          </button>

          {status && <p className="text-sm text-center mt-2 text-gray-700">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
