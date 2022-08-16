export type Slide = {
  asset: {
    id: number;
    picture: string;
    theme_color: string;
  };
  categories: string[];
  category_priority: number;
  destination_url: string;
  home_priority: number;
  id: number;
  label: string;
  url: string;
};
