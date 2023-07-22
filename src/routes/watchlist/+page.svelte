<script>
     import { onMount } from "svelte";
    import {getJWTFromLocalStorage,getUsersFromLocalStorage } from '../api/authencations'
    import { goto } from "$app/navigation";
    import { user,movies,genre_store, user_watchlists} from "../../stores/stores";
    import { error_toast} from "../../services/toasts"
    import { get_movies ,get_genre} from "../../services/movie_api_services";
    const route_tomoview = (id) =>{
      goto('movie/'+id)

    }
    const display_genre = (genre_list) => {
      let g_str = ' '
      genre_list.forEach((no)=>{
        let smap =  $genre_store.filter((d)=>d.id==no)
        g_str+=smap[0].name + ","
      })
      return g_str.slice(0,g_str.length-1)
    }
   
   const  removeFromWatchList= (id) =>{
    console.log('hehe')
    $movies = $movies.map((d)=>{ 
      if(d.id == id ){ 

        d['watchlist']=false
    } 
    return d  
   })
    $user_watchlists = $user_watchlists.filter((d)=> d.id != id)
   }
  
</script>

<button type="button" style="float:right" class=" mr-4 m-2 right-0 px-p15 text-sm text-white font-medium py-p10 rounded bg-blue-500 ml-3 ml-auto  bg-bg-blue-500 font-medium rounded text-yellow-50 text-sm px-5 py-2" on:click|preventDefault={()=> goto("movies")}>Back</button>
<div>


    {#if  $user_watchlists.length }
    <div class="container mx-auto mt-12">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Sample movie card -->
      {#each $user_watchlists as movie }
      <div class="bg-white rounded-lg shadow p-4">
        <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} on:click={()=>route_tomoview(movie.id)} class="w-full h-48 object-cover rounded-md">
        <h2 class="text-xl font-semibold mt-2">{movie.title}</h2>
        <p class="text-gray-600">Release Date:{movie.release_date} </p>
        <p class="text-gray-600">Rating: {movie.vote_average ? movie.vote_average : ''}/10</p>
        <p class="text-gray-600">Geners: { display_genre(movie.genre_ids)}</p>
        {#if movie.watchlist}
        
        <div class="flex items-center justify-between">
          <!-- Delete icon SVG -->
          <button class="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg" >Added In Watchlist</button>
          <img src='/deleteIcon.svg' class="h-10 mt-3" title="Delete From Watchlist" on:click={removeFromWatchList(movie.id)}>
        
          <!-- "Added to Watchlist" text -->

        </div>
        
        {/if}
      </div>
      {/each}

      <!-- Add more movie cards here -->
    </div>
    </div>
 {:else}
         <div class="text-lg text-center mt-5 font-bold"> NO Movie Found In WatchList </div>
 {/if}
 
</div>