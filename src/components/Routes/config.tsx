import Home from "../Home";
import CV from "../CV";
import BatteryMonitor from "../BatteryMonitor";
import Lyrics from "../Lyrics";
import ShoppingList from "../ShoppingList";
import ArxFatalis from "../ArxFatalis";
import Visitors from "../Visitors";
import Luxor from "../Luxor";
import Quotes from "../Quotes";

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
    path: "/cv",
    element: <CV />,
    label: "Curriculum Vitae",
    lang: "en",
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
    path: "/arx-fatalis",
    element: <ArxFatalis />,
    label: "Arx Fatails minipeli",
  },
];
