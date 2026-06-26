import React, { useEffect, useRef, useState } from "react";
import { home, scheduleData } from "@/constants";
import graduationBg from "@/assets/graduation_bg.png";
import posterImage from "@/assets/banner.jpeg";
import { Element, Link } from "react-scroll";
import {Link as RouterLink} from "react-router-dom"
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import { Clock, Facebook, Instagram, Linkedin, MapPin, Twitter, Users, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
const MainPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${home.event}  |  ${home.eventYear}`;
  }, []);

  return (
    <div className="w-full ">
      <Element name="home">
        <section
          id="section_1"
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

          <img
            src={graduationBg}
            alt="Graduation Ceremony"
            className="absolute w-full h-full object-cover"
          />

          <div className="container mx-auto px-4 z-20 text-center text-white">
            <p className="text-lg mb-2 font-light">{home.collegeName}</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-pulse">
              {home.event} {home.eventYear}
            </h1>

            <div className="flex justify-center space-x-4 mb-12">
              <RouterLink
                to="/register"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 cursor-pointer text-center flex items-center justify-center"
              >
                Generate Pass
              </RouterLink>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex items-center">
                <Clock className="mr-2 text-yellow-400" />
                <p>
                  {home.eventDate}
                  <sup>{home.suffix}</sup>, {home.eventMonth} {home.eventYear}
                </p>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-red-400" />
                <p>{home.eventAddress}</p>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <span>Follow Us :</span>
              <a
                href="https://www.facebook.com/pbrvitsofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://x.com/pbrvitsofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/pbrvits-official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/pbrvits_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors duration-300"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </section>
      </Element>

      {/* schedule section */}
      <Element name="schedule" className="pt-3">
        <section
          id="schedule"
          className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Schedule & Details
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Graduation day schedule by branch
              </p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-indigo-700 text-white">
                      <th className="py-5 px-6 font-semibold uppercase tracking-wider text-sm">Branch</th>
                      <th className="py-5 px-6 font-semibold uppercase tracking-wider text-sm">Graduation Date</th>
                      <th className="py-5 px-6 font-semibold uppercase tracking-wider text-sm">Reporting Time</th>
                      <th className="py-5 px-6 font-semibold uppercase tracking-wider text-sm">Venue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scheduleData.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-indigo-50/30 transition-colors duration-150 group"
                      >
                        <td className="py-4 px-6 font-bold text-gray-900 group-hover:text-primary transition-colors text-base">{item.branch}</td>
                        <td className="py-4 px-6 text-gray-600 font-medium text-base">{item.date}</td>
                        <td className="py-4 px-6 text-gray-500 text-sm">{item.reportingTime}</td>
                        <td className="py-4 px-6 text-gray-500 text-sm">{item.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </Element>
    </div>
  );
};

export default MainPage;
