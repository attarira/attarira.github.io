"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import DemoShell from "./DemoShell";
import { getMockData } from "@/lib/mockAPI";

type Movie = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  popularity: number;
  contentScore: number;
  collaborativeScore: number;
  novelty: number;
  runtime: string;
  palette: string;
  summary: string;
  signals: string[];
};

type ViewerProfile = {
  id: string;
  label: string;
  detail: string;
  preferredGenres: string[];
  watched: string[];
};

type Neighbor = {
  id: string;
  similarity: number;
  overlap: string;
  favorite: string;
};

type MovieRecData = {
  profiles: ViewerProfile[];
  movies: Movie[];
  neighbors: Neighbor[];
  modelStats: {
    catalogSize: string;
    activeUsers: string;
    precision: string;
  };
};

type RankingWeights = {
  content: number;
  collaborative: number;
  popularity: number;
  novelty: number;
};

const MOVIE_REC_DATA: MovieRecData = {
  modelStats: {
    catalogSize: "9.7K",
    activeUsers: "610",
    precision: "0.82",
  },
  profiles: [
    {
      id: "balanced",
      label: "Balanced Viewer",
      detail: "Mixes crowd favorites with character-driven films.",
      preferredGenres: ["Drama", "Thriller", "Sci-Fi"],
      watched: ["The Prestige", "Arrival", "The Social Network"],
    },
    {
      id: "scifi",
      label: "Sci-Fi Explorer",
      detail: "Prioritizes speculative concepts and worldbuilding.",
      preferredGenres: ["Sci-Fi", "Adventure", "Mystery"],
      watched: ["Interstellar", "Blade Runner 2049", "Ex Machina"],
    },
    {
      id: "weekend",
      label: "Weekend Group",
      detail: "Looks for accessible, high-satisfaction picks.",
      preferredGenres: ["Comedy", "Adventure", "Action"],
      watched: ["Knives Out", "The Grand Budapest Hotel", "Guardians of the Galaxy"],
    },
  ],
  neighbors: [
    {
      id: "user-184",
      similarity: 94,
      overlap: "Arrival, The Prestige, Her",
      favorite: "The Imitation Game",
    },
    {
      id: "user-092",
      similarity: 89,
      overlap: "Interstellar, Ex Machina",
      favorite: "Moon",
    },
    {
      id: "user-417",
      similarity: 84,
      overlap: "Knives Out, Parasite",
      favorite: "The Nice Guys",
    },
  ],
  movies: [
    {
      id: "movie-1",
      title: "The Imitation Game",
      year: 2014,
      genres: ["Drama", "Thriller"],
      rating: 8.0,
      popularity: 78,
      contentScore: 92,
      collaborativeScore: 88,
      novelty: 44,
      runtime: "1h 54m",
      palette: "from-cyan-500 to-blue-950",
      summary: "Historical drama with strong overlap against watched biographical and puzzle-driven titles.",
      signals: ["High actor/theme similarity", "Strong neighbor lift", "Reliable mainstream appeal"],
    },
    {
      id: "movie-2",
      title: "Moon",
      year: 2009,
      genres: ["Sci-Fi", "Mystery"],
      rating: 7.8,
      popularity: 52,
      contentScore: 89,
      collaborativeScore: 81,
      novelty: 76,
      runtime: "1h 37m",
      palette: "from-slate-200 to-slate-800",
      summary: "Compact science-fiction story that matches speculative preferences without over-indexing on popularity.",
      signals: ["Sci-fi concept match", "Useful novelty candidate", "Recommended by close neighbors"],
    },
    {
      id: "movie-3",
      title: "The Nice Guys",
      year: 2016,
      genres: ["Comedy", "Action"],
      rating: 7.4,
      popularity: 60,
      contentScore: 72,
      collaborativeScore: 86,
      novelty: 66,
      runtime: "1h 56m",
      palette: "from-amber-300 to-rose-900",
      summary: "A lighter recommendation driven by similar-user behavior and weekend-watch completion patterns.",
      signals: ["Collaborative boost", "Genre diversity", "Good group-session fit"],
    },
    {
      id: "movie-4",
      title: "Gattaca",
      year: 1997,
      genres: ["Sci-Fi", "Drama"],
      rating: 7.7,
      popularity: 57,
      contentScore: 94,
      collaborativeScore: 73,
      novelty: 70,
      runtime: "1h 46m",
      palette: "from-emerald-300 to-zinc-900",
      summary: "High content similarity for viewers who respond to ethical sci-fi and restrained drama.",
      signals: ["Genre-vector match", "Theme similarity", "Catalog discovery value"],
    },
    {
      id: "movie-5",
      title: "Chef",
      year: 2014,
      genres: ["Comedy", "Drama"],
      rating: 7.3,
      popularity: 64,
      contentScore: 68,
      collaborativeScore: 77,
      novelty: 53,
      runtime: "1h 54m",
      palette: "from-orange-300 to-red-800",
      summary: "Warm, low-friction option when the ranking favors broad appeal over niche similarity.",
      signals: ["Accessible tone", "Good satisfaction floor", "Popular among casual neighbors"],
    },
    {
      id: "movie-6",
      title: "Coherence",
      year: 2013,
      genres: ["Sci-Fi", "Thriller"],
      rating: 7.2,
      popularity: 42,
      contentScore: 87,
      collaborativeScore: 69,
      novelty: 88,
      runtime: "1h 29m",
      palette: "from-violet-300 to-indigo-950",
      summary: "Niche recommendation that rises when novelty and content similarity are weighted more heavily.",
      signals: ["High novelty", "Tight genre fit", "Low-popularity discovery"],
    },
  ],
};

