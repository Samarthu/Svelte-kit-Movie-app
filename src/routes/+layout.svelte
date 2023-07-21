<script>
	import { user } from '../stores/stores.js';
    import "../app.css"
    import Nav from "./nav.svelte"
    import Footer from "./footer.svelte";
    import { SvelteToast } from '@zerodevx/svelte-toast';
    import { onMount } from "svelte";

    onMount(()=>{

    })

</script>


<Nav/>
<slot/>
<!-- <Footer/> -->
<SvelteToast/>