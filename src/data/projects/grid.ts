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
        "Designed and illustrated the full visual asset library for Arbor Trail, an Audubon Society-inspired AR nature journal. Owned the entire illustration pipeline: botanical plant studies, hand-animated wildlife sprites (deer, rabbit, frog, squirrel), and in-app UI elements. Assets had to read clearly at small sizes on mobile AR hardware, driving a clean, high-contrast illustration style that retained detail at any scale.",
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
        "Illustrated and animated all character art for Skelly's Search for Dairy, a nutrition education game for elementary-age children. Part of a sustained three-year creative output of 70+ illustrations across multiple GRID Lab titles — spanning character design, expressive pose animation, and environment art that balanced the lab's educational research goals with a genuinely engaging player experience.",
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
        "Designed a cast of portrait characters for a Vuforia-based AR campus history experience, commissioned for the SCUP (Society for College and University Planning) national conference. Each character communicates their academic department's identity at a glance — a character-design challenge balancing institutional brand with approachable, game-ready illustration. Presented live at conference to an audience of university planning professionals.",
      screenshots: [
        { src: "/GRIDimages/images/voorheescard.jpg", alt: "Voorhees Mall — Van Dyck Hall at Rutgers", portrait: true },
        { src: "/GRIDimages/voorheesmall/images/04.png", alt: "Amy — student advisor portrait character", contain: true },
        { src: "/GRIDimages/voorheesmall/images/02.jpg", alt: "AR experience in use — Milledoler Hall", portrait: true },
        { src: "/GRIDimages/voorheesmall/images/03.jpg", alt: "Voorhees Hall info screen with Allan character", portrait: true },
      ],
    },
  ],
};
