FEATURE_EXPLANATIONS = {
    "having_IP_Address": {
        "title": "IP Address Usage",
        "passed": {
            "reason": "URL uses a standard domain name instead of a raw IP address.",
            "suggestion": "Maintain domain-based routing."
        },
        "failed": {
            "reason": "URL uses a raw IP address (e.g. 192.168.1.1) instead of a domain name.",
            "suggestion": "Configure a standard DNS domain name to build user trust."
        }
    },
    "URL_Length": {
        "title": "URL Length",
        "passed": {
            "reason": "URL length is within standard, safe limits (under 54 characters).",
            "suggestion": "No adjustments needed."
        },
        "failed": {
            "reason": "URL is excessively long, a technique often used to hide redirection parameters.",
            "suggestion": "Simplify your URL structures and paths."
        }
    },
    "Shortining_Service": {
        "title": "URL Shortener Detection",
        "passed": {
            "reason": "URL does not use a shortening service (e.g. bit.ly, tinyurl).",
            "suggestion": "Continue using direct, transparent links."
        },
        "failed": {
            "reason": "URL uses a shortening service, which conceals the destination domain.",
            "suggestion": "Expose full, unshortened URLs to users for transparency."
        }
    },
    "having_At_Symbol": {
        "title": "At-Symbol Check",
        "passed": {
            "reason": "URL does not contain an '@' symbol, avoiding credential-spoofing techniques.",
            "suggestion": "Keep URL query parameters clean."
        },
        "failed": {
            "reason": "URL contains an '@' symbol, which ignores preceding text and misleads users.",
            "suggestion": "Remove '@' symbols and credentials from public URLs."
        }
    },
    "double_slash_redirecting": {
        "title": "Double-Slash Redirect",
        "passed": {
            "reason": "URL double slashes ('//') are used only for the protocol header.",
            "suggestion": "No action needed."
        },
        "failed": {
            "reason": "URL contains '//' in the path, which forces redirection to external domains.",
            "suggestion": "Remove path-based double slashes from URLs."
        }
    },
    "Prefix_Suffix": {
        "title": "Domain Hyphen Check",
        "passed": {
            "reason": "Domain name does not contain hyphens, a style rarely seen in phishing.",
            "suggestion": "Use unified domain names."
        },
        "failed": {
            "reason": "Domain name uses a hyphen (prefix/suffix), commonly used to mimic brand names.",
            "suggestion": "Avoid hyphens in domains to reduce typosquatting resemblance."
        }
    },
    "having_Sub_Domain": {
        "title": "Subdomain Count",
        "passed": {
            "reason": "Domain has a safe number of subdomains (under 3 levels).",
            "suggestion": "Continue using simplified subdomain configurations."
        },
        "failed": {
            "reason": "Domain uses multiple subdomain levels, which can hide the real host name.",
            "suggestion": "Reduce the number of subdomain levels (e.g. combine records)."
        }
    },
    "SSLfinal_State": {
        "title": "SSL/TLS Security",
        "passed": {
            "reason": "Website enforces a valid, trusted SSL/TLS certificate over HTTPS.",
            "suggestion": "Ensure certificate automatic renewal is active."
        },
        "failed": {
            "reason": "Website lacks a valid SSL/TLS certificate or uses insecure HTTP.",
            "suggestion": "Install a valid SSL certificate from a trusted Certificate Authority (CA)."
        }
    },
    "Domain_registeration_length": {
        "title": "Domain Registration Length",
        "passed": {
            "reason": "Domain is registered for more than one year into the future.",
            "suggestion": "Renew domain registration regularly."
        },
        "failed": {
            "reason": "Domain registration expires in less than a year, common for short-term phishing sites.",
            "suggestion": "Extend the domain registration period beyond 1 year."
        }
    },
    "Favicon": {
        "title": "Favicon Integrity",
        "passed": {
            "reason": "Favicon is loaded locally or from a verified primary domain.",
            "suggestion": "No action needed."
        },
        "failed": {
            "reason": "Favicon is loaded from an external domain, indicating resource harvesting.",
            "suggestion": "Host the site favicon on your local server."
        }
    },
    "port": {
        "title": "Port Integrity",
        "passed": {
            "reason": "Website runs on standard web ports (80 or 443).",
            "suggestion": "Block unused ports at the firewall."
        },
        "failed": {
            "reason": "Website uses a non-standard port, exposing services to port-based security risks.",
            "suggestion": "Restrict public traffic to standard HTTP/HTTPS ports (80/443)."
        }
    },
    "HTTPS_token": {
        "title": "HTTPS Token Spoofing",
        "passed": {
            "reason": "Domain name does not contain the word 'https' misleadingly.",
            "suggestion": "No action needed."
        },
        "failed": {
            "reason": "Domain name misleadingly contains 'https' or 'http' in the label name.",
            "suggestion": "Select a domain name that doesn't contain protocol terms in its labels."
        }
    },
    "Request_URL": {
        "title": "External Media Requests",
        "passed": {
            "reason": "Most site media resources (images, audio) are hosted locally.",
            "suggestion": "Keep resources local for faster load and better safety."
        },
        "failed": {
            "reason": "Many media resources are requested from external, third-party domains.",
            "suggestion": "Host media assets locally on your server to avoid external dependencies."
        }
    },
    "URL_of_Anchor": {
        "title": "Anchor Link Validity",
        "passed": {
            "reason": "Anchor links lead to valid internal pages or verified external domains.",
            "suggestion": "Perform regular link audits."
        },
        "failed": {
            "reason": "High percentage of anchor links lead to external domains or empty anchors ('#').",
            "suggestion": "Remove dead anchors ('#') and link only to verified active pages."
        }
    },
    "Links_in_tags": {
        "title": "Metadata Link Integrity",
        "passed": {
            "reason": "Header scripts, meta tags, and style sheets are mostly hosted locally.",
            "suggestion": "Maintain script source control."
        },
        "failed": {
            "reason": "High percentage of header scripts and stylesheets are sourced from external domains.",
            "suggestion": "Audit external script sources and host core stylesheets locally."
        }
    },
    "SFH": {
        "title": "Server Form Handler",
        "passed": {
            "reason": "Forms submit data to active, local handlers or trusted third parties.",
            "suggestion": "Ensure form actions use secure HTTPS pathways."
        },
        "failed": {
            "reason": "Form action is blank, 'about:blank', or points to an external, unverified handler.",
            "suggestion": "Define specific, secure relative paths for form action URLs."
        }
    },
    "Submitting_to_email": {
        "title": "Email Submission Form",
        "passed": {
            "reason": "Forms submit data to database endpoints instead of direct email links.",
            "suggestion": "No changes needed."
        },
        "failed": {
            "reason": "Form submits sensitive data directly via 'mailto:' links or email functions.",
            "suggestion": "Use server-side secure handlers and APIs to process form responses."
        }
    },
    "Abnormal_URL": {
        "title": "Abnormal URL Structure",
        "passed": {
            "reason": "URL matches WHOIS host registration details.",
            "suggestion": "Keep WHOIS domain contact information updated."
        },
        "failed": {
            "reason": "Host name does not match WHOIS database records, suggesting spoofing.",
            "suggestion": "Ensure the hostname resolves to the correct registered domain details."
        }
    },
    "Redirect": {
        "title": "URL Redirection Count",
        "passed": {
            "reason": "URL has minimal or no redirect hops.",
            "suggestion": "Keep routing paths direct."
        },
        "failed": {
            "reason": "URL performs multiple redirect hops, which can conceal a malicious endpoint.",
            "suggestion": "Minimize redirects to maintain transparency."
        }
    },
    "on_mouseover": {
        "title": "Mouse-over Status Modification",
        "passed": {
            "reason": "Website does not hijack the browser status bar on hover events.",
            "suggestion": "Allow default browser link display."
        },
        "failed": {
            "reason": "JavaScript is used to change the browser status bar display on mouse-over.",
            "suggestion": "Remove status-hijacking scripts to maintain transparent link destinations."
        }
    },
    "RightClick": {
        "title": "Right-click Restrictions",
        "passed": {
            "reason": "Website does not restrict standard browser right-click events.",
            "suggestion": "Maintain browser default behaviors."
        },
        "failed": {
            "reason": "Website disables right-clicking, which prevents users from inspecting source files.",
            "suggestion": "Remove right-click restriction scripts."
        }
    },
    "popUpWidnow": {
        "title": "Input Pop-up Alerts",
        "passed": {
            "reason": "Website does not prompt for user input inside dialog popups.",
            "suggestion": "Keep inputs on standard page forms."
        },
        "failed": {
            "reason": "Website uses alert prompts or popups to collect credentials or inputs.",
            "suggestion": "Use in-page form inputs instead of modal prompts."
        }
    },
    "Iframe": {
        "title": "Iframe Check",
        "passed": {
            "reason": "Website does not load content inside hidden HTML iFrames.",
            "suggestion": "No action needed."
        },
        "failed": {
            "reason": "Website uses iFrames, which can load external malicious code invisibly.",
            "suggestion": "Limit the use of iFrames, especially from untrusted external sources."
        }
    },
    "age_of_domain": {
        "title": "Domain Age",
        "passed": {
            "reason": "Domain has been registered for more than 6 months.",
            "suggestion": "Continue building domain reputation."
        },
        "failed": {
            "reason": "Domain is brand new (less than 6 months old), a hallmark of temporary phishing campaigns.",
            "suggestion": "Build reputation as the domain ages."
        }
    },
    "DNSRecord": {
        "title": "DNS Record Status",
        "passed": {
            "reason": "Domain has a valid, active DNS record resolution.",
            "suggestion": "Verify DNS records periodically."
        },
        "failed": {
            "reason": "Domain fails to resolve via DNS lookup.",
            "suggestion": "Check your DNS zone files and resolve connection issues."
        }
    },
    "web_traffic": {
        "title": "Web Popularity Index",
        "passed": {
            "reason": "Domain has high traffic records, indicating an established presence.",
            "suggestion": "Continue monitoring traffic statistics."
        },
        "failed": {
            "reason": "Domain has little to no traffic, typical of new or malicious domains.",
            "suggestion": "Focus on search engine optimization and traffic growth."
        }
    },
    "Page_Rank": {
        "title": "Page Authority Index",
        "passed": {
            "reason": "Domain holds a high page authority rank.",
            "suggestion": "Maintain content quality to build authority."
        },
        "failed": {
            "reason": "Domain has low page authority rank, commonly seen in low-quality sites.",
            "suggestion": "Build backlinks from high-authority, reputable sources."
        }
    },
    "Google_Index": {
        "title": "Google Search Index",
        "passed": {
            "reason": "Website is indexed by Google Search indexers.",
            "suggestion": "Submit sitemaps regularly."
        },
        "failed": {
            "reason": "Website is not indexed by Google, indicating a blocked or hidden status.",
            "suggestion": "Request Google Search indexing through Google Search Console."
        }
    },
    "Links_pointing_to_page": {
        "title": "Backlink Count",
        "passed": {
            "reason": "Website has active backlinks pointing to it.",
            "suggestion": "Partner with reputable sites to build links."
        },
        "failed": {
            "reason": "Website has no reputable incoming links pointing to it.",
            "suggestion": "Promote domain visibility to accrue backlinks."
        }
    },
    "Statistical_report": {
        "title": "Threat Database Registry",
        "passed": {
            "reason": "Domain is clean and does not match threat intelligence databases.",
            "suggestion": "Perform periodic reputation sweeps."
        },
        "failed": {
            "reason": "Domain name contains terms matching active phishing/malware registries.",
            "suggestion": "Avoid suspicious keywords in your domains to avoid registry flags."
        }
    }
}
