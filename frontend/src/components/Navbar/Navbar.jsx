import { useState, useEffect, useRef } from "react";
import BrandLogo from "../BrandLogo";
import {
  FaShieldAlt,
  FaBolt,
  FaHome,
  FaLayerGroup,
  FaProjectDiagram,
  FaAward,
  FaBalanceScale,
  FaBookOpen,
  FaEnvelope,
  FaSignOutAlt,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

const PLATFORM_ITEMS = [
  {
    id: "features",
    label: "Features",
    desc: "Six core ethical and security checks",
    icon: <FaLayerGroup className="text-xs" />,
  },
  {
    id: "workflow",
    label: "How It Works",
    desc: "Animated 6-stage audit walkthrough",
    icon: <FaProjectDiagram className="text-xs" />,
  },
  {
    id: "categories",
    label: "Taxonomy",
    desc: "Five weighted risk scoring domains",
    icon: <FaBalanceScale className="text-xs" />,
  },
];

const ABOUT_ITEMS = [
  {
    id: "why-us",
    label: "Why Us",
    desc: "Explainable benchmarks & zero retention",
    icon: <FaAward className="text-xs" />,
  },
  {
    id: "manifesto",
    label: "Manifesto",
    desc: "Our AI safety and ethics pledge",
    icon: <FaBookOpen className="text-xs" />,
  },
];

const ALL_MOBILE_TABS = [
  { id: "landing", label: "Overview", icon: <FaShieldAlt className="text-xs" /> },
  ...PLATFORM_ITEMS,
  ...ABOUT_ITEMS,
  { id: "contact", label: "Contact", icon: <FaEnvelope className="text-xs" /> },
];

function Navbar({
  currentView = "landing",
  onNavigate,
  onLoginClick,
  onSignupClick,
  user,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const isPlatformActive = PLATFORM_ITEMS.some((item) => item.id === currentView);
  const isAboutActive = ABOUT_ITEMS.some((item) => item.id === currentView);

  const handleSelect = (id) => {
    onNavigate(id);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-xl transition-colors duration-300"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleSelect("landing")}
          className="group flex shrink-0 items-center gap-3 text-left transition-opacity duration-200 hover:opacity-85"
        >
          <div className="transition-transform duration-300 group-hover:scale-105">
            <BrandLogo size="md" />
          </div>
          <div className="leading-none">
            <span className="block whitespace-nowrap text-base font-bold tracking-tight text-neutral-950">
              EthicalAI
            </span>
            <span className="mt-0.5 block bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text font-mono text-[10px] font-bold uppercase tracking-widest text-transparent">
              Risk Intelligence
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary">
          <button
            type="button"
            onClick={() => handleSelect("landing")}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              currentView === "landing"
                ? "bg-black text-white"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            Overview
          </button>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("platform")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() => setOpenMenu((m) => (m === "platform" ? null : "platform"))}
              aria-expanded={openMenu === "platform"}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                isPlatformActive
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              <span>Platform</span>
              <FaChevronDown
                className={`text-[10px] transition-transform duration-200 ${
                  openMenu === "platform" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "platform" && (
              <div className="absolute left-0 top-full w-72 pt-2 animate-fade-up">
                <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.16)]">
                  {PLATFORM_ITEMS.map((item) => {
                    const active = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all duration-150 ${
                          active
                            ? "bg-black text-white"
                            : "text-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            active
                              ? "bg-neutral-800 text-white"
                              : "border border-neutral-200 bg-neutral-50 text-neutral-900"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div
                            className={`mt-0.5 text-xs ${
                              active ? "text-neutral-200" : "text-neutral-700"
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("about")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button
              type="button"
              onClick={() => setOpenMenu((m) => (m === "about" ? null : "about"))}
              aria-expanded={openMenu === "about"}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                isAboutActive
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              <span>Company</span>
              <FaChevronDown
                className={`text-[10px] transition-transform duration-200 ${
                  openMenu === "about" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "about" && (
              <div className="absolute left-0 top-full w-72 pt-2 animate-fade-up">
                <div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.16)]">
                  {ABOUT_ITEMS.map((item) => {
                    const active = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all duration-150 ${
                          active
                            ? "bg-black text-white"
                            : "text-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            active
                              ? "bg-neutral-800 text-white"
                              : "border border-neutral-200 bg-neutral-50 text-neutral-900"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div>
                          <div className="text-sm font-semibold">{item.label}</div>
                          <div
                            className={`mt-0.5 text-xs ${
                              active ? "text-neutral-200" : "text-neutral-700"
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSelect("contact")}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
              currentView === "contact"
                ? "bg-black text-white"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
            }`}
          >
            Contact
          </button>
        </nav>

        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          {currentView !== "app" ? (
            <button
              type="button"
              onClick={() => handleSelect("app")}
              className="btn-black group whitespace-nowrap rounded-xl px-4 py-2 text-sm"
            >
              <FaBolt className="text-xs text-neutral-300 transition-transform duration-300 group-hover:scale-110" />
              <span>Audit Studio</span>
              <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSelect("landing")}
              className="btn-outline-mono whitespace-nowrap rounded-xl px-4 py-2 text-sm"
            >
              <FaHome className="text-xs" />
              <span>Overview</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-800">
                <span className="h-2 w-2 rounded-full bg-black" />
                <span className="max-w-[110px] truncate">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-all duration-200 hover:border-black hover:bg-black hover:text-white"
              >
                <FaSignOutAlt className="text-xs" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLoginClick}
                className="btn-outline-mono whitespace-nowrap rounded-xl px-4 py-2 text-sm"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={onSignupClick}
                className="btn-black whitespace-nowrap rounded-xl px-4 py-2 text-sm"
              >
                Get Access
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-900 transition-all duration-200 hover:bg-black hover:text-white lg:hidden"
        >
          {mobileOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-6 pt-4 shadow-xl lg:hidden animate-fade-up">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelect("landing")}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                currentView !== "app"
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-neutral-50 text-neutral-700"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handleSelect("app")}
              className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                currentView === "app"
                  ? "bg-black text-white"
                  : "border border-neutral-200 bg-neutral-50 text-neutral-700"
              }`}
            >
              Audit Studio
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {ALL_MOBILE_TABS.map((tab) => {
              const active = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelect(tab.id)}
                  className={`flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-black text-white"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-black"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileOpen(false);
                }}
                className="btn-black min-h-[44px] w-full rounded-xl text-sm"
              >
                <FaSignOutAlt />
                <span>Sign Out ({user.name})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoginClick();
                    setMobileOpen(false);
                  }}
                  className="btn-outline-mono min-h-[44px] rounded-xl text-sm"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignupClick();
                    setMobileOpen(false);
                  }}
                  className="btn-black min-h-[44px] rounded-xl text-sm"
                >
                  Get Access
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
