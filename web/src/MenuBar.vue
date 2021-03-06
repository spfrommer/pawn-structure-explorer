<template>
<div>
    <span>Pawn Structure Explorer</span>
    <button @click="tourClicked">
        TOUR
    </button>
    <button @click="aboutClicked">
        ABOUT
    </button>
    <script type="application/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
    <script type="application/javascript" defer>
        window.DonorBox = { widgetLinkClassName: 'custom-dbox-popup' }
    </script>
    <a class="custom-dbox-popup" href="https://donorbox.org/pawn-structure-explorer-donations">DONATE</a>
    <v-dialog />
</div>
</template>

<script>
export default {
    methods: {
        tourClicked() { this.$emit('tour'); },
        aboutClicked() {
            this.$modal.show('dialog', {
                text:
`<h3> Pawn Structure Explorer </h3>
<p><a href="https://github.com/spfrommer/pawn-structure-explorer" target="_blank">GitHub</a></p>
<p><a href="https://sam.pfrommer.us/" target="_blank">Samuel Pfrommer</a></p>

<h4> Description </h4>
<p> This is a small curiosity project that I made to help improve
my understanding of pawn structures. I'm not sure I succeeded, but feel free to see if you find it interesting.
This was also my first serious web development attempt.
If you would like to report any bugs, changes, or features suggestions, please submit a
<a href="https://github.com/spfrommer/pawn-structure-explorer/issues/new" target="_blank">GitHub issue</a>.</p>

<h4> Details </h4>
<p> For the piece highlights, the games database is first filtered for all positions which match the
current pawn structure. The highlight transparency for a particular square then corresponds to the likelihood of the selected piece being found there; if 
there is no highlight, the piece was never found at that location in the structure. The hue ranges from red to blue to green,
indicating the average points result of games with that pawn structure and piece location.
So roughly speaking, a green square is "good" for that piece and a red square is "bad." </p>

<h4> Acknowledgements </h4>
<ul>
<li> The <a href="https://lichess.org/" target="_blank">Lichess</a> server for their chessboard
implementation, game database, and fantastic website. The UI for this website was heavily
inspired by Lichess's board editor. </li>
<li> The <a href="https://database.nikonoel.fr/" target="_blank">Lichess Elite Database</a>
for their compilation of high-elo games from Lichess. </li>
</ul>
`,
            });
        },
    },
};
</script>

<style lang="scss">
#MenuBar {
    font-size: 18px;
}
#MenuBar .vue-dialog {
    background-color: $primary;
    box-shadow: none;
    width: 600px !important; // Passing in props didn't work
    transform: translate(-100px, 0px);
}
#MenuBar .vue-dialog-buttons {
    border-top: none;
}
#MenuBar .vue-dialog p {
    margin: 3px;
    padding: 3px;
}
#MenuBar .vue-dialog h3 {
    margin: 3px;
    padding: 3px;
}
#MenuBar .vue-dialog h4 {
    margin: 3px;
    padding: 3px;
}
#MenuBar .vue-dialog a {
    color: $accent1;
    text-decoration: none;
}
#MenuBar .vue-dialog ul {
    margin-top: 3px;
    padding-top: 3px;
    margin-left: 0px;
    padding-left: 15px;
}
#MenuBar .vue-dialog li {
    padding-bottom: 7px;
}
#MenuBar span {
    padding-right: 13px;
    // border-right: 1px solid $secondary;
}
#MenuBar > button {
    background-color: rgba(0, 0, 0, 0);
    text-align: right;
    font-size: 14px;
    color: $text-tertiary;
    border: 0px;
    line-height: 22px;
    transition: ease 0.3s;

    margin-left: 6px;
    padding: 3px 6px 3px 6px;
}
#MenuBar > button:hover {
    background-color: scale-color($primary, $lightness: 5%);
}
#MenuBar > a {
    background-color: rgba(0, 0, 0, 0);
    text-align: right;
    font-size: 14px;
    color: $text-tertiary;
    border: 0px;
    line-height: 22px;
    transition: ease 0.3s;

    margin-left: 6px;
    padding: 5px 6px 5px 6px;
    text-decoration: none;
}
#MenuBar > a:hover {
    background-color: scale-color($primary, $lightness: 5%);
}
</style>
