
<script>
  import { user , movies,genre_store ,user_watchlists,backup_movies} from "../stores/stores";
  import {userLogout,getJWTFromLocalStorage,getUsersFromLocalStorage} from "../routes/api/authencations"
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { error_toast } from "../services/toasts";
    import { search_movie,get_genre } from "../services/movie_api_services";
    onMount(async()=>{
      const genre_res  = await  get_genre()
        $genre_store = genre_res[0].genres.map((d)=>{d['is_selected']= false;return d})
    })

  let show_pop = false;
  const handleLogout = () =>{
    console.log('hrhr')
    user.set([]);
    userLogout();
    window.location.href = '/';
  }
  let inputValue=''
  $:token = null;
  onMount(()=>{
    token = getJWTFromLocalStorage();
      if(token){
          $user = getUsersFromLocalStorage();
      }
  })
  const onSearch = async() =>{
    if(inputValue.trim().length>0){
    // let api = `https://api.themoviedb.org/3/search/movie?api_key=6a888f209bfd0c959b9812222bdede5e&language=en-US&query=${inputValue}&page=1&include_adult=false`
    // const res = await fetch(api);
    // const data = await res.json();
    const data = await search_movie(inputValue)
    console.log(data)
    if(data[1].ok){
      if(data[0].total_results >0){
        $movies = data[0].results.map((d)=>{ d['watchlist']=false;return d} );
        $backup_movies = $movies;
        goto(window.location.origin +"/movies")
      }else{
        error_toast('Search Movie Not Found')
      }
     // 
     console.log(data)
    }
    else{
      error_toast('Data Not Found')
    }
  }
  }
const handleKey =async (e) => {
  if(e.key == "Enter" && inputValue.trim().length >=2){
    onSearch()
  }
  else if(e.key == "Enter" && inputValue.trim().length == 0){
    const res =await fetch("https://api.themoviedb.org/3/movie/popular?api_key=6a888f209bfd0c959b9812222bdede5e")
    const data = await res.json() 
    if(data.total_results> 0 ){
      $movies = data.results;
      
    }else{
       error_toast('Eror In Getting Movies List')
    }
    
  }
}

</script>
<svelte:window on:keydown={(e)=>handleKey(e)}  />

<nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center">
        <img src="/logo_film.jpeg" alt="Movie Listing App Logo" class="w-8 h-8 mr-2">
        <a href="#" class="text-2xl font-bold">Movie Listing App</a>
      </div>
      <div class="flex items-center">
        <div class="flex gap-4 items-center">
       
        <div class="relative">
          <input
            type="text"
            placeholder="Search Movies.."
            bind:value={inputValue}
            class="w-64 py-2 pl-10 pr-10 text-gray-700 rounded-lg shadow focus:outline-none focus:shadow-outline"
          />
        
          <!-- Adjust the height and width of the SVG using h- and w- classes -->
          <svg
            class="h-6 w-6 text-gray-600 absolute top-3 right-4 hover:bg-gray-200 rounded-full "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            on:click={onSearch}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 18h2a8 8 0 100-16 8 8 0 000 16z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-5.2-5.2"
            ></path>
          </svg>
        </div>
        
        
        <a href="/" class="text-white" >Home</a>
        <div>
        <a href="/watchlist" class="text-white" >Watchlist</a>
        <span class="ml-1 bg-green-400 rounded-full px-2 py-1 text-sm font-bold text-black">{$user_watchlists?$user_watchlists.length:0}</span>
        </div>

        
        {#if token || $user.length }
        <span class="text-bglightredcolor flex gap-2 items-center cursor-pointer select-none lowercase " id='optionmenu3' on:click={()=> show_pop = !show_pop} >{$user[0].email} <img style="width: 16px;height:10px;" id="optionmenu6" src='/Vector.png'/> </span>
        
        {:else}
        <span class="text-bglightredcolor">User not logged-in</span>
        {/if}
        </div>
        {#if show_pop}
          <div class=" relative inline-block text-left" id="optionmenu2">
          
          <div class="absolute right-0 z-10 mt-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="p-3 flex justify-between"  on:click={handleLogout} role="none">
              <span class="text-black " on:click={handleLogout}>Logout</span>
            </div>
          </div>
        </div>
      {/if}
       
       
      </div>
      
    </div>
    
</nav>

 