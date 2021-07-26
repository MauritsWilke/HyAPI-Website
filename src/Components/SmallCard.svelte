<script>
    export let contents;

    contents.gamemode ??= "Undefined";
    contents.submode ??= "";
    contents.image ??= "";
    contents.stats ??= [
        { text: "Null", number: 0 },
        { text: "Null", number: 0 },
        { text: "Null", number: 0 },
        { text: "Null", number: 0 },
    ];

    let styles = {
        nameFontSize: contents?.submode ? "24px" : "36px",
        nameMarginTop: contents?.submode ? "-5px" : "5px",
    };

    $: cssVars = Object.entries(styles)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");
</script>

<div id="wrapper">
    <div class="card">
        <div class="top">
            <img src={contents.image} class="gamemodeImage" alt="img" onerror="this.src='../Assets/steve.png'" />
            <p class="gamemode" style={cssVars}>{contents.gamemode}</p>
            <p class="submode" style={cssVars}>{contents.submode}</p>
        </div>

        <hr class="divider" />

        <div class="stats">
            {#each contents.stats as stat, i}
                <span>
                    <p class="text">{stat.text}:</p>
                    <p class="number">{stat.number.toLocaleString()}</p>
                </span>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        display: inline-block;
        margin: 0px;
        padding: 0px;
    }

    .card {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;

        width: 400px;
        height: 235px;
        left: 25px;
        top: 25px;

        background: url("../Assets/BackgroundUnblurred.jpg");
        border-radius: 10px;

        .top {
            .gamemodeImage {
                position: absolute;
                width: 60px;
                height: 60px;
                left: 0px;
                top: 0px;

                border-radius: 10px;
            }

            .gamemode {
                position: absolute;
                width: 327px;
                height: 22px;
                left: 69px;
                top: var(--nameMarginTop);

                font-family: "Minecraftia";
                font-style: normal;
                font-weight: normal;
                font-size: var(--nameFontSize);
                line-height: 0px;

                color: var(--rankColour);
            }

            .submode {
                position: absolute;
                width: 327px;
                height: 22px;
                left: 69px;
                top: 24px;

                font-family: Minecraftia;
                font-style: normal;
                font-weight: normal;
                font-size: 24px;
                line-height: 0px;

                color: var(--guildColour);
            }

            position: static;
            width: 380px;
            height: 60px;
            left: 10px;
            top: 10px;

            filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.25));

            flex: none;
            order: 0;
            flex-grow: 0;
            margin: 10px 0px;

            color: #fafafa;
        }

        .divider {
            position: static;
            width: 390px;
            height: 0px;
            left: 5px;
            top: 80px;

            border: 2px solid #fafafa;

            box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
        }

        .stats {
            span {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 0px;

                position: static;
                width: 440px;
                height: 30px;
                left: 0px;
                top: 105px;

                flex: none;
                order: 3;
                flex-grow: 0;
                margin: 2px 0px;
            }

            .text {
                position: static;
                width: auto;
                height: 33px;
                left: 0px;
                top: 0px;

                font-family: Minecraftia;
                font-style: normal;
                font-weight: normal;
                font-size: 24px;
                line-height: 33px;

                color: #fafafa;

                flex: none;
                order: 0;
                flex-grow: 0;
                margin: 0px 0px;
            }

            .number {
                position: static;
                width: 280px;
                height: 30px;
                left: 160px;
                top: 0px;

                font-family: Minecraftia;
                font-style: normal;
                font-weight: normal;
                font-size: 24px;
                line-height: 33px;

                color: #aaaaaa;

                flex: none;
                order: 1;
                flex-grow: 0;
                margin: 0px 10px;
            }

            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0px;

            position: static;
            width: 375px;
            height: 135px;
            left: 10px;
            top: 90px;

            filter: drop-shadow(2px 2px 0px rgba(0, 0, 0, 0.25));

            flex: none;
            order: 2;
            flex-grow: 0;
            margin: -2px 5px;
        }
    }
</style>
