'use client';

import { useEffect, useState } from "react";

const MOVIE_API = "http://localhost:8080/api/movies";
const ADMIN_MOVIE_API = "http://localhost:8080/admin/movies";

type Movie = {
  id?: number;
  title: string;
  synopsis: string;
  mpaaRating: string;
  status: string;
  releaseDate: string;
  posterUrl: string;
  trailerUrl: string;
  categories: string[];
  cast: string[];
  directors: string[];
  producers: string[];
};

export default function ManageMovies() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>("");
  
  const [newMovie, setNewMovie] = useState({
    title: "",
    synopsis: "",
    mpaaRating: "",
    status: "",
    releaseDate: "",
    posterUrl: "",
    trailerUrl: ""
  });

  const [categoriesStr, setCategoriesStr] = useState("");
  const [castStr, setCastStr] = useState("");
  const [directorsStr, setDirectorsStr] = useState("");
  const [producersStr, setProducersStr] = useState("");

  useEffect(() => {
    fetch(MOVIE_API)
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.error(err));
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #333",
    background: "#222",
    color: "white",
    marginTop: "6px"
  };

  const buttonStyle: React.CSSProperties = {
    background: "#FFCC00",
    color: "black",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    fontWeight: 600
  };

  const handleChange = (field: string, value: any) => {
    setNewMovie(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddMovie = async () => {
    
    const parsedCategories = categoriesStr.split(",").map(v => v.trim()).filter(v => v !== "");
    const parsedCast = castStr.split(",").map(v => v.trim()).filter(v => v !== "");
    const parsedDirectors = directorsStr.split(",").map(v => v.trim()).filter(v => v !== "");
    const parsedProducers = producersStr.split(",").map(v => v.trim()).filter(v => v !== "");

    const payload = {
      ...newMovie,
      categories: parsedCategories,
      cast: parsedCast,
      directors: parsedDirectors,
      producers: parsedProducers
    };

    const isFormComplete = 
      payload.title.trim() !== "" &&
      payload.synopsis.trim() !== "" &&
      payload.mpaaRating.trim() !== "" &&
      payload.status.trim() !== "" &&
      payload.releaseDate.trim() !== "" &&
      payload.posterUrl.trim() !== "" &&
      payload.trailerUrl.trim() !== "" &&
      payload.categories.length > 0 &&
      payload.cast.length > 0 &&
      payload.directors.length > 0 &&
      payload.producers.length > 0;

    if (!isFormComplete) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(ADMIN_MOVIE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to create movie");
      }

      const created = await response.json();
      setMovies([...movies, created]);

      setNewMovie({
        title: "", synopsis: "", mpaaRating: "", status: "", releaseDate: "", posterUrl: "", trailerUrl: ""
      });
      setCategoriesStr("");
      setCastStr("");
      setDirectorsStr("");
      setProducersStr("");
      setError("");

    } catch (err) {
      console.error(err);
      alert("Error creating movie");
    }
  };

  return (
    <div>
      <h1 style={{ color: "#FFCC00", fontSize: "26px" }}>Manage Movies</h1>

      {/* Existing Movies */}
      <div style={{ marginTop: "40px" }}>
        {movies.map(movie => (
          <div key={movie.id} style={{ background: "#111", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
            <h3 style={{ color: "#FFCC00" }}>{movie.title}</h3>
            <p style={{ color: "#aaa", fontSize: "14px" }}>{movie.status} | {movie.mpaaRating}</p>
            
            {movie.categories && movie.categories.length > 0 && (
               <p style={{ color: "#ddd", fontSize: "13px", marginTop: "5px" }}>
                 Categories: {movie.categories.join(", ")}
               </p>
            )}
            
            <p style={{ color: "#ddd" }}>{movie.releaseDate}</p>
          </div>
        ))}
      </div>

      {/* Add Movie Form */}
      <div style={{ marginTop: "50px", background: "#111", padding: "30px", borderRadius: "12px" }}>
        <h2 style={{ color: "#FFCC00" }}>Add New Movie</h2>

        <label>Title</label>
        <input style={inputStyle} value={newMovie.title} onChange={e => handleChange("title", e.target.value)} />

        <label>Synopsis</label>
        <textarea style={inputStyle} value={newMovie.synopsis} onChange={e => handleChange("synopsis", e.target.value)} />

        <label>MPAA Rating</label>
        <input style={inputStyle} value={newMovie.mpaaRating} onChange={e => handleChange("mpaaRating", e.target.value)} />

        <label>Status</label>
        <select style={inputStyle} value={newMovie.status} onChange={e => handleChange("status", e.target.value)}>
          <option value="">Select Status</option>
          <option value="NOW_SHOWING">Now Showing</option>
          <option value="COMING_SOON">Coming Soon</option>
        </select>

        <label>Release Date</label>
        <input type="date" style={inputStyle} value={newMovie.releaseDate} onChange={e => handleChange("releaseDate", e.target.value)} />

        <label>Poster URL</label>
        <input style={inputStyle} value={newMovie.posterUrl} onChange={e => handleChange("posterUrl", e.target.value)} />

        <label>Trailer URL</label>
        <input style={inputStyle} value={newMovie.trailerUrl} onChange={e => handleChange("trailerUrl", e.target.value)} />

        <label>Categories (comma separated)</label>
        <input style={inputStyle} value={categoriesStr} onChange={e => setCategoriesStr(e.target.value)} />

        <label>Cast (comma separated)</label>
        <input style={inputStyle} value={castStr} onChange={e => setCastStr(e.target.value)} />

        <label>Directors (comma separated)</label>
        <input style={inputStyle} value={directorsStr} onChange={e => setDirectorsStr(e.target.value)} />

        <label>Producers (comma separated)</label>
        <input style={inputStyle} value={producersStr} onChange={e => setProducersStr(e.target.value)} />

        {error && <p style={{ color: "#ff4444", fontWeight: "bold", marginTop: "15px" }}>{error}</p>}

        <button style={buttonStyle} onClick={handleAddMovie}>
          Save Movie
        </button>
      </div>
    </div>
  );
}