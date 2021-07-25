<script>
    import UserCard from "./Components/UserProfile.svelte";

    const baseURL = new URL("https://hyapi.tech/api/");
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("name") || "de_grote";
    let player = fetchPlayer(username);

    async function fetchPlayer(username) {
        const res = await fetch(`${baseURL}player?name=${username}&key=temp-frontend&options=friends+guild`);
        if (!res.ok) {
            const json = await res.json();
            throw new Error(json.error);
        }
        const json = await res.json();
        player = json;
        return json;
    }

    function getUser(e) {
        console.log(window.location);
        window.location = window.location.origin + `?name=${handleForm(e)}`;
    }

    function handleForm(e) {
        const formDate = new FormData(e.target);
        const data = {};
        for (let field of formDate) {
            const [key, value] = field;
            data[key] = value;
        }
        return data.username;
    }
</script>

<svelte:head>
    <title>HyAPI</title>
    <link rel="icon" type="image/png" href="../Assets/Logo.png" />
    <link rel="stylesheet" href="../Assets/stylesheet.css" />
</svelte:head>

<main>
    {#await player}
        <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" alt="Loading" />
        <h1>Fetching player data...</h1>
    {:then player}
        <form on:submit|preventDefault={getUser}>
            <input id="username" name="username" value="" placeholder="Username" required />
        </form>

        <UserCard {player} />
    {:catch error}
        <form on:submit|preventDefault={getUser}>
            <input id="username" name="username" value="" placeholder="Username" required />
        </form>

        <h1>Something went wrong :(</h1>
        <p>{error}</p>
    {/await}
</main>

<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    :root {
        background: #aaaaaa;
    }
    h1 {
        display: inline;
    }
    img {
        height: 32px;
        width: auto;
    }

    form {
        display: inline;
    }

    input {
        padding: 0px 5px;
        margin-bottom: 10px;

        height: 50px;
        width: 100%;

        font-size: 150%;
        border: 1px solid white;
    }
</style>