const INITIAL_WEIGHTS: RankingWeights = {
  content: 45,
  collaborative: 40,
  popularity: 30,
  novelty: 35,
};

function scoreMovie(movie: Movie, profile: ViewerProfile, weights: RankingWeights) {
  const genreBoost = movie.genres.filter((genre) => profile.preferredGenres.includes(genre)).length * 6;
  const weightedScore =
    movie.contentScore * (weights.content / 100) +
    movie.collaborativeScore * (weights.collaborative / 100) +
    movie.popularity * (weights.popularity / 100) +
    movie.novelty * (weights.novelty / 100) +
    genreBoost;
  const normalized = Math.min(99, Math.round(weightedScore / 2.15));

  return {
    score: normalized,
    genreBoost,
    content: Math.round(movie.contentScore * (weights.content / 100)),
    collaborative: Math.round(movie.collaborativeScore * (weights.collaborative / 100)),
  };
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {value}%
        </span>
      </div>
      <input
        className="mt-4 w-full accent-indigo-600"
        max="100"
        min="0"
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function MoviePoster({ movie, rank }: { movie: Movie; rank: number }) {
  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br ${movie.palette} p-4 text-white shadow-lg`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_28%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-sm font-bold backdrop-blur">
          {rank}
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight">{movie.title}</p>
          <p className="mt-1 text-xs text-white/75">
            {movie.year} &middot; {movie.runtime}
          </p>
        </div>
      </div>
    </div>
  );
}

function MovieRecommendationExperience({ snapshot }: { snapshot: MovieRecData }) {
  const [activeProfileId, setActiveProfileId] = useState(snapshot.profiles[0].id);
  const [weights, setWeights] = useState<RankingWeights>(INITIAL_WEIGHTS);
  const [selectedMovieId, setSelectedMovieId] = useState(snapshot.movies[0].id);

  const activeProfile =
    snapshot.profiles.find((profile) => profile.id === activeProfileId) ?? snapshot.profiles[0];

  const rankedMovies = useMemo(() => {
    return snapshot.movies
      .map((movie) => ({
        movie,
        ranking: scoreMovie(movie, activeProfile, weights),
      }))
      .sort((left, right) => right.ranking.score - left.ranking.score);
  }, [activeProfile, snapshot.movies, weights]);

  const selected =
    rankedMovies.find((entry) => entry.movie.id === selectedMovieId) ?? rankedMovies[0];

  return (
    <div className="min-h-full bg-[#f6f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                MR
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
                  Movie Recommendation System
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Hybrid ranking workbench
                </h2>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Explore how content features, collaborative filtering signals, popularity, and novelty change the final recommendation slate.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              ["Catalog", snapshot.modelStats.catalogSize],
              ["Users", snapshot.modelStats.activeUsers],
              ["Precision", snapshot.modelStats.precision],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="grid gap-5 p-5 sm:p-7 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Viewer Profile</h3>
            <div className="mt-4 space-y-3">
              {snapshot.profiles.map((profile) => (
                <button
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    profile.id === activeProfileId
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  key={profile.id}
                  onClick={() => setActiveProfileId(profile.id)}
                  type="button"
                >
                  <span className="text-sm font-semibold text-slate-900">{profile.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{profile.detail}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Watched Titles</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeProfile.watched.map((title) => (
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700" key={title}>
                  {title}
                </span>
              ))}
            </div>
            <h4 className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Preferred Genres
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeProfile.preferredGenres.map((genre) => (
                <span className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white" key={genre}>
                  {genre}
                </span>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recommendation Slate
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                Ranked for {activeProfile.label}
              </h3>
            </div>
            <button
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={() => setWeights(INITIAL_WEIGHTS)}
              type="button"
            >
              Reset weights
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rankedMovies.map(({ movie, ranking }, index) => (
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className={`grid grid-cols-[96px_minmax(0,1fr)] gap-4 rounded-2xl border p-3 text-left transition ${
                  selected.movie.id === movie.id
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
                initial={{ opacity: 0, y: 8 }}
                key={movie.id}
                onClick={() => setSelectedMovieId(movie.id)}
                transition={{ delay: index * 0.03 }}
                type="button"
              >
                <MoviePoster movie={movie} rank={index + 1} />
                <div className="min-w-0 py-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-950">{movie.title}</h4>
                      <p className="mt-1 text-xs text-slate-500">{movie.genres.join(" / ")}</p>
                    </div>
                    <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs font-semibold text-white">
                      {ranking.score}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{movie.summary}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600" style={{ width: `${ranking.score}%` }} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-950">Ranking Controls</h3>
            <div className="mt-4 space-y-3">
              <Slider
                label="Content similarity"
                onChange={(value) => setWeights((current) => ({ ...current, content: value }))}
                value={weights.content}
              />
              <Slider
                label="Collaborative signal"
                onChange={(value) => setWeights((current) => ({ ...current, collaborative: value }))}
                value={weights.collaborative}
              />
              <Slider
                label="Popularity"
                onChange={(value) => setWeights((current) => ({ ...current, popularity: value }))}
                value={weights.popularity}
              />
              <Slider
                label="Novelty"
                onChange={(value) => setWeights((current) => ({ ...current, novelty: value }))}
                value={weights.novelty}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Selected Recommendation
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950">{selected.movie.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{selected.movie.summary}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Content", selected.ranking.content],
                ["Users", selected.ranking.collaborative],
                ["Genre boost", selected.ranking.genreBoost],
                ["Rating", selected.movie.rating.toFixed(1)],
              ].map(([label, value]) => (
                <div className="rounded-2xl bg-slate-50 p-3" key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {selected.movie.signals.map((signal) => (
                <div className="flex items-center gap-2 text-sm text-slate-700" key={signal}>
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {signal}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <h3 className="text-sm font-semibold">Nearest Neighbors</h3>
            <div className="mt-4 space-y-3">
              {snapshot.neighbors.map((neighbor) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3" key={neighbor.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-slate-300">{neighbor.id}</span>
                    <span className="text-xs font-semibold text-emerald-300">{neighbor.similarity}% similar</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">Overlap: {neighbor.overlap}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-300">Lifted title: {neighbor.favorite}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default function MovieRecommendationDemo() {
  const fetchDemoData = async () => {
    return getMockData<MovieRecData>({
      id: "movie-rec-sys-demo",
      delayMs: 800,
      mockResponse: MOVIE_REC_DATA,
    });
  };

  return (
    <DemoShell title="Movie Recommendation System" fetchData={fetchDemoData}>
      {(data) => (data ? <MovieRecommendationExperience snapshot={data} /> : null)}
    </DemoShell>
  );
}
