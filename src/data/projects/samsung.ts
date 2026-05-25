import type { WorkExperience } from "./types";

export const samsung: WorkExperience = {
  id: "samsung",
  company: "Samsung SDS America",
  role: "UI Developer",
  years: "May 2022 – Present",
  tags: ["ReactJS", "jQuery", "Sass", "AEM", "JavaScript ES6+", "GTM / GA4", "JWT / OAuth 2.0"],
  features: [
    {
      id: "biz-account",
      label: "Business Account",
      description:
        "Built the Samsung Business Account registration flow for the B2B storefront — multi-step form validation, tax-exempt application with document upload, EIN tooltip guidance, and terms acknowledgement.",
      screenshots: [
        { src: "/samsung/BizAcntSign.png", alt: "Business account sign-up form", portrait: true },
        { src: "/samsung/MVBizAcntSignUp.png", alt: "Mobile sign-up with Tax ID tooltip", portrait: true },
        { src: "/samsung/AddedModsAcntSignUp.png", alt: "Tax-exempt application section", portrait: true },
        { src: "/samsung/FileUpload.png", alt: "Tax certificate file upload", portrait: true },
      ],
    },
    {
      id: "tier-pricing",
      label: "Tier Pricing",
      description:
        "Developed dynamic, modular B2B product page components surfacing bulk and volume pricing across PDPs, product cards, and the compare page. Enhanced user interaction tracking drove a 25% increase in user engagement and informed long-term content strategy.",
      screenshots: [
        { src: "/samsung/ProductCardTierPricing.png", alt: "Galaxy Z Fold5 bulk pricing PDP" },
        { src: "/samsung/BusinessSolutionCard.png", alt: "Product cards with Business Account unlock" },
        { src: "/samsung/MaskTierPricing.png", alt: "Galaxy Tab S6 Lite with tier pricing" },
        { src: "/samsung/Mask.png", alt: "Galaxy Tab S6 Lite mobile PDP", portrait: true },
        { src: "/samsung/ComparePageTier.png", alt: "Compare page with bulk pricing expanded" },
        { src: "/samsung/ADPSolutionCard.png", alt: "Compare page — ADP solution card" },
        { src: "/samsung/SolotionCard.png", alt: "Samsung Business Account solution card", portrait: true },
      ],
    },
    {
      id: "tv-displays",
      label: "TV & Displays",
      description:
        "Built product pages for Samsung's TV lineup — The Frame's series and size selectors across mobile and desktop, The Wall All-in-One PDP with special handling tooltip, and a desktop PDP with Chargeafter financing integration.",
      screenshots: [
        { src: "/samsung/TVFrameIcons.png", alt: "The Frame 55\" QLED PDP — feature icons", portrait: true },
        { src: "/samsung/TVFamilyOptions.png", alt: "The Frame size selector (mobile)", portrait: true },
        { src: "/samsung/FamilyOptions.png", alt: "The Frame Disney100 Edition (mobile)", portrait: true },
        { src: "/samsung/Chargeafter.png", alt: "The Frame QLED desktop PDP" },
        { src: "/samsung/SpecialHandlingToolTip.png", alt: "The Wall 146\" — special handling tooltip", portrait: true },
        { src: "/samsung/Screen Shot 2023-09-17 at 12.04.11 PM.png", alt: "The Wall All-in-One — reviews page" },
      ],
    },
    {
      id: "services",
      label: "Services",
      description:
        "Engineered add-on service configurators — professional TV mounting with dynamic mount selection and order summary, The Wall All-in-One's installation cost builder with add-on toggles, and the Knox Manage MDM QuickStart upsell.",
      screenshots: [
        { src: "/samsung/TVWallMountOptions.png", alt: "Professional TV mounting options", portrait: true },
        { src: "/samsung/MVTvInstallations.png", alt: "TV mounting service with order summary (mobile)", portrait: true },
        { src: "/samsung/WallAIOOptions.png", alt: "The Wall AIO — installation summary", portrait: true },
        { src: "/samsung/WallAIOInstall.png", alt: "The Wall AIO — installation add-ons configurator", portrait: true },
        { src: "/samsung/KnoxManageQuickstartService.png", alt: "Knox Manage QuickStart upsell", portrait: true },
      ],
    },
    {
      id: "galaxy-reserve",
      label: "Flagship Launches",
      description:
        "Delivered high-impact landing pages for major product launches including S24, S23, Tablets, and Galaxy Notebooks. Reserve pages captured over 5,000 pre-release customer inquiries, feeding lead data directly into sales and marketing analytics pipelines.",
      screenshots: [
        { src: "/samsung/Reserve2023.png", alt: "Galaxy Z Flip — reservation landing page" },
        { src: "/samsung/ReserveTimer.png", alt: "Reservation page with live countdown timer" },
      ],
    },
    {
      id: "solve-for-tomorrow",
      label: "Solve for Tomorrow",
      description:
        "Sole front-end developer for Samsung's national Solve for Tomorrow education contest. Independently refined UI/UX designs, built responsive interfaces with ReactJS, jQuery, and Sass, and optimized API integration to support thousands of student participants.",
      screenshots: [
        { src: "/samsung/SFTApplicationForm1.png", alt: "SFT application form — educator info" },
        { src: "/samsung/SFTAppForm2.png", alt: "SFT application form — concept overview" },
        { src: "/samsung/SFTAccount.png", alt: "Solve for Tomorrow — account dashboard" },
      ],
    },
  ],
};
