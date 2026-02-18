import { Movie } from "../app/types/Movie";

export const movies: Movie[] = [
  {
    id: 1,
    title: "Wuthering Heights",
    genre: "Drama",
    status: "Showing Now",
    rating: "R",
    description: "Wuthering Heights",
    posterUrl: "WutheringHeights.jpeg",
    trailerUrl: "https://www.youtube.com/watch?v=3fLCdIYShEQ",
    showings: [
      { date: "2026-02-18", times: ["2:00 PM", "5:00 PM", "8:00 PM"] }
    ]
  },
];
