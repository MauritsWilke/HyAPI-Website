<script>
    export let player;
    import colours from "./json/minecraftColours.json";
    import Rank from "./User Components/rank.svelte";

    $: cssVars = Object.entries(colours)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");

    const data = cleanData(player);

    function cleanData(player) {
        const dontDisplayThese = ["displayName", "online"];
        const clearOfObjects = Object.entries(player).filter((u) => typeof u[1] != "object");
        const clearOfValues = clearOfObjects.filter((u) => !dontDisplayThese.includes(u[0]));
        return clearOfValues;
    }

    function capitalAndSpace(string) {
        const splitted = string.split(/(?=[A-Z])/).join(" ");
        const lowercase = splitted.toLowerCase();
        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    }

    function capitalFirst(string) {
        if (typeof string != "string") return string;
        const lowercase = string.toLowerCase();
        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    }
</script>

<Rank rank={player.rank} name={player.displayName} class="top" />
<p class="top" style="color:{player.guild.tag.hex}">{player?.guild?.tag?.text ? `[${player.guild.tag.text}]` : ""}</p>
&nbsp
<p class="top">{player.online ? "🟢" : "🔴"}</p>

{#each data as value}
    <p><b>{capitalAndSpace(value[0])}:</b> {value[0] != "displayName" ? capitalFirst(value[1]) : value[1]}</p>
{/each}

<style>
    P {
        margin: 0;
        color: var(--gray);
    }
    .top {
        display: inline;
    }
</style>
