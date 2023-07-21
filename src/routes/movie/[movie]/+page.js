import { error } from '@sveltejs/kit';
 import { get_movie } from '../../../services/movie_api_services';
/** @type {import('./$types').PageLoad} */


// api to fetch specific movie data

export async function load({ params }) {
  const data = await get_movie(params.movie)
  if(data[1].ok){
    return data[0]
  }
  throw error(404, 'Not found');
}
