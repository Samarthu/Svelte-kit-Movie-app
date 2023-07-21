import { writable } from "svelte/store";

export const user = writable([]);

export const user_watchlists = writable ([]);
export const movies =writable([]);
export const backup_movies = writable([]);
export const genre_store = writable([]);
export const display_genres = writable([]);