"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaEnvelopeOpenText, FaEnvelope, FaPhoneVolume } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";

export default function DigitalInviteLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = () => {
    alert('Please also reach out to us via, Whatsapp for fast response. Message sent! We\'ll get back to you soon.');
  };

  const services = [
    {
      icon: <FaEnvelope/>,
      title: "Wedding Invitations",
      description: "Elegant digital wedding invitations with RSVP management"
    },
    {
      icon: <MdCelebration/>,
      title: "Event Invitations", 
      description: "Professional invites for corporate events, parties, and celebrations"
    },
    {
      icon: <FaPhoneVolume/>,
      title: "Mobile Optimized",
      description: "Beautiful designs that look perfect on all devices"
    },
    {
      icon: <MdOutlineManageAccounts/>,
      title: "Guest Management",
      description: "Track RSVPs, manage guest lists, and send reminders"
    }
  ];

  const portfolioItems = [
    {
      title: "Elegant Wedding",
      description: "Minimalist design with gold accents and RSVP integration",
      category: "Wedding"
    },
    {
      title: "Corporate Event",
      description: "Professional invitation with agenda and networking features",
      category: "Corporate"
    },
    {
      title: "Birthday Celebration",
      description: "Fun and colorful design with interactive photo gallery",
      category: "Birthday"
    },
    {
      title: "Baby Shower",
      description: "Soft pastel theme with gift registry integration",
      category: "Baby Shower"
    },
    {
      title: "Graduation Party",
      description: "Bold design celebrating achievements with photo timeline",
      category: "Graduation"
    },
    {
      title: "Anniversary",
      description: "Romantic design with memory lane photo slideshow",
      category: "Anniversary"
    }
  ];

  const cardAnimations = [
    'animate__fadeInUp',
    'animate__fadeInLeft',
    'animate__fadeInRight',
    'animate__zoomIn',
    'animate__fadeInUp',
    'animate__fadeInDown'
  ];

  const [portfolioInView, setPortfolioInView] = useState(false);
  const [contactInView, setContactInView] = useState(false);
  const portfolioRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'portfolio' && entry.isIntersecting) {
            setPortfolioInView(true);
          }
          if (entry.target.id === 'contact' && entry.isIntersecting) {
            setContactInView(true);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    if (portfolioRef.current) observer.observe(portfolioRef.current);
    if (contactRef.current) observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
      <div className="relative min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo - Left */}
              <div className="flex items-center gap-3">
                <Image
                  src="/DigiviteLogo.png"
                  alt="Digivite Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="text-2xl font-dm-serif text-white">Digivite</span>
              </div>
              
              {/* Desktop Menu - Center */}
              <div className="hidden md:flex items-center space-x-12">
                <a href="#services" className="font-playfair text-white hover:text-gray-300 transition-colors text-lg">
                  Services
                </a>
                <a href="#portfolio" className="font-playfair text-white hover:text-gray-300 transition-colors text-lg">
                  Portfolio
                </a>
                <a href="#contact" className="font-playfair text-white hover:text-gray-300 transition-colors text-lg">
                  Contact
                </a>
              </div>

              {/* Desktop CTA Button - Right */}
              <div className="hidden md:block">
                <a href="#contact" className="bg-white text-black font-playfair px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-200 transition-all transform hover:scale-105">
                  Get Started
                </a>
              </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                <span className="text-white text-2xl">☰</span>
              </button>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-white/20 py-6">
                <div className="flex flex-col space-y-6">
                  <a href="#services" className="font-playfair text-white px-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Services
                  </a>
                  <a href="#portfolio" className="font-playfair text-white px-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Portfolio
                  </a>
                  <a href="#contact" className="font-playfair text-white px-4 text-lg" onClick={() => setIsMenuOpen(false)}>
                    Contact
                  </a>
                  <a href="#contact" className="bg-white text-black mx-4 py-3 rounded-full text-center font-playfair text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-[700px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero.jpg"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/75"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 h-full flex items-end pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                {/* Left Side - Large Title */}
                <div className="relative">
                  {/* Small text above */}
                  <p className="font-playfair text-white/90 text-lg mb-36 tracking-wider uppercase">
                    [Beautiful Digital Invitations]
                  </p>
                  
                  {/* Large DIGIVITE text */}
                  <h1 className="font-dm-serif text-white text-7xl sm:text-8xl lg:text-[200px] leading-none tracking-tight">
                    DIGIVITE
                  </h1>
                </div>
                
                {/* Right Side - Image and Description */}
                <div className="flex flex-col items-start">
                  <div className="flex items-start gap-6 mb-8 md:mb-16 z-40">
                    {/* Small Image */}
                    <div className="relative w-[300px] h-[200px] hidden md:flex">
                      <Image
                        src="/display.jpg"
                        alt="Digital Invitation"
                        fill
                        className="rounded-lg object-cover shadow-xl grayscale"
                      />
                      <div className="absolute inset-0 bg-black/45 rounded-lg" />
                    </div>
                    {/* Description Text */}
                    <div className="flex-1">
                      <p className="font-playfair text-white text-lg leading-relaxed max-w-md text-left">
                        Create stunning, personalized digital invitations for your special events. 
                        Elegant designs, easy RSVP management, and eco-friendly solution.
                      </p>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 z-40">
                    <a href="#contact" className="bg-white text-black font-playfair px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl">
                      Start Your Project
                    </a>
                    <a href="https://buildwithyehhmii.vercel.app/" className="border-2 border-white text-white hover:bg-white hover:text-black font-playfair px-8 py-4 rounded-full text-lg font-medium transition-all">
                      View Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="relative py-20 bg-black overflow-hidden">
          {/* Decorative Shapes */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Large circles */}
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
            
            {/* Rectangles */}
            <div className="absolute top-1/3 right-10 w-20 h-8 bg-white/10 rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-12 h-12 border border-white/15 rotate-12"></div>
            
            {/* Lines */}
            <div className="absolute top-1/2 left-0 w-32 h-px bg-white/20"></div>
            <div className="absolute bottom-1/4 right-0 w-24 h-px bg-white/15"></div>
            
            {/* Triangles */}
            <div className="absolute top-40 left-1/3 w-0 h-0 border-l-8 border-r-8 border-b-14 border-l-transparent border-r-transparent border-b-white/10"></div>
            <div className="absolute bottom-40 right-1/4 w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-white/15"></div>
            
            {/* Small dots */}
            <div className="absolute top-1/4 right-1/2 w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-white/20 rounded-full"></div>
            <div className="absolute top-3/4 left-20 w-1 h-1 bg-white/40 rounded-full"></div>
          </div>

          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="font-dm-serif text-white/5 text-8xl sm:text-9xl lg:text-[12rem] xl:text-[15rem] leading-none select-none">
              DIGIVITE
            </h2>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-dm-serif text-white mb-6">
                Our Services
              </h2>
              <p className="font-playfair text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
                We specialize in creating memorable digital experiences for your special occasions
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group relative p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Card decorative element */}
                  <div className="absolute top-4 right-4 w-8 h-8 border border-white/20 rounded-full group-hover:border-white/40 transition-colors"></div>
                  
                  <div className="text-center">
                    <div className="text-5xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto text-white">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-dm-serif text-white mb-4 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-playfair text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-px bg-white/30 group-hover:w-20 group-hover:bg-white/60 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section ref={portfolioRef} id="portfolio" className="relative py-20 bg-[#dfdfdf] overflow-hidden">
          {/* Decorative Shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-16 left-8 w-20 h-20 border border-black/10 rotate-45"></div>
            <div className="absolute top-32 right-16 w-16 h-16 bg-black/5 rounded-full"></div>
            <div className="absolute bottom-40 left-1/4 w-24 h-2 bg-black/10 rotate-12"></div>
            <div className="absolute top-1/2 right-8 w-12 h-12 border border-black/15 rotate-45"></div>
            <div className="absolute bottom-20 left-16 w-8 h-32 bg-black/5 rotate-45"></div>
            <div className="absolute top-24 left-1/3 w-3 h-3 bg-black/20 rounded-full"></div>
            <div className="absolute bottom-32 right-1/3 w-2 h-2 bg-black/30 rounded-full"></div>
            <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-black/15 rounded-full"></div>
          </div>

          {/* Crime Scene Tape Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-full h-16 bg-white border-t-4 border-b-4 border-black transform rotate-12 shadow-lg">
              <div className="flex items-center h-full overflow-hidden">
                <div className="animate-pulse text-black font-bold text-lg tracking-wider whitespace-nowrap">
                  DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • 
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-1/3 -right-20 w-full h-16 bg-yellow-300 border-t-4 border-b-4 border-black transform -rotate-12 shadow-lg">
              <div className="flex items-center h-full overflow-hidden">
                <div className="animate-pulse text-black font-bold text-lg tracking-wider whitespace-nowrap">
                  DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • 
                </div>
              </div>
            </div>
          </div>

          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="font-dm-serif text-black/5 text-8xl sm:text-9xl lg:text-[12rem] xl:text-[15rem] leading-none select-none">
              DIGIVITE
            </h2>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className={`text-center mb-16 ${portfolioInView ? 'animate__animated animate__fadeInDown' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-dm-serif text-black mb-6">
                Recent Work
              </h2>
              <p className="font-playfair text-black/70 text-xl max-w-2xl mx-auto leading-relaxed">
                Explore some of our beautiful digital invitation designs
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`group cursor-pointer relative ${
                    portfolioInView 
                      ? `animate__animated ${cardAnimations[index]} animate__delay-${index + 1}s` 
                      : 'opacity-0'
                  }`}
                  style={{ animationDelay: portfolioInView ? `${index * 0.2}s` : '0s' }}
                >
                  <div className="h-80 rounded-2xl bg-black/90 backdrop-blur-sm border border-white/20 p-8 flex flex-col justify-center items-center text-center group-hover:bg-black group-hover:border-white/40 transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-xl">
                    
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 group-hover:border-white/60 transition-colors"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 group-hover:border-white/60 transition-colors"></div>
                    
                    <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-300">
                      <FaEnvelopeOpenText className='text-white'/>
                    </div>
                    
                    <div className="absolute top-4 left-4 font-playfair text-white/40 text-sm uppercase tracking-widest group-hover:text-white/70 transition-colors">
                      {item.category}
                    </div>
                    
                    <h3 className="text-2xl font-dm-serif text-white mb-4 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-playfair text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                      {item.description}
                    </p>
                    
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-white/30 group-hover:w-24 group-hover:bg-white/60 transition-all duration-300"></div>
                  </div>

                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
            
            <div className={`text-center mt-16 ${portfolioInView ? 'animate__animated animate__fadeInUp animate__delay-2s' : 'opacity-0'}`}>
              <a 
                href="https://buildwithyehhmii.vercel.app/" 
                className="inline-flex items-center gap-3 bg-black text-white font-playfair px-10 py-4 rounded-full text-lg font-medium border-2 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Full Portfolio
                <span className="text-xl">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} id="contact" className="relative py-20 bg-gray-100 overflow-hidden">
          {/* Newspaper texture background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='7' r='1'/%3E%3Ccircle cx='7' cy='53' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Crime Scene Tape Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-full h-16 bg-yellow-300 border-t-4 border-b-4 border-black transform rotate-12 shadow-lg">
              <div className="flex items-center h-full overflow-hidden">
                <div className="animate-pulse text-black font-bold text-lg tracking-wider whitespace-nowrap">
                  DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • 
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-1/3 -right-20 w-full h-16 bg-white border-t-4 border-b-4 border-black transform -rotate-12 shadow-lg">
              <div className="flex items-center h-full overflow-hidden">
                <div className="animate-pulse text-black font-bold text-lg tracking-wider whitespace-nowrap">
                  DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • DIGIVITE • 
                </div>
              </div>
            </div>
          </div>

          {/* Scattered newspaper elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-16 w-24 h-32 bg-white border border-black/20 transform rotate-12 shadow-md opacity-60"></div>
            <div className="absolute bottom-32 right-20 w-20 h-28 bg-white border border-black/20 transform -rotate-6 shadow-md opacity-40"></div>
            <div className="absolute top-1/2 left-8 w-16 h-20 bg-white border border-black/20 transform rotate-45 shadow-md opacity-30"></div>
            <div className="absolute top-40 right-1/4 w-32 h-1 bg-black/20 transform rotate-12"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-1 bg-black/15 transform -rotate-6"></div>
            <div className="absolute top-32 left-1/2 w-4 h-4 bg-black/20 rounded-full"></div>
            <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-black/25 rounded-full"></div>
            <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-black/30 rounded-full"></div>
          </div>

          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="font-dm-serif text-black/5 text-8xl sm:text-9xl lg:text-[12rem] xl:text-[15rem] leading-none select-none transform rotate-3">
              DIGIVITE
            </h2>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className={`text-center mb-16 ${contactInView ? 'animate__animated animate__fadeInDown' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-dm-serif text-black mb-6">
                Let's Work Together
              </h2>
              <p className="font-playfair text-black/70 text-xl max-w-2xl mx-auto leading-relaxed">
                Ready to create something beautiful? Get in touch and let's discuss your project.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Info - Animate from Left */}
              <div className={`space-y-8 ${contactInView ? 'animate__animated animate__fadeInLeft animate__delay-1s' : 'opacity-0'}`}>
                <h3 className="text-2xl font-dm-serif text-black mb-8 border-b-2 border-black pb-2">
                  Contact Information
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-white border-l-4 border-black shadow-md">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xl"><FaEnvelope/></span>
                    </div>
                    <div>
                      <p className="font-dm-serif text-black text-lg">Email</p>
                      <a href="mailto:yehhmiihithub@gmail.com" className="font-playfair text-black/70 hover:text-black underline">
                        yehhmiihithub@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white border-l-4 border-black shadow-md">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xl"><FaPhoneVolume/></span>
                    </div>
                    <div>
                      <p className="font-dm-serif text-black text-lg">Phone</p>
                      <a href="tel:+2348161452449" className="font-playfair text-black/70 hover:text-black underline">
                        + (234) 8161452449
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white border-l-4 border-black shadow-md">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">💬</span>
                    </div>
                    <div>
                      <p className="font-dm-serif text-black text-lg">WhatsApp</p>
                      <a href="https://wa.me/8158619466" className="font-playfair text-black/70 hover:text-black underline">
                        + (234) 8158619466
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white border-l-4 border-black shadow-md">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xl"><CgWebsite/></span>
                    </div>
                    <div>
                      <p className="font-dm-serif text-black text-lg">Website</p>
                      <a href="https://buildwithyehhmii.vercel.app/" className="font-playfair text-black/70 hover:text-black underline">
                        buildwithyehhmii.vercel.app
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form - Animate from Right */}
              <div className={`relative ${contactInView ? 'animate__animated animate__fadeInRight animate__delay-1s' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gray-300 rounded-lg transform rotate-1 translate-x-2 translate-y-2"></div>
                <div className="absolute inset-0 bg-gray-400 rounded-lg transform rotate-2 translate-x-1 translate-y-1"></div>
                
                <div className="relative bg-white rounded-lg p-8 shadow-2xl transform -rotate-2 border-4 border-black/20">
                  <div className="border-b-4 border-black pb-4 mb-6">
                    <h3 className="text-3xl font-dm-serif text-black text-center tracking-wide">
                      DIGIVITE TIMES
                    </h3>
                    <p className="font-playfair text-center text-black/60 text-sm mt-1">
                      Send Your Message Today
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="font-playfair text-black/80 text-sm uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 border-2 border-black/20 rounded-none focus:outline-none focus:border-black bg-gray-50 font-playfair"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="font-playfair text-black/80 text-sm uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-3 border-2 border-black/20 rounded-none focus:outline-none focus:border-black bg-gray-50 font-playfair"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="font-playfair text-black/80 text-sm uppercase tracking-wider block mb-1">
                        Service Type
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-black/20 rounded-none focus:outline-none focus:border-black bg-gray-50 font-playfair">
                        <option>Select Service</option>
                        <option>Wedding Invitation</option>
                        <option>Event Invitation</option>
                        <option>Corporate Event</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div className="relative">
                      <label className="font-playfair text-black/80 text-sm uppercase tracking-wider block mb-1">
                        Your Message
                      </label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-black/20 rounded-none focus:outline-none focus:border-black bg-gray-50 font-playfair"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={handleSubmit}
                      className="w-full bg-black text-white py-4 rounded-none font-playfair font-bold text-lg uppercase tracking-wider hover:bg-gray-800 transition-colors border-2 border-black"
                    >
                      Send Message
                    </button>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gray-200 transform rotate-45 translate-x-4 -translate-y-4 border-l border-b border-black/20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-black text-white py-16 overflow-hidden">
          {/* Dark newspaper texture background */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3Ccircle cx='35' cy='5' r='1'/%3E%3Ccircle cx='5' cy='35' r='1'/%3E%3Ccircle cx='35' cy='35' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Dark newspaper clippings */}
            <div className="absolute top-12 left-10 w-20 h-28 bg-white/5 border border-white/10 transform rotate-12 shadow-lg"></div>
            <div className="absolute bottom-20 right-16 w-24 h-32 bg-white/5 border border-white/10 transform -rotate-6 shadow-lg"></div>
            <div className="absolute top-1/2 right-8 w-16 h-20 bg-white/5 border border-white/10 transform rotate-45 shadow-lg"></div>
            
            {/* Typography lines */}
            <div className="absolute top-20 left-1/3 w-40 h-px bg-white/10 transform rotate-12"></div>
            <div className="absolute bottom-1/3 right-1/4 w-32 h-px bg-white/15 transform -rotate-6"></div>
            <div className="absolute top-1/3 left-1/4 w-24 h-px bg-white/10 transform rotate-45"></div>
            
            {/* Geometric shapes */}
            <div className="absolute top-1/4 right-1/3 w-12 h-12 border border-white/10 rotate-45"></div>
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-white/10 rounded-full"></div>
            
            {/* Small dots like ink spots */}
            <div className="absolute top-16 right-1/4 w-3 h-3 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-white/25 rounded-full"></div>
            <div className="absolute top-3/4 right-1/2 w-4 h-4 bg-white/15 rounded-full"></div>
          </div>

          {/* Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="font-dm-serif text-white/5 text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none select-none transform -rotate-3">
              DIGIVITE
            </h2>
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/DigiviteLogo.png"
                    alt="Digivite Logo"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-2xl font-dm-serif">Digivite</span>
                </div>
                <p className="font-playfair text-white/70 leading-relaxed text-lg max-w-md">
                  Creating beautiful digital invitations that make your special occasions memorable. 
                  Professional service, elegant designs, and seamless user experience.
                </p>
                
                {/* Decorative line */}
                <div className="mt-6 w-32 h-px bg-white/30"></div>
              </div>
              
              {/* Services Column */}
              <div className="relative">
                {/* Column header with newspaper style */}
                <div className="border-b-2 border-white/20 pb-2 mb-6">
                  <h4 className="font-dm-serif text-white text-xl">Services</h4>
                </div>
                <ul className="space-y-3 font-playfair text-white/70">
                  <li className="hover:text-white transition-colors cursor-pointer border-l-2 border-transparent hover:border-white/30 pl-2">
                    Wedding Invitations
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer border-l-2 border-transparent hover:border-white/30 pl-2">
                    Event Invitations
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer border-l-2 border-transparent hover:border-white/30 pl-2">
                    RSVP Management
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer border-l-2 border-transparent hover:border-white/30 pl-2">
                    Custom Designs
                  </li>
                </ul>
              </div>
              
              {/* Quick Links Column */}
              <div className="relative">
                {/* Column header with newspaper style */}
                <div className="border-b-2 border-white/20 pb-2 mb-6">
                  <h4 className="font-dm-serif text-white text-xl">Quick Links</h4>
                </div>
                <ul className="space-y-3 font-playfair text-white/70">
                  <li>
                    <a href="#services" className="hover:text-white transition-colors border-l-2 border-transparent hover:border-white/30 pl-2 block">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#portfolio" className="hover:text-white transition-colors border-l-2 border-transparent hover:border-white/30 pl-2 block">
                      Portfolio
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-white transition-colors border-l-2 border-transparent hover:border-white/30 pl-2 block">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors border-l-2 border-transparent hover:border-white/30 pl-2 block">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bottom section with newspaper style */}
            <div className="relative">
              {/* Decorative line with dots */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex-1 h-px bg-white/20"></div>
                <div className="mx-4 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="mx-2 w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="mx-4 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
              
              {/* Copyright with newspaper styling */}
              <div className="text-center">
                <div className="inline-block bg-white/5 border border-white/20 px-8 py-4 transform -rotate-1">
                  <p className="font-playfair text-white/60 text-sm tracking-wider">
                    © 2024 DIGIVITE DIGITAL PRESS
                  </p>
                  <p className="font-playfair text-white/40 text-xs mt-1">
                    All rights reserved. Made with precision for your special moments.
                  </p>
                </div>
              </div>
              
              {/* Final decorative elements */}
              <div className="absolute bottom-0 left-1/4 w-16 h-px bg-white/20 transform rotate-45"></div>
              <div className="absolute bottom-0 right-1/4 w-12 h-px bg-white/20 transform -rotate-45"></div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}