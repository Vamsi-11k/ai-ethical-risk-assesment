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

  const [scanUrl, setScanUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (url) => {
    setScanUrl(url);
    setIsScanning(true);
    setTimeout(() => {
      const resultsEl = document.getElementById("results");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setScanUrl("");
  };

  const [signupEmail, setSignupEmail] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setView("home");
  };

  const handleSignupSuccess = (newUser) => {
    if (newUser?.email) {
      setSignupEmail(newUser.email);
    }
    setView("login");
  };

  if (view === "login") {
    return (
      <Login
        onGoHome={() => setView("home")}
        onGoToSignup={() => setView("signup")}
        onLoginSuccess={handleLoginSuccess}
        initialEmail={signupEmail}
      />
    );
  }

  if (view === "signup") {
    return (
      <Signup
        onGoHome={() => setView("home")}
        onGoToLogin={() => setView("login")}
        onSignupSuccess={handleSignupSuccess}
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

      <Hero onScan={handleScan} isScanning={isScanning} />
      <Stats />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <RiskCategories />
      <Dashboard
        user={user}
        scanUrl={scanUrl}
        isScanning={isScanning}
        onScanComplete={handleScanComplete}
      />
      <About />
      <Contact />
      <Footer />
    </>
  );
}

export default App;
