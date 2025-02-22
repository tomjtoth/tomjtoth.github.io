import {
  Home,
  CV,
  BatteryMonitor,
  Lyrics,
  ShoppingList,
  ArxFatalis,
  Visitors,
  Luxor,
  Quotes,
} from "..";

type RouteDetails = {
  path: string;
  element: React.ReactElement;
  label?: string;
  lang?: string;
};

export const ROUTES_CONFIG: RouteDetails[] = [
  {
    path: "/",
    element: <Home />,
    label: "alkuun",
  },
  {
    path: "/battery-monitor",
    element: <BatteryMonitor />,
    label: "akunvalvonta",
  },
  {
    path: "/shopping-list",
    element: <ShoppingList />,
    label: "ostoslista",
  },
  {
    path: "/quotes",
    element: <Quotes />,
    label: "sitaatit",
  },
  {
    path: "/lyrics",
    element: <Lyrics />,
    label: "låttext",
    lang: "sv",
  },
  {
    path: "/visitors",
    element: <Visitors />,
    label: "látogatók",
    lang: "hu",
  },
  {
    path: "/luxor",
    element: <Luxor />,
    label: "Luxor sorsolás",
    lang: "hu",
  },
  {
    path: "/cv",
    element: <CV />,
    label: "Curriculum Vitae",
    lang: "en",
  },
  {
    path: "/arx-fatalis",
    element: <ArxFatalis />,
    label: "Arx Fatails minigame",
    lang: "en",
  },
];
