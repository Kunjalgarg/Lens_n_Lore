import React, { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import About from './components/About';
import Services from './components/Services';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Contact from './components/Contact';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar onOpenForm={() => setShowForm(true)} />
      <Hero onOpenForm={() => setShowForm(true)} />
      <Gallery />
      <About />
      <Services />
      <Contact onOpenForm={() => setShowForm(true)} />
      <ContactForm isOpen={showForm} onClose={() => setShowForm(false)} />
      <Footer />
    </div>
  );
}

export default App;
