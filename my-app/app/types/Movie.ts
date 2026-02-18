export type Movie = {
  id: number;
  title: string;
  genre: string;
  status: "Showing Now" | "Coming Soon";
  rating: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  showings: {
    date: string;
    times: string[];
  }[];
};
