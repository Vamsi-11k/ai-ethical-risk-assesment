import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Stats from "./components/Stats/Stats";
import Features from "./components/Features/Features";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import RiskCategories from "./components/RiskCategories/RiskCategories";
import Dashboard from "./components/Dashboard/Dashboard";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import { useState } from "react";

function App() {
  // "home" | "login" | "signup"
  const [view, setView] = useState("home");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setView("home");
  };

  if (view === "login") {
    return (
      <Login
        onGoHome={() => setView("home")}
        onGoToSignup={() => setView("signup")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (view === "signup") {
    return (
      <Signup
        onGoHome={() => setView("home")}
        onGoToLogin={() => setView("login")}
        onSignupSuccess={() => setView("login")}
      />
    );
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setView("login")}
        onSignupClick={() => setView("signup")}
        user={user}
        onLogout={handleLogout}
      />

      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <RiskCategories />
      <Dashboard user={user} />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
