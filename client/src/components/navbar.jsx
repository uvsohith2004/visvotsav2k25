import React, { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navbar } from "@/constants/navbarData";
// import Marquee from "./marquee";
import { useAnimation, motion } from "framer-motion";
const Navbar = () => {
  const [isTransparent, setIsTransparent] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newIsTransparent = scrollPosition < 50;
      setIsTransparent(newIsTransparent);

      controls.start({
        backgroundColor: newIsTransparent
          ? "rgba(0, 0, 0, 0)"
          : "rgba(0, 0, 0, 0.9)",
        backdropFilter: newIsTransparent ? "blur(0px)" : "blur(10px)",
        transition: { duration: 0.1, ease: "easeInOut" },
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  const handleSheetOpen = () => setIsSheetOpen(true);
  const handleSheetClose = () => setIsSheetOpen(false);

  const handleNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      // If not on home page, navigate to home first, then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    handleSheetClose();
  };

  return (
    <motion.nav
      className="w-full h-16 text-white flex justify-between items-center px-4 py-4 fixed z-50 transition-all duration-300"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={controls}
    >
      <div className="flex items-center">
      </div>

      <div className="flex items-center gap-3">
        {/* Home Button (only if not on home page) */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
            )}
          >
            Home
          </Link>
        )}

        {/* Mobile Menu */}
        <Sheet
          open={isSheetOpen}
          onOpenChange={(open) => {
            if (open) {
              handleSheetOpen();
            } else {
              handleSheetClose();
            }
          }}
        >
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 transition-colors duration-300",
                location.pathname === "/"
                  ? isTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-white hover:bg-white/10"
                  : "text-black hover:bg-black/10",
                !isTransparent && "text-white"
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-80 sm:w-96">
            <SheetHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-primary text-xl font-bold">
                  Navigation Menu
                </SheetTitle>
           
              </div>
            </SheetHeader>

            <div className="flex flex-col space-y-4 mt-6">
              {/* Navigation Links */}
              <div className="space-y-2">
                {navbar.links.map((link, index) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.path)}
                    className="w-full text-left px-4 py-3 rounded-lg text-primary hover:bg-primary/10 transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Home Button (only if not on home page) */}
              {location.pathname !== "/" && (
                <SheetClose asChild>
                  <Link
                    to="/"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full py-3 rounded-lg font-medium"
                    )}
                  >
                    Back to Home
                  </Link>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
