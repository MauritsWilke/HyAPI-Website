<script>
    import User from "./user.svelte";

    const baseURL = new URL("https://hyapi.tech/");
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("name") || "de_grote";
    const player = fetchPlayer(username);
    async function fetchPlayer(username) {
        const res = await fetch(`${baseURL}api/player?name=${username}&key=temp-frontend&options=friends+guild`);
        if (!res.ok) {
            const json = await res.json();
            throw new Error(json.error);
        }
        const json = await res.json();
        return json;
    }
</script>

<svelte:head>
    <title>HyAPI</title>
</svelte:head>

<main>
    {#await player}
        <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" alt="Loading" />
        <h1>Fetching player data...</h1>
    {:then player}
        <User {player} />
        <p>No text input yet, add "?name=&lt;ign&gt;" to the url for checking your gorgeous stats with this amazing front-end design!</p>
    {:catch error}
        <h1>404: Something went wrong :(</h1>
        <p>{error}</p>
    {/await}
</main>

<style>
    :root {
        background: #555555;
    }
    h1 {
        display: inline;
    }
    img {
        height: 32px;
        width: auto;
    }
</style>
