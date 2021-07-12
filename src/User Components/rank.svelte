<script>
    export let rank;
    export let name;

    let styles = {
        rankColour: rank.rankColour,
        plusColour: rank?.plus?.hex,
    };

    $: cssVars = Object.entries(styles)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");
</script>

{#if rank.type != "DEFAULT"}
    <p class="monthly" style={cssVars}>
        [
        <span id="main">{rank.type.replace(/\+/g, "")}</span>
        {#if rank.type == "MVP++"}
            <span id="plus">++</span>
        {:else if rank.type == "VIP+"}
            <span style="color:#FFAA00">+</span>
        {/if}
        ]
    </p>
{/if}
<p class="name" style={cssVars}>{name}</p>

<style lang="scss">
    p {
        display: inline;
    }
    .monthly {
        color: var(--rankColour);
        #plus {
            color: var(--plusColour);
        }
    }
    .name {
        color: var(--rankColour);
    }
</style>
