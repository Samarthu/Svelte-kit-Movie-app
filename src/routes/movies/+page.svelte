<script>
    import { onMount } from "svelte";
    import {getJWTFromLocalStorage,getUsersFromLocalStorage } from '../api/authencations'
    import { goto } from "$app/navigation";
    import { user,movies,genre_store, user_watchlists,display_genres,backup_movies,display_years, display_ratings
      ,selectedGenre,selectedYear,selectedRating} from "../../stores/stores";
    import { error_toast} from "../../services/toasts"
    import { get_movies ,get_genre} from "../../services/movie_api_services";
    import { list } from "postcss";
    import { writable } from 'svelte/store';
  
 let showNav = false 
  


    
    onMount(async ()=>{
       setTimeout(()=>{
        load_movies()
       },100);
      
    })
   
   $: console.log($selectedGenre, $selectedYear,$selectedRating,'j')
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
        set_filters_list()
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

   const set_filters_list = () =>{
    $display_genres = []
    $display_years = []
    $display_ratings=[]
    let set_D = new Set()
    let set_Y = new Set()
    let set_R = new Set()
    $movies.map((d)=>{
      set_Y.add(d.release_date.split('-')[0])
      set_R.add(parseInt(d.vote_average))
      d.genre_ids.map((no)=>{
       set_D.add($genre_store.filter((d)=>d.id==no)[0]) 
      })
    })
  
    // Converting Set into Array
    $display_genres = [...set_D]
    $display_years = [...set_Y].sort().map((d)=>{
      let obj =  {name:d,is_selected:false }
      if($selectedYear.includes(d)){
        obj.is_selected = true;
      }
      return obj
    })
    $display_ratings=[...set_R].sort().map((d)=>{ 
      let obj={name:d,is_selected:false }
      if($selectedRating.includes(d)){
        obj.is_selected = true;
      }
      return obj
    })

    // This Code Make Sure That Fitered Movie Should Be According To Filteres While Redirections 
    if($selectedGenre.length > 0 || $selectedRating.length > 0 || $selectedYear.length > 0){
      $movies = $backup_movies.filter((d) => 
     ($selectedGenre.length == 0 ? true:check_movie_availability(d.genre_ids,$selectedGenre)) &&
     ($selectedYear.length ==0  ? true:$selectedYear.includes(d.release_date.split('-')[0])  )  && 
     ($selectedRating.length == 0 ? true :$selectedRating.includes(parseInt(d.vote_average)))
     ); 
    }
   }

   const handleGenreClick = (obj,option) =>{

    let genre_idx = $display_genres.indexOf(obj)
    let year_idx = $display_years.indexOf(obj)
    let rating_idx = $display_ratings.indexOf(obj)
   
    if(obj.is_selected)
    {
      obj.is_selected = false
      if($selectedGenre.length && option == 1) $selectedGenre = $selectedGenre.filter((d)=>d !==obj.id)
      if($selectedYear.length && option == 2) $selectedYear = $selectedYear.filter((d)=>d !==obj.name)
      if($selectedRating.length && option == 3) $selectedRating = $selectedRating.filter((d)=>d !==obj.name)
    }else{
     if(option == 1 && !$selectedGenre.includes(obj.id)) $selectedGenre.push(obj.id)
     if(option == 2 && !$selectedYear.includes(obj.name))$selectedYear.push(obj.name)
     if(option == 3 && !$selectedRating.includes(obj.name) )$selectedRating.push(obj.name)
      
      obj.is_selected = true
     
    }
    if(genre_idx !== -1 && option == 1 ){
        $display_genres[genre_idx] =obj 
      }
      if(year_idx !== -2 && option == 2){
      $display_years[year_idx] = obj
    }
    if(rating_idx !== -2 && option == 3){
      $display_ratings[rating_idx] = obj
    }
      // Filter Out Movies According To Genre Selection 
    $movies = $backup_movies.filter((d) => 
     ($selectedGenre.length == 0 ? true:check_movie_availability(d.genre_ids,$selectedGenre)) &&
     ($selectedYear.length ==0  ? true:$selectedYear.includes(d.release_date.split('-')[0])  )  && 
     ($selectedRating.length == 0 ? true :$selectedRating.includes(parseInt(d.vote_average)))
     ); 
      // Reseting Movies 
    if($selectedGenre.length == 0 && $selectedYear.length == 0 && $selectedRating.length == 0 ) $movies = $backup_movies

   }
  
   // function that  tell movie genre is matching with selected genre or not

   const check_movie_availability = (movieGenre,selectedGenre) =>  movieGenre.filter(x => selectedGenre.indexOf(x) !== -1).length > 0 ? true : false
   


</script>

<div>
  
 
<main class="container mx-auto mt-8">
  <!-- Dynamic Filters  -->
  <div class="flex items-center gap-2 mb-5 flex-wrap px-4">
     <h2 class="whitespace-nowrap "> Genre : </h2>
    {#each $display_genres as genre}
      <button
        type="button"
        class="border-2 whitespace-nowrap rounded-lg {!genre.is_selected ? "bg-white":"bg-green-600"} bg-white p-2"
        on:click={() => {handleGenreClick(genre,1)}}
      >
        {genre.name}
      </button>
    {/each}
  </div>
  <div class="flex items-center gap-2 mb-5 px-4">
    <h2 class="whitespace-nowrap "> Years : </h2>
   {#each $display_years as year}
     <button
       type="button"
       class="border-2 whitespace-nowrap rounded-lg {!year.is_selected ? "bg-white":"bg-green-600"} bg-white p-2"
       on:click={() => {handleGenreClick(year,2)}}
     >
       {year.name}
     </button>
   {/each}
 </div>
 <div class="flex items-center gap-2 mb-5 px-4">
  <h2 class="whitespace-nowrap "> Rating : </h2>
    {#each $display_ratings as rating}
      <button
        type="button"
        class="border-2 whitespace-nowrap rounded-lg {!rating.is_selected ? "bg-white":"bg-green-600"} bg-white p-2"
        on:click={() => {handleGenreClick(rating,3)}}
      >
        {rating.name} + 
      </button>
    {/each}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Sample movie card -->
      {#if $movies.length == 0}
      <div  class="text-4xl ml-10 mt-10">Movie Not Found</div>
      {:else}
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
      {/if}
      <!-- Add more movie cards here -->
    </div>
  
 </main>
 
</div>