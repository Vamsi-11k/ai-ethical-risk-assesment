import { useState, useEffect } from "react";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";
import MainApp from "./pages/MainApp";
import FeaturesPage from "./pages/FeaturesPage";
import WorkflowPage from "./pages/WorkflowPage";
import WhyUsPage from "./pages/WhyUsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ManifestoPage from "./pages/ManifestoPage";
import ContactPage from "./pages/ContactPage";

import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Scene from "./components/Hero/Scene";

function App() {
  // Navigation views: "landing" | "app" | "features" | "workflow" | "why-us" | "categories" | "manifesto" | "contact" | "login" | "signup"
  const [view, setView] = useState("landing");

  // Dynamic Risk Reactive Theme: "safe" (Green) | "moderate" (Yellow) | "risky" (Red)
  const [riskTheme, setRiskTheme] = useState("safe");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [scanUrl, setScanUrl] = useState("");
  const [scanTimestamp, setScanTimestamp] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  // Update root html attribute for dynamic CSS risk variables
  useEffect(() => {
    document.documentElement.setAttribute("data-risk-theme", riskTheme);
  }, [riskTheme]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Listen for launch app message events from Sylva iframe
  useEffect(() => {
    const handleMsg = (event) => {
      if (event.data?.type === "LAUNCH_APP") {
        setView("app");
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);

  const handleScan = (url) => {
    setScanUrl(url);
    setScanTimestamp(Date.now());
    setIsScanning(true);
    setView("app");

    // Smooth scroll down to results after dashboard loads
    setTimeout(() => {
      const resultsEl = document.getElementById("results");
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleScanComplete = () => {
    setIsScanning(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setView("app");
  };

  const handleSignupSuccess = (newUser) => {
    if (newUser?.email) {
      setSignupEmail(newUser.email);
    }
    setView("login");
  };

  // Login view
  if (view === "login") {
    return (
      <Login
        onGoHome={() => setView("landing")}
        onGoToSignup={() => setView("signup")}
        onLoginSuccess={handleLoginSuccess}
        initialEmail={signupEmail}
      />
    );
  }

  // Signup view
  if (view === "signup") {
    return (
      <Signup
        onGoHome={() => setView("landing")}
        onGoToLogin={() => setView("login")}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  return (
    <div className="app-shell" data-risk-theme={riskTheme}>
      {/* ── Persistent Living Green 3D Background across every page ── */}
      <div className="persistent-living-green-bg" aria-hidden="true">
        <Scene background={true} />
      </div>

      {/* Universal Animated Navbar with Dynamic Risk Laser Sweeper & Icons */}
      <Navbar
        currentView={view}
        riskTheme={riskTheme}
        onNavigate={(newView) => setView(newView)}
        onLoginClick={() => setView("login")}
        onSignupClick={() => setView("signup")}
        user={user}
        onLogout={handleLogout}
      />

      {/* ── Separate Dedicated Pages ──────────────────────────────── */}

      {/* 1. Landing Hero Page (Centerpiece & Ethical AI Overview) */}
      {view === "landing" && (
        <LandingPage
          onLaunchApp={() => setView("app")}
          onQuickScan={(url) => handleScan(url)}
        />
      )}

      {/* 2. Audit Studio (Dedicated AI Ethical Risk Scanner & Results) */}
      {view === "app" && (
        <MainApp
          user={user}
          scanUrl={scanUrl}
          scanTimestamp={scanTimestamp}
          isScanning={isScanning}
          onScan={handleScan}
          onScanComplete={handleScanComplete}
          onGoHome={() => setView("landing")}
          riskTheme={riskTheme}
          onThemeChange={(newTheme) => setRiskTheme(newTheme)}
        />
      )}

      {/* 3. Features Page (06 Core Detection Pillars) */}
      {view === "features" && (
        <FeaturesPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}

      {/* 4. Workflow Page (Autonomous Pipeline Stages) */}
      {view === "workflow" && (
        <WorkflowPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}

      {/* 5. Why Us Page (Governance & Trust Benchmarks) */}
      {view === "why-us" && (
        <WhyUsPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}

      {/* 6. Categories / Taxonomy Page (Scoring Thresholds) */}
      {view === "categories" && (
        <CategoriesPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}

      {/* 7. Manifesto / About Page (Ethics Pledge) */}
      {view === "manifesto" && (
        <ManifestoPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}

      {/* 8. Contact Page (Safety Team & Enterprise Inquiries) */}
      {view === "contact" && (
        <ContactPage
          onLaunchApp={() => setView("app")}
          onGoHome={() => setView("landing")}
        />
      )}
    </div>
  );
}

export default App;
