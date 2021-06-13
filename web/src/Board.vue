<script>
import { chessboard }  from 'vue-chessboard'
import $ from 'jquery'

export default {
    name: 'board',
    extends: chessboard,
    methods: {
        drawHighlights() {
            $('.cg-board').css( "border", "13px solid red" ); 
            // let brush = {'color': 'red', 'opacity': 50};
            // let highjkklights = [{'orig': 'e2', 'brush': brush}];
            let highlights = [{'orig': 'e2', 'dest': 'e3', 'brush': 'blue'}];
            this.board.setShapes(highlights);
            console.log(this.board.state);
        },
        userPlay() {
            return (orig, dest) => {
                if (this.isPromotion(orig, dest)) {
                    this.promoteTo = this.onPromotion()
                }
                console.log(orig);
                this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
                this.board.set({
                    fen: this.game.fen()
                })
                this.calculatePromotions()
                this.aiNextMove()
            };
        },
        aiNextMove() {
            let moves = this.game.moves({verbose: true})
            let randomMove = moves[Math.floor(Math.random() * moves.length)]
            this.game.move(randomMove)

            this.board.set({
                fen: this.game.fen(),
                turnColor: this.toColor(),
                movable: {
                    color: this.toColor(),
                    dests: this.possibleMoves(),
                    events: { after: this.userPlay()},
                }
            });
        },
    },
    mounted() {
        this.board.set({
        movable: { events: { after: this.userPlay()} },
        })
    }
}
  </script>