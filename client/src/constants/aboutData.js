import collegeImage from "../assets/clg.webp";
import chairman from "../assets/chairman.jpg";
import principal from "../assets/principal.jpg";
import aed from "../assets/aed.png";
import vicePrincipal1 from "../assets/vice-principal-1.jpeg";
import vicePrincipal2 from "../assets/vice-principal-2.jpeg";
import ad from "../assets/ad.jpeg";

const aboutData = {
  title: "About Graduation Day",
  programs:"10+ Programs",
  students:"10,000+ Students",
  description:
    "Graduation Day is a National Level Technical symposium conducted by the PBR Visvodaya Institute of Technology and Science (Autonomous). In this event we conduct some Technical events for the students and finalize the winners. The winners will receive the respected cash prize, a certificate of excellence along with a momento In this Graduation Day everyone can participate without the branch differentiation",
  collegeName: "PBRVITS Autonomous",
  imageTitle: "Campus Excellence",
  imageSubtitle: "Where innovation meets tradition",
  CollegeDescription:
    "PBR Visvodaya Institute of Technology & Science is awarded permanent affiliation by JNTUA, Anantapuramu. It had been accredited by NAAC with an A grade in 2015 for 5 years. The departments of ECE, CSE, EEE and ME had been accredited by NBA at the UG level for three years in 2010. The institution has been given 2(f) and 12(B) by the UGC in the year 2013. Recognizing the potential of the institution, the software giant TCS has accredited it in 2010 and KPIT Cummins, Pune has given its accreditation in 2013.",
    image: collegeImage,
    collegeOfficials:  [
      {
        id: "1",
        image: chairman,
        name: "Sri D.Vidyadhara Kumar Reddy",
        designation: "Chairman"
      },
      {
        id: "2", 
        image: aed,
        name: "Dr.D.Likhith Reddy",
        designation: "Academic Executive Director"
      },
      {
        id: "3",
        image: ad, 
        name: "Dr.D.Prathyusha Reddi",
        designation: "Academic Director"
      },
      {
        id: "4",
        image: principal,
        name: "Dr.v.Anil Kumar",
        designation: "Principal"
      },
      {
        id: "5",
        image: vicePrincipal2,
        name: "Dr.V.V.Sunil Kumar",
        designation: "Vice Principal"
      },
      {
        id: "6",
        image: vicePrincipal1,
        name: "Dr. Dr.N.Srinadh Reddy",
        designation: "Vice Principal"
      }
    ]

  };
export default aboutData;
