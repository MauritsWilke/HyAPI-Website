<script>
    export let player;

    function capitalFirst(string) {
        if (typeof string != "string") return string;
        const lowercase = string.toLowerCase();
        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
    }

    function getPlusColour(player) {
        if (player?.rank?.type == "YOUTUBER") return "#FF5555";
        if (player?.rank?.plus?.hex) return player.rank.plus.hex;
        if (player?.rank?.type == "VIP+") return "#FFAA00";
        return "#AAAAAA";
    }

    let styles = {
        rankColour: player?.rank?.rankColour,
        plusColour: getPlusColour(player),
        guildColour: player?.guild?.tag?.hex,
        nameFontSize: player?.guild?.tag ? "24px" : "36px",
        nameMarginTop: player?.guild?.tag ? "0px" : "20px",
    };

    $: cssVars = Object.entries(styles)
        .map(([key, value]) => `--${key}:${value}`)
        .join(";");
</script>

<div class="wrapper">
    <div class="card">
        <div class="top">
            <img src="https://minotar.net/helm/{player.displayName}.png" class="head" alt="head" onerror="this.src='../Assets/steve.png'" />
            <p class="username" style={cssVars}>{player.displayName}</p>
            <p class="guild" style={cssVars}>{player?.guild?.tag?.text ? `[${player.guild.tag.text}]` : ""}</p>
            <!-- <img src="http://s.optifine.net/capes/{player.displayName}.png" alt="cape" onerror="this.src='../Assets/cape.png'" class="cape" /> -->
        </div>

        <hr class="divider {player.displayName == 'I_Like_Cats__' ? 'dev' : 'default'}" style={cssVars} />

        <div class="stats">
            <span>
                <p class="type">Level:</p>
                <p class="number">{player.level}</p>
            </span>
            <span>
                <p class="type">Karma:</p>
                <p class="number karma">{player.karma}</p>
            </span>
            <span>
                <p class="type">Friends:</p>
                <p class="number">{player.friends}</p>
            </span>
            <span>
                <p class="type">Last Game:</p>
                <p class="number">{capitalFirst(player?.lastGame?.replace(/_/, " ")) ?? "Hidden"}</p>
            </span>
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
            .cape {
                position: absolute;
                width: 30px;
                height: 60px;
                left: 345px;
                top: 0px;

                border-radius: 5px;
            }

            .head {
                position: absolute;
                width: 60px;
                height: 60px;
                left: 0px;
                top: 0px;

                border-radius: 10px;
            }

            .username {
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

            .guild {
                position: absolute;
                width: 327px;
                height: 22px;
                left: 69px;
                top: 30px;

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
        }

        .stats {
            span {
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

                .type {
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

                .karma {
                    color: #ff55ff;
                }

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
            margin: 2px 5px;
        }

        .divider {
            position: static;
            width: 390px;
            height: 0px;
            left: 5px;
            top: 80px;
            box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
        }

        .dev {
            border-top: 3px solid transparent;
            border-image: linear-gradient(to right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
            border-image-slice: 1;
        }

        .default {
            border: 2px solid var(--plusColour);
        }
    }
</style>
