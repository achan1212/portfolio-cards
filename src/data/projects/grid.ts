import type { WorkExperience } from "./types";

export const grid: WorkExperience = {
  id: "grid",
  company: "Rutgers GRID Lab",
  role: "Illustrator",
  years: "July 2018 – June 2021",
  tags: ["Digital Illustration", "Character Animation", "Augmented Reality", "Vuforia", "Educational Tech"],
  features: [
    {
      id: "arbor-trail",
      label: "Arbor Trail XR",
      description:
        "Illustrated the complete flora and fauna asset library for an AR nature trail app — botanical plant studies, animated wildlife (deer, rabbit, frog, squirrel), and in-app UI elements used throughout the Audubon-inspired journal experience.",
      screenshots: [
        { src: "/GRIDimages/images/arbortrailcard.jpg", alt: "Arbor Trail app — table of contents UI", portrait: true },
        { src: "/GRIDimages/arbortrail/masonryGRID/images/floweringdogwood.png", alt: "Flowering dogwood botanical illustration", contain: true },
        { src: "/GRIDimages/arbortrail/masonryGRID/images/squirrel.png", alt: "Squirrel wildlife illustration", contain: true },
        { src: "/GRIDimages/arbortrail/masonryGRID/images/deerrunning.gif", alt: "Deer running animation", contain: true },
        { src: "/GRIDimages/arbortrail/masonryGRID/images/rabbitjumping.gif", alt: "Rabbit jumping animation", contain: true },
        { src: "/GRIDimages/arbortrail/masonryGRID/images/frog.png", alt: "Frog illustration", contain: true },
      ],
    },
    {
      id: "nutrition-game",
      label: "Nutrition Game",
      description:
        "Created all character illustrations and animated sprites for Skelly's Search for Dairy — an educational nutrition game for kids. Part of a body of 70+ vibrant illustrations produced for Rutgers GRID Lab to enrich interactive learning experiences.",
      screenshots: [
        { src: "/GRIDimages/images/skellycard.jpg", alt: "Skelly's Search for Dairy — title screen and park scene" },
        { src: "/GRIDimages/nutritiongame/masonryGRID/images/skellysintro.gif", alt: "Skelly intro animation", contain: true },
        { src: "/GRIDimages/nutritiongame/masonryGRID/images/pointingskelly.png", alt: "Skelly mascot illustration", contain: true },
        { src: "/GRIDimages/nutritiongame/masonryGRID/images/parkkidswr.gif", alt: "Park kids scene animation" },
        { src: "/GRIDimages/nutritiongame/masonryGRID/images/cowsgrazing.gif", alt: "Cows grazing animation" },
        { src: "/GRIDimages/nutritiongame/masonryGRID/images/bonetobankwr.gif", alt: "Bone to bank animation" },
      ],
    },
    {
      id: "voorhees-mall",
      label: "Voorhees Mall XR",
      description:
        "Illustrated portrait characters for a Vuforia-based AR campus tour of Rutgers' Voorhees Mall, commissioned for the SCUP conference. Each character represents a building's department and guides players through campus history.",
      screenshots: [
        { src: "/GRIDimages/images/voorheescard.jpg", alt: "Voorhees Mall — Van Dyck Hall at Rutgers", portrait: true },
        { src: "/GRIDimages/voorheesmall/images/04.png", alt: "Amy — student advisor portrait character", contain: true },
        { src: "/GRIDimages/voorheesmall/images/02.jpg", alt: "AR experience in use — Milledoler Hall", portrait: true },
        { src: "/GRIDimages/voorheesmall/images/03.jpg", alt: "Voorhees Hall info screen with Allan character", portrait: true },
      ],
    },
  ],
};
