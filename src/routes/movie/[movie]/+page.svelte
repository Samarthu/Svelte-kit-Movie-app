<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';


  /** @type {import('./$types').PageData} */


  export let data;
  console.log(data)
  onMount(()=>{
   
  })
  
</script>

<!-- Showing Movie Detail Page -->
<button type="button" style="float:right" class=" mr-4 m-2 right-0 px-p15 text-sm text-white font-medium py-p10 rounded bg-blue-500 ml-3 ml-auto  bg-bg-blue-500 font-medium rounded text-yellow-50 text-sm px-5 py-2" on:click|preventDefault={()=> goto(window.origin + '/movies')}>Back</button>
<div class="movie-details">
  <div class="img-container">
    <a href={'https://image.tmdb.org/t/p/original' + data.backdrop_path}>
    <img src={'https://image.tmdb.org/t/p/original' + data.backdrop_path} alt={data.original_title}/>
    </a>
  </div>
  <div class="txt-container">
    <h1>{data.original_title}</h1>
    <p class="overview">{data.overview}</p>
    <p>
      <span>Release data:</span>
      {data.release_date} <br />
      <span>Budget:</span> ${data.budget} <br />
      <span>Rating:</span>
      {data.vote_average} <br />
      <span>Runtime:</span>
      {data.runtime}mins <br />
    </p>
  </div>
</div>

<style>
  h1 {
    padding: 1rem 0rem 2rem;
  }
  p {
    padding: 1rem 0rem;
  }
  .img-contaier{
    width: 100%;
    border-radius: 1rem;
  }
  img {
    width: 100%;
    border-radius: 1rem;
  }
  .movie-details {
    margin: 2rem 20%;
  }
  span{
    font-weight: bold;
  }
</style>