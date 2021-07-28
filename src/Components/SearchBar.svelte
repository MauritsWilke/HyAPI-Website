<script>
    const recentSearches = JSON.parse(window.localStorage.getItem("recentSearches")) ?? [];

    function storeSearch(e) {
        const searchQuery = handleForm(e, "username");
        getUser(searchQuery);
    }

    function addToStorage(searchQuery) {
        let oldQueries = JSON.parse(window.localStorage.getItem("recentSearches")) ?? [];
        if (oldQueries === []) window.localStorage.setItem("recentSearches", JSON.stringify([]));

        console.log(oldQueries[oldQueries.length - 1] !== searchQuery);

        if (!oldQueries.includes(searchQuery)) {
            if (oldQueries.length >= 5) oldQueries.pop();
            oldQueries.unshift(searchQuery);
        } else {
            oldQueries = oldQueries.filter((i) => i !== searchQuery);
            oldQueries.unshift(searchQuery);
        }

        window.localStorage.setItem("recentSearches", JSON.stringify(oldQueries));
    }

    function handleForm(e, returnQuery) {
        const formDate = new FormData(e.target);
        const data = {};
        for (let field of formDate) {
            const [key, value] = field;
            data[key] = value;
        }
        return returnQuery ? data[returnQuery] : data;
    }

    function getUser(e) {
        addToStorage(e);
        window.location = window.location.origin + `?name=${e}`;
    }
</script>

<div class="wrapper">
    <div class="searchbar">
        <form on:submit|preventDefault={storeSearch} autocomplete="off">
            <input id="username" name="username" value="" placeholder="Username" required />
        </form>
        <div class="recentSearches">
            {#each recentSearches as search}
                <a href="https://hyapi.tech?name={search}">
                    {search}
                </a>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    * {
        margin: 0px;
        padding: 0px;

        transition: all 0.2s;
    }

    .searchbar {
        display: inline;
        //overflow: hidden;

        input {
            padding: 0px 0px;
            margin-bottom: 0px;

            height: 50px;
            width: 100%;

            font-size: 150%;
        }

        :focus-within ~ .recentSearches {
            display: block;
            position: absolute;
            z-index: 10;
        }

        :focus {
            border-style: solid;
            border-color: white white black white;
            border-width: 1px;
        }
    }

    .recentSearches {
        display: none;

        width: 100%;
        border-radius: 0px 0px 10px 10px;
        overflow: hidden;

        a {
            padding: 0.5em;
            display: block;
            color: black;
            background-color: #f5f5f5;

            font-family: Minecraftia;
            font-style: normal;
            font-weight: normal;

            text-decoration: none;
        }

        :hover {
            background-color: rgb(229, 228, 226);
        }
    }

    .recentSearches:hover {
        display: block;
        position: absolute;
        z-index: 10;
    }
</style>
