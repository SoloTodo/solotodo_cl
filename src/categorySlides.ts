import { NavigationItemProps } from "./contexts/NavigationContext";

export const categorySlides: NavigationItemProps[] = [
  {
    name: "Notebooks gamer",
    path: "/notebooks?score_games_start=300",
    picture: "https://media.solotodo.com/media/nav_items/gamer.png",
    subtitle: "Corre tus juegos en cualquier lugar",
  },
    {
    name: "PS5",
    path: "/consoles?families=1182932",
    picture: "https://media.solotodo.com/media/nav_items/ps5.png",
    subtitle: "Lo más reciente de Sony",
  },
  {
    name: "Smartphones 5G",
    path: "/celulares?min_network_generation_start=1123014",
    picture: "https://media.solotodo.com/media/nav_items/5g_W16hqGL.png",
    subtitle: "Conéctate a la red más rápida",
  },
  {
    name: "Tarjetas de video gamer",
    path: "/video_cards?tdmark_time_spy_score_start=3500",
    picture: "https://media.solotodo.com/media/nav_items/rtx_JhrQICd.png",
    subtitle: "Las mejores tarjetas de video para tu PC",
  },
];
