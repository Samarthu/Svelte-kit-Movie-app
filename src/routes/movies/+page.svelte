<script>
    import { onMount } from "svelte";
    import {getJWTFromLocalStorage,getUsersFromLocalStorage } from '../api/authencations'
    import { goto } from "$app/navigation";
    import { user,movies,genre_store, user_watchlists,display_genres,backup_movies} from "../../stores/stores";
    import { error_toast} from "../../services/toasts"
    import { get_movies ,get_genre} from "../../services/movie_api_services";
    import { list } from "postcss";
  
 let showNav = false 
 let selectedGenre = []


    
    onMount(async ()=>{
       setTimeout(()=>{
        load_movies()
       },100);
    })
   
   
    const load_movies=async()=>{
      const data = await get_movies()
        console.log(data)
        if(data[0].total_results> 0 ){
         $movies = data[0].results.map((d)=>{ d['watchlist']=false;return d} );
         backup_movies.set($movies)
        }else{
        error_toast('Eror In Getting Movies List')
       }
        console.log($movies)
        const token = getJWTFromLocalStorage();
        if(!token){
            window.location.href = "/"
        }
        else{
          $user = getUsersFromLocalStorage();
        }
        set_generes_list()
    }
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
   const addToWatchList = (movie) => {
    $movies =  $movies.map((d)=>{
      if(d.id == movie.id){
        d['watchlist'] = true
      }
      return d
    })
    $user_watchlists=[... $user_watchlists, movie]

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

   const set_generes_list = () =>{
    $display_genres = []
    let set_D = new Set()
    $movies.map((d)=>{
      d.genre_ids.map((no)=>{
       set_D.add($genre_store.filter((d)=>d.id==no)[0]) 
      })
    })
  
    $display_genres = [...set_D]
   }

   const handleGenreClick = (genre) =>{
    let idx = $display_genres.indexOf(genre)
    if(genre.is_selected)
    {
      genre.is_selected = false
      if(selectedGenre.length) selectedGenre = selectedGenre.filter((d)=>d !==genre.id)
    }else{
      selectedGenre.push(genre.id)
      
      genre.is_selected = true
     
    }
    if(idx !== -1){
        $display_genres[idx] =genre 
      }
      // Filter Out Movies According To Genre Selection 
      $movies = $backup_movies.filter((d) => check_movie_availability(d.genre_ids,selectedGenre))
      // Reseting Movies 
      if(selectedGenre.length == 0 ) $movies = $backup_movies
   }
  
   // function that  tell movie genre is matching with selected genre or not

   const check_movie_availability = (movieGenre,selectedGenre) =>  movieGenre.filter(x => selectedGenre.indexOf(x) !== -1).length > 0 ? true : false
   


</script>

<div>
  
 
<main class="container mx-auto mt-8">
  
  <div class="flex gap-2 mb-5">
    {#each $display_genres as genre}
      <button
        type="button"
        class="border-2 rounded-lg {!genre.is_selected ? "bg-white":"bg-green-600"} bg-white p-2"
        on:click={() => {handleGenreClick(genre)}}
      >
        {genre.name}
      </button>
    {/each}
  </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Sample movie card -->
      {#each $movies as movie }
      <div class="bg-white rounded-lg shadow p-4">
        <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} on:click={()=>route_tomoview(movie.id)} class="w-full h-48 object-cover rounded-md">
        <h2 class="text-xl font-semibold mt-2">{movie.title}</h2>
        <p class="text-gray-600">Release Date:{movie.release_date} </p>
        <p class="text-gray-600">Rating: {movie.vote_average ? movie.vote_average : ''}/10</p>
        <p class="text-gray-600">Geners: { display_genre(movie.genre_ids)}</p>
        {#if !movie.watchlist}
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg" on:click={addToWatchList(movie)}>Add to Watchlist</button>
        {:else}
        
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
  
 </main>
 
</div>