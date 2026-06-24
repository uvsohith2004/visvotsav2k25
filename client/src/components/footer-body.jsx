import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Users,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  footerData,
  studentCoordinators,
  staffCoordinators,
  patron,
  coPatrons,
  convenor,
  coConveners,
} from "../constants/footerData";
import { ScrollArea } from "./ui/scroll-area";

const FooterBody = () => {
  return (
    <footer className="bg-black text-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-500 mb-3">
            {footerData.firstTitle}
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            Celebrating Excellence in Education & Innovation
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Leadership & Coordination Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Leadership Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <FooterSection
                title={footerData.firstSubTitle}
                items={patron}
                isPrimary={true}
              />
              <FooterSection
                title={footerData.coPatronsSubTitle}
                items={coPatrons}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <FooterSection
                title={footerData.secondSubTitle}
                items={convenor}
              />
              <FooterSection
                title={footerData.thirdSubTitle}
                items={coConveners}
              />
            </div>

            {/* Coordinators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <ExpandableSection
                title={footerData.fourthSubTitle}
                items={studentCoordinators}
                showContact
                icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <ExpandableSection
                title={footerData.fifthSubTitle}
                items={staffCoordinators}
                showContact
                icon={<User className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-5 xl:col-span-1 ">
            <div className="bg-neutral-900 h-full rounded-xl p-4 sm:p-6  shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                {footerData.secondTitle}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <ContactInfo
                  icon={
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  }
                  info={footerData.secondTitleMobileNumber}
                  href={`tel:${footerData.secondTitleMobileNumber}`}
                  label="Call Us"
                />
                <ContactInfo
                  icon={
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  }
                  info={footerData.secondTitleEmail}
                  href={`mailto:${footerData.secondTitleEmail}`}
                  label="Email Us"
                />
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow h-full">
              <h3 className="text-lg sm:text-xl  font-semibold  mb-3 sm:mb-4 flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                {footerData.thirdTitle}
              </h3>
              <p className="text-white leading-relaxed text-sm sm:text-base mb-4">
                {footerData.ThirdTitleAddress}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  footerData.ThirdTitleAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-500 hover:text-yellow-500/80 transition-colors font-medium text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View on Maps
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 flex-wrap">
                Built With
                <span className="text-red-500 text-base animate-pulse">❤️</span>
                By
                <span className="text-yellow-500 font-medium">
                  UV.Sohith & T.Lohith
                </span>
                <span className="text-muted-foreground/80">
                  , IV ECE, Tesla
                </span>
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm">
                © 2025 PBR VITS. All rights reserved. | Designed for Graduation Day
                2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, items, isPrimary = false }) => {
  return (
    <div
      className={`bg-neutral-900 rounded-xl  p-3 sm:p-4 hover:shadow-md transition-all h-full`}
    >
      <h4 className="text-base sm:text-2xl font-semibold text-yellow-500 mb-2 sm:mb-3 pb-2 ">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="text-muted-foreground text-xs sm:text-sm leading-relaxed"
          >
            <div className="font-medium text-white">{item.name}</div>
            <div className="text-yellow-500 text-xs">
              {item.designation}, {item.college || item.department}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ExpandableSection = ({ title, items, showContact, icon }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const displayItems = isExpanded ? items : items.slice(0, 2);

  return (
    <div className="bg-neutral-900 rounded-xl p-3 sm:p-4 r hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h4 className="text-base sm:text-xl font-semibold text-white flex items-center">
          <span className="text-yellow-500 mr-2">{icon}</span>
          {title}
        </h4>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto">
        <ScrollArea className="h-48 max-h-80 px-5 flex gap-3 flex-col">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-800  rounded-lg p-2 sm:p-3 hover:border-primary/30 transition-colors my-2"
            >
              {showContact ? (
                <ContactItem item={item} />
              ) : (
                <div>
                  <div className="font-medium text-white text-sm">
                    {item.name}
                  </div>
                  <div className="text-yellow-500 text-xs">
                    {item.designation}, {item.college || item.department}
                  </div>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

const ContactItem = ({ item }) => (
  <div className="space-y-1">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
      <span className="font-medium text-white text-xs sm:text-sm">
        {item.name}
      </span>
      <a
        href={`tel:${item.mobile}`}
        className="text-green-400 hover:text-green-500 text-xs font-medium transition-colors flex items-center w-fit"
      >
        <Phone className="w-3 h-3 mr-1 text-green-400" />
        <span className="text-white">{item.mobile}</span>
      </a>
    </div>
    <div className="text-yellow-500 text-xs">{item.department}</div>
  </div>
);

const ContactInfo = ({ icon, info, href, label }) => (
  <a
    href={href}
    className="flex items-center space-x-3 p-3 bg-neutral-800 rounded-lg  hover:border-primary/30  transition-all group"
  >
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </div>
      <div className="text-xs sm:text-sm text-white group-hover:text-yellow-500 truncate">
        {info}
      </div>
    </div>
    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-yellow-500 flex-shrink-0" />
  </a>
);

export default FooterBody;
