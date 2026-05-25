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
        "Engineered the end-to-end B2B account registration flow for Samsung's enterprise storefront — a high-stakes onboarding surface where every drop-off represents lost revenue. Implemented multi-step form validation, tax-exempt application with document upload, EIN tooltip guidance, and terms gating. This flow is the primary entry point for all Samsung Business pricing and bulk purchasing, serving thousands of enterprise buyers.",
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
        "Architected a reusable tier-pricing component system that surfaces B2B bulk and volume rates across product detail pages, product cards, and the compare surface — bringing Samsung Business pricing directly into the shopping experience. GTM-driven interaction tracking I instrumented produced a 25% lift in engagement, giving the product team actionable data to shape long-term content strategy.",
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
        "Owned front-end development for Samsung's premium display product line — including The Frame's interactive size and series selectors across mobile and desktop, The Wall All-in-One's configuration surface with a custom special-handling disclosure, and direct integration of Chargeafter buy-now-pay-later financing into the PDP. Built to handle high-traffic launch windows with zero downtime.",
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
        "Built interactive service configurators that extend the purchase moment and convert hardware buyers into ongoing service customers. Delivered a professional TV mounting module with dynamic wall-type selection and real-time order summaries, an installation cost builder for The Wall AIO with toggleable add-on pricing, and the Knox Manage MDM QuickStart upsell page targeting enterprise IT buyers. Each module integrates with Samsung's commerce platform and feeds purchase-intent signals back into analytics.",
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
        "Led front-end delivery for Samsung's highest-visibility US product launches — Galaxy S24, S23, Tablets, and Galaxy Notebooks. These time-sensitive reserve pages were the first public touchpoint for new hardware, demanding flawless execution on hard launch dates coordinated across marketing, design, and engineering. The campaigns captured 5,000+ pre-release inquiries, directly fueling the sales pipeline, with real-time conversion tracking via GTM.",
      screenshots: [
        { src: "/samsung/Reserve2023.png", alt: "Galaxy Z Flip — reservation landing page" },
        { src: "/samsung/ReserveTimer.png", alt: "Reservation page with live countdown timer" },
      ],
    },
    {
      id: "solve-for-tomorrow",
      label: "Solve for Tomorrow",
      description:
        "Served as the sole front-end engineer for Samsung's national Solve for Tomorrow STEM contest — a public application portal used by K-12 educators and students across the country. From wireframe review to production, I owned every front-end decision: responsive layouts, multi-step application flows, account dashboards, and API optimization to handle peak submission windows. The platform supported thousands of concurrent participants without degradation.",
      screenshots: [
        { src: "/samsung/SFTApplicationForm1.png", alt: "SFT application form — educator info" },
        { src: "/samsung/SFTAppForm2.png", alt: "SFT application form — concept overview" },
        { src: "/samsung/SFTAccount.png", alt: "Solve for Tomorrow — account dashboard" },
      ],
    },
  ],
};
