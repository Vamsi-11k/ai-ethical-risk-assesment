import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
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
  const [view, setView] = useState("landing");
  const [riskTheme, setRiskTheme] = useState("safe");

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [scanUrl, setScanUrl] = useState("");
  const [scanTimestamp, setScanTimestamp] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-risk-theme", riskTheme);
  }, [riskTheme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

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

  const pageTransition = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
  };

  if (view === "login" || view === "signup") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key={view} {...pageTransition}>
          {view === "login" ? (
            <Login
              onGoHome={() => setView("landing")}
              onGoToSignup={() => setView("signup")}
              onLoginSuccess={handleLoginSuccess}
              initialEmail={signupEmail}
            />
          ) : (
            <Signup
              onGoHome={() => setView("landing")}
              onGoToLogin={() => setView("login")}
              onSignupSuccess={handleSignupSuccess}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full bg-white text-neutral-950 bg-arch-grid"
      data-risk-theme={riskTheme}
    >
      <Scene />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          currentView={view}
          riskTheme={riskTheme}
          onNavigate={(newView) => setView(newView)}
          onLoginClick={() => setView("login")}
          onSignupClick={() => setView("signup")}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={view} {...pageTransition}>
              {view === "landing" && (
                <LandingPage
                  onLaunchApp={() => setView("app")}
                  onQuickScan={(url) => handleScan(url)}
                />
              )}

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

              {view === "features" && (
                <FeaturesPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}

              {view === "workflow" && (
                <WorkflowPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}

              {view === "why-us" && (
                <WhyUsPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}

              {view === "categories" && (
                <CategoriesPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}

              {view === "manifesto" && (
                <ManifestoPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}

              {view === "contact" && (
                <ContactPage
                  onLaunchApp={() => setView("app")}
                  onGoHome={() => setView("landing")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
