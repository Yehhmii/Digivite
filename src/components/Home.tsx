"use client"
import React, { useState } from 'react';

export default function DigitalInviteLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      icon: "💌",
      title: "Wedding Invitations",
      description: "Elegant digital wedding invitations with RSVP management"
    },
    {
      icon: "🎉",
      title: "Event Invitations", 
      description: "Professional invites for corporate events, parties, and celebrations"
    },
    {
      icon: "📱",
      title: "Mobile Optimized",
      description: "Beautiful designs that look perfect on all devices"
    },
    {
      icon: "📊",
      title: "Guest Management",
      description: "Track RSVPs, manage guest lists, and send reminders"
    }
  ];

  const portfolioItems = [
    {
      title: "Elegant Wedding Suite",
      description: "Luxury wedding invitation with gold accents",
      color: "from-amber-100 to-orange-100"
    },
    {
      title: "Corporate Event",
      description: "Professional business event invitation",
      color: "from-blue-100 to-indigo-100"
    },
    {
      title: "Birthday Celebration",
      description: "Fun and colorful birthday party invite",
      color: "from-pink-100 to-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-200/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💌</span>
              <span className="text-xl font-serif font-medium text-amber-900">Digivite</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-amber-700 hover:text-amber-900 transition-colors">Services</a>
              <a href="#portfolio" className="text-amber-700 hover:text-amber-900 transition-colors">Portfolio</a>
              <a href="#contact" className="text-amber-700 hover:text-amber-900 transition-colors">Contact</a>
              <a href="#contact" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <span className="text-amber-900">☰</span>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-amber-200/30 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#services" className="text-amber-700 px-4">Services</a>
                <a href="#portfolio" className="text-amber-700 px-4">Portfolio</a>
                <a href="#contact" className="text-amber-700 px-4">Contact</a>
                <a href="#contact" className="bg-amber-600 text-white mx-4 py-2 rounded-lg text-center">
                  Get Started
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block animate-bounce">💌</span>
            <h1 className="text-4xl md:text-6xl font-serif font-light text-amber-900 mb-6">
              Beautiful Digital Invitations
            </h1>
            <p className="text-xl md:text-2xl text-amber-700 font-light max-w-3xl mx-auto leading-relaxed">
              Create stunning, personalized digital invitations for your special events. 
              Elegant designs, easy RSVP management, and eco-friendly solution.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a href="#contact" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg">
              Start Your Project
            </a>
            <a href="https://buildwithyehhmii.vercel.app/" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all">
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-4">
              Our Services
            </h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto">
              We specialize in creating memorable digital experiences for your special occasions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-medium text-amber-900 mb-2">{service.title}</h3>
                <p className="text-amber-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-4">
              Recent Work
            </h2>
            <p className="text-amber-700 text-lg max-w-2xl mx-auto">
              Explore some of our beautiful digital invitation designs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className={`h-64 rounded-xl bg-gradient-to-br ${item.color} p-8 flex flex-col justify-center items-center text-center group-hover:scale-105 transition-transform shadow-lg`}>
                  <div className="text-4xl mb-4">💌</div>
                  <h3 className="text-xl font-medium text-amber-900 mb-2">{item.title}</h3>
                  <p className="text-amber-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-amber-900 mb-4">
              Let's Work Together
            </h2>
            <p className="text-amber-700 text-lg">
              Ready to create something beautiful? Get in touch and let's discuss your project.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-medium text-amber-900 mb-6">Contact Information</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">📧</span>
                </div>
                <div>
                  <p className="font-medium text-amber-900">Email</p>
                  <a href="mailto:hello@digitalinvites.com" className="text-amber-700 hover:text-amber-900">
                    yehhmiihithub@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">📱</span>
                </div>
                <div>
                  <p className="font-medium text-amber-900">Phone</p>
                  <a href="tel:+2348161452449" className="text-amber-700 hover:text-amber-900">
                    + (234) 8161452449
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">💬</span>
                </div>
                <div>
                  <p className="font-medium text-amber-900">WhatsApp</p>
                  <a href="https://wa.me/8158619466" className="text-amber-700 hover:text-amber-900">
                    + (234) 8158619466
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600">🌐</span>
                </div>
                <div>
                  <p className="font-medium text-amber-900">Website</p>
                  <a href="https://buildwithyehhmii.vercel.app/" className="text-amber-700 hover:text-amber-900">
                    buildwithyehhmii.vercel.app
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-medium text-amber-900 mb-6">Send a Message</h3>
              <div className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400">
                    <option>Select Service</option>
                    <option>Wedding Invitation</option>
                    <option>Event Invitation</option>
                    <option>Corporate Event</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <textarea 
                    placeholder="Tell us about your project..." 
                    rows={4}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert('Message sent! We\'ll get back to you soon.')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💌</span>
                <span className="text-xl font-serif font-medium">DigitalInvites</span>
              </div>
              <p className="text-amber-200 leading-relaxed">
                Creating beautiful digital invitations that make your special occasions memorable. 
                Professional service, elegant designs, and seamless user experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Services</h4>
              <ul className="space-y-2 text-amber-200">
                <li>Wedding Invitations</li>
                <li>Event Invitations</li>
                <li>RSVP Management</li>
                <li>Custom Designs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-amber-200">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
            <p>&copy; 2024 Digivite. All rights reserved. Made with ❤️ for your special moments.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}