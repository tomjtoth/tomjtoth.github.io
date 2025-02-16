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
  title?: string;
  lang?: string;
};

export const ROUTES_CONFIG: RouteDetails[] = [
  {
    path: "/",
    element: <Home />,
    title: "alkuun",
  },
  {
    path: "/cv",
    element: <CV />,
    title: "Curriculum Vitae",
    lang: "en",
  },
  {
    path: "/battery-monitor",
    element: <BatteryMonitor />,
    title: "akunvalvonta",
  },
  {
    path: "/shopping-list",
    element: <ShoppingList />,
    title: "ostoslista",
  },
  {
    path: "/quotes",
    element: <Quotes />,
    title: "sitaatit",
  },
  {
    path: "/lyrics",
    element: <Lyrics />,
    title: "låttext",
    lang: "sv",
  },
  {
    path: "/visitors",
    element: <Visitors />,
    title: "látogatók",
    lang: "hu",
  },
  {
    path: "/luxor",
    element: <Luxor />,
    title: "Luxor sorsolás",
    lang: "hu",
  },
  {
    path: "/arx-fatalis",
    element: <ArxFatalis />,
    title: "Arx Fatails minipeli",
  },
];
