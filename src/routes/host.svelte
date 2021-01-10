<script>
    import io from "socket.io-client";
    import Button, { Label } from "@smui/button";
    import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
    import ClientTable from "../components/ClientTable.svelte";
    import BuzzerTable from "../components/BuzzerTable.svelte";
    import { client } from "../stores.js";

    let socket = io();

    $: timestamps = [];

    function resetButtonHandler() {
        console.log("HOST >>> reset");
        socket.emit("reset");
    }

    function make_it_glow_bitch(str) {
        var glowy_string_html = "<div>";
        for (var i = 0; i < str.length; i++) {
            glowy_string_html = glowy_string_html.concat(
                "<span class='glow'>" + str.charAt(i) + "</span>"
            );
        }
        glowy_string_html = glowy_string_html.concat("</div>");
        return glowy_string_html;
    }

    socket.on("timestampList", function (serverTimestamps) {
        console.log("HOST <<< timestampList", serverTimestamps);
        timestamps = serverTimestamps;
    });

    let clients = {};

    function registerResponseHandler(registerResponse) {
        console.log("JOIN <<< registerResponse", registerResponse);
        client.set(registerResponse);
    }

    socket.on("registerResponse", function (registerResponse) {
        registerResponseHandler(registerResponse);
    });

    socket.on("sendClients", function (sendClients) {
        console.log("JOIN <<< sendClients", sendClients);
        clients = sendClients;
    });

    function updateClient() {
        console.log("JOIN >>> registerUpdate");
        socket.emit("registerUpdate", $client);
    }

    if ($client === null) {
        console.log("JOIN >>> registerRequest");
        socket.emit("registerRequest");
    } else {
        updateClient();
    }

    /*

    function updateScores() {
        var scores = $("#f_team_scores").val();

        if (scores == "") {
            // This is incredible stupid, but hey, it works :(
            // TODO: This should really go away once we actually have sensible objects
            // backing up this data like sane people
            let initial_scores = new Array(team_count).fill(0);
            $("#f_team_scores").val(initial_scores.join(","));
            scores = $("#f_team_scores").val();
        }

        var scoresArr = scores
            .split(",")
            .map(Function.prototype.call, String.prototype.trim);

        let local_names = Array.from(nameArr);

        team_string = "";
        for (var i = 0; i < team_count; i++) {
            team_string += "<tbody>";
            team_string +=
                "<tr><td rowspan='" +
                ppl_per_team[i] +
                "'>" +
                (i + 1) +
                "</td>";
            for (var j = 0; j < ppl_per_team[i]; j++) {
                var player = local_names.pop();

                if (j == 0) {
                    team_string +=
                        "<td>" +
                        player +
                        "</td><td rowspan='" +
                        ppl_per_team[i] +
                        "'>" +
                        scoresArr[i] +
                        "</td></tr>";
                } else {
                    team_string += "<tr><td>" + player + "</td></tr>";
                }
            }
            team_string += "</tbody>";
        }

        // TODO: This should be a single emit, maybe use JSON
        console.log("HOST>toserver: 'teamstringNames':" + names);
        socket.emit("teamstringNames", [names]);

        console.log("HOST>toserver: 'teamstringTeamCount':" + team_count);
        socket.emit("teamstringTeamCount", [team_count]);

        console.log("HOST>toserver: 'teamstringHost':" + team_string);
        socket.emit("teamstringHost", [team_string]);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    var nameArr = [];
    var names = "";
    var team_count = 0;
    var team_string = "";
    var ppl_per_team = [];

    function shuffleTeams() {
        team_count = $("#f_team_count").val();
        names = $("#f_player_names").val();
        nameArr = names
            .split(",")
            .map(Function.prototype.call, String.prototype.trim);

        var ppl_count = nameArr.length;
        var default_ppl_per_team = Math.round(ppl_count / team_count);
        console.log("HOST>Base ppl_per_team: " + default_ppl_per_team);

        // geklaut von: https://www.geeksforgeeks.org/split-the-number-into-n-parts-such-that-difference-between-the-smallest-and-the-largest-part-is-minimum/
        // geht sich genau aus...
        ppl_per_team = [];
        if (ppl_count % team_count == 0) {
            for (var i = 0; i < team_count; i++) {
                ppl_per_team.push(default_ppl_per_team);
            }
        } else {
            // upto n-(x % n) the values
            // will be x / n
            // after that the values
            // will be x / n + 1
            var zp = team_count - (ppl_count % team_count);
            var pp = Math.floor(ppl_count / team_count);
            for (var i = 0; i < team_count; i++) {
                if (i >= zp) {
                    ppl_per_team.push(pp + 1);
                } else {
                    ppl_per_team.push(pp);
                }
            }
        }

        console.log("HOST>People per team: " + ppl_per_team.toString());

        shuffleArray(nameArr);
        console.log("HOST>Shuffling: " + nameArr);

        updateScores();
    }

    // Register button presses
    $("#new_teams").on("click", shuffleTeams);
    $("#update_teams").on("click", updateScores);
    $("#reset").on("click", resetHandler);

    // Register websocket callbacks
    socket.on("reset", function () {
        console.log("HOST>fromserver: 'reset'");
        clearTimestampList();
    });

    socket.on("reload", function () {
        console.log("HOST>fromserver: 'reload'");
        window.location.reload();
    });

    socket.on("teamstringJoin", function ([teamString]) {
        console.log("HOST>fromserver: 'teamstringJoin': " + teamString);
        $("#teams > tbody").remove();
        $("#teams").append(teamString);
    });

    socket.on("teamstringNamesHost", function ([TEAM_NAMES]) {
        console.log("HOST>fromserver: 'teamstringNamesHost': " + TEAM_NAMES);
        $("#f_player_names").val(TEAM_NAMES);
    });

    socket.on("teamstringTeamCountHost", function ([TEAM_COUNT]) {
        console.log(
            "HOST>fromserver: 'teamstringTeamCountHost': " + TEAM_COUNT
        );
        $("#f_team_count").val(TEAM_COUNT);
    });
    */
</script>

<svelte:head>
    <title>Goennbuzz - Host</title>
</svelte:head>

<h1>Goennbuzz - Host!</h1>
<Button on:click={resetButtonHandler}>
    <Label>RESET</Label>
</Button>
<BuzzerTable {timestamps} />
<ClientTable {clients} />
