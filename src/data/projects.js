import cartifyImg from "../assets/cartifyimg.png";
import Hirehubimg from "../assets/Hirehubimg.png";
import ChatApp from "../assets/Chatapp.png";
const projects = [
  {
    id: 1,
    title: "Cartify — E-Commerce Platform",
    description:
      "A Front-End e-commerce web app with product listing, cart management, user authentication, and order tracking. Built with the complete Frontend stack.",
    techStack: ["JavaScript", "React.js", "Tailwind CSS", "Clerk"],
    githubLink: "https://github.com/CodeWithNouman99/Cartify-React_Project",
    liveLink: "https://cartify-react-project.vercel.app/",
    image: cartifyImg,
    color: "from-emerald-500/10 to-teal-500/10",
    accent: "#6EE7B7",
    emoji: "🛒",
  },
  {
    id: 2,
    title: "HireHub — Job Portal",
    description:
      "A job portal where companies can post jobs and candidates can apply. Includes role-based authentication (recruiter/applicant), dashboards, and job filtering.",
    techStack: ["JavaScript", "React.js", "Tailwind CSS", "Clerk"],
    githubLink: "https://github.com/noumandev/hirehub",
    liveLink: "https://hire-hub-frontend-seven.vercel.app/",
    image: Hirehubimg,
    color: "from-blue-500/10 to-indigo-500/10",
    accent: "#60A5FA",
    emoji: "💼",
  },
  {
    id: 3,
    title: "Ai Chat App",
    description:
      "AI-powered chat application with secure authentication and real-time responses using the Gemini API.",
    techStack: ["React.js", "JavaScript", "Tailwind CSS", "Gemini API"],
    githubLink: "https://github.com/CodeWithNouman99/Echo-chat-app",
    liveLink: "https://echo-chat-app-gilt.vercel.app/",
    image: ChatApp,
    color: "from-yellow-500/10 to-orange-500/10",
    accent: "#FCD34D",
    emoji: "🎓",
  },
  // {
  //   id: 4,
  //   title: "Fake Image Detection",
  //   description:
  //     "A machine learning-assisted web app that analyzes uploaded images to detect whether they are AI-generated or real. Integrated a Python model with a React frontend.",
  //   techStack: ["React.js", "Python", "Flask", "TensorFlow", "Node.js"],
  //   githubLink: "https://github.com/noumandev/fake-image-detection",
  //   liveLink: "https://fake-detect-demo.vercel.app",
  //   image: null,
  //   color: "from-pink-500/10 to-rose-500/10",
  //   accent: "#F472B6",
  //   emoji: "🔍",
  // },
];

export default projects;
