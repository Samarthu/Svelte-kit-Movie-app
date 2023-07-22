import { writable } from "svelte/store";

export const user = writable([]);

export const user_watchlists = writable ([]);
export const movies =writable([]);
export const backup_movies = writable([]);
export const genre_store = writable([]);
export const display_years = writable([]);
export const display_ratings = writable([]);
export const display_genres = writable([]);
export const selectedGenre = writable([])
export const selectedYear =writable ([]);
export const selectedRating = writable([]);
