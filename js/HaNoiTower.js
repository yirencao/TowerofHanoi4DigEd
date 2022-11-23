game_W = 0, game_H = 0;
N = 3;
A = [];
B = [];
x = [, 0, 0, 0];
index = 0;
count = 1;
auto = false;

// auto_level3 = false;
// auto_level4 = false;


Round = 0;
win = messageWin = false;
cl = ["#ff6db6","#ffb6db",
"#490092","#006ddb","#b66dff","#6db6ff","#b6dbff",
"#920000","#924900","#db6d00","#ffff6d"];//"#004949", "#24ff24"
Xstart = Xend = 0;
touchCheck = false;
speedAuto = 1;

var auto_im = new Image();
auto_im.src = "images/auto.png";
winLevel = false;
var start = timeAtCurrentLevel = Date.now();
showAutoAlert = true;

nextLevelButton = false;

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
        window.alert("Welcome to the world of Tower of Hanoi!:D\nRemember the rules you saw on moodle? Now it's time to apply them!\nDrag disk one by one. All you need to do is to put all of them to the very right peg. Have fun!");
        window.alert("Oh, almost forgot, there will be a purple button on the right upper corner which allows you to restart the current level. Good luck!:)");
    }

    init() {
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");
        // document.body.appendChild(this.canvas);
        // this.document.body.style.backgroundImage = "images/background1.jpg";

        A[1] = [];
        A[2] = [];
        A[3] = [];
        for (let i = 0; i < N; i++)
            A[1][i] = N - i;

        this.solve(1, 3, N);

        A[1] = [];
        A[2] = [];
        A[3] = [];
        for (let i = 0; i < N; i++)
            A[1][i] = N - i;

        this.rec = [];
        this.render();
        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            if (auto) {
                speedAuto++;
                return;
            }
            touchCheck = true;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (x <  1.5 * this.getWidth() && y < this.getWidth())
                this.Auto();
            if (x > game_W - 2 * this.getWidth()  && y < this.getWidth() &&winLevel) {
                // go to the next level
                timeAtCurrentLevel = Date.now();
                this.newN(++N);
                winLevel = false;
                console.log("progress");
            }
            else if (x > game_W - 2 * this.getWidth()  && y < this.getWidth()) {
                // restart the game
                this.newN(N);
                console.log("restart");
            }
            
            Xstart = this.getCol(x);
            console.log("mouse");
        })

        document.addEventListener("mousemove", evt => {
            if (auto)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            if (touchCheck && A[Xstart].length > 0) {
                this.rec[A[Xstart][A[Xstart].length - 1]].y = y;
                this.rec[A[Xstart][A[Xstart].length - 1]].x = x;
            }
        })

        document.addEventListener("mouseup", evt => {
            touchCheck = false;
            if (auto)
                return;
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            Xend = this.getCol(x);
            this.move(Xstart, Xend);
        })
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            if (auto)
                return;
            var x = evt.touches[0].pageX - (document.documentElement.clientWidth - game_W) / 2;
            var y = evt.touches[0].pageY;
            Xend = this.getCol(x);
            if (touchCheck && A[Xstart].length > 0) {
                this.rec[A[Xstart][A[Xstart].length - 1]].y = y;
                this.rec[A[Xstart][A[Xstart].length - 1]].x = x;
            }
        })

        document.addEventListener("touchstart", evt => {
            if (auto) {
                speedAuto ++;
                return;
            }
            touchCheck = true;
            var x = evt.touches[0].pageX - (document.documentElement.clientWidth - game_W) / 2;
            var y = evt.touches[0].pageY;
            if (x <  1.5 * this.getWidth() && y < this.getWidth())
                this.Auto();
            Xstart = Xend = this.getCol(x);
        })

        document.addEventListener("touchend", evt => {   
            if (auto)
                return;
            this.move(Xstart, Xend);
            touchCheck = false;
        })

        this.context.restore();
    }

    move(start, end) {
        if (A[start].length <= 0)
            return;
        if (A[start][A[start].length - 1] > A[end][A[end].length - 1] || start == end) {
            this.rec[A[start][A[start].length - 1]].y = game_H - this.getWidth() / 2 - (A[start].length) * this.getWidth();
            this.rec[A[start][A[start].length - 1]].x = x[start];
            return;
        }
            
        this.rec[A[start][A[start].length - 1]].y = game_H - this.getWidth() / 2 - (A[end].length + 1) * this.getWidth();
        this.rec[A[start][A[start].length - 1]].x = x[end];
        A[end][A[end].length] = A[start][A[start].length - 1];
            A[start] = A[start].slice(0, A[start].length - 1);
        Round++;
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30 / speedAuto);
    }

    update() {
        if (auto && count % 30 == 0) {
            if (index < B.length)
                this.move(B[index].s, B[index].e);
            index++;
        }
        count++;
        if (messageWin && win && count++ > 0) {
            let evalute = (Round == B.length) ? "Congratulations!\nNow you can click the purple icon on upper right corner to the next LEVEL! :D" : (Round / B.length < 1.6) ? "That's super good! You used a reasonable amount of steps. But I bet you can do even better! Try again!" : "Sadly you're using too many steps, you definitely can do better than this! Try again!";
            window.alert("Puzzle Solved!\n" + "Number of Disks = " + N + "\nSteps Used: " + Round + "\nComments: " + evalute);
            win = auto = false;
            speedAuto = 1;
            if (Round == B.length)
                winLevel = true;

            
            this.newN(N);
            
        }
            
        if (A[1].length + A[2].length == 0 && !messageWin) {
            win = messageWin = true;
            count = -10 * speedAuto;
        }
        this.render();
    }

    render() {
        if (game_W != document.documentElement.clientWidth || game_H != document.documentElement.clientHeight) {
            this.canvas.height = document.documentElement.clientHeight;
            this.canvas.width = document.documentElement.clientWidth;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            this.newN(N);
            game_W++;
            x[2] = game_W / 2;
            x[1] = game_W / 2 - game_W / 3;
            x[3] = game_W / 2 + game_W / 3;
            this.rec = [];
            for (let i = 0; i < N; i++)
                this.rec[N - i] = new rectangle(this, x[1], game_H - this.getWidth() / 2 - this.getWidth() * (i + 1), game_W / 3 - i * ((game_W / 3 - 1.5 * this.getWidth()) / (N - 1)), cl[i]);
        }
    }

    draw() {
        this.clearScreen();
        for (let i = 1; i <= N; i++)
            this.rec[i].draw();
        this.drawIcon();
    }

    drawIcon() {
        this.context.font = this.getWidth() / 2 + 'px Arial Black';
        // upper right button color
        this.context.fillStyle = "#5D3A9B";
        this.context.fillRect(game_W  - 1.7 * this.getWidth(), 0, 1.7 * this.getWidth(), this.getWidth());
        // count text color
        this.context.fillStyle = "#ba2323";
        this.context.fillText("Count: " + Round, game_W / 2 - this.getWidth(), this.getWidth() / 1.5);

        this.context.fillStyle = "#E66100";
        if (winLevel) {
            this.context.fillText("next", game_W  - 1.5 * this.getWidth(), this.getWidth() / 1.5);
            // this.context.fillText("N = " + N, game_W  - 1.5 * this.getWidth(), this.getWidth() / 1.5);
        }
        else{
        this.context.fillText("reset", game_W  - 1.5 * this.getWidth(), this.getWidth() / 1.5);}

        

        // // upper right button text color
        // this.context.fillStyle = "#E66100";
        // this.context.fillText("N = " + N, game_W  - 1.5 * this.getWidth(), this.getWidth() / 1.5);
        
        //  3min = 180s
        if ((Date.now() - timeAtCurrentLevel)/1000 >= 180) {
            if (N == 3 || N == 4) {
                // draw auto
                this.context.drawImage(auto_im, 0, 0, this.getWidth() * 1.5, this.getWidth());
            } 
        }


        if ((Date.now() - start)/1000 >= 360) 
        {   
            if (showAutoAlert) {
                window.alert("Hey are you getting stuck? On the upper left side, the wonderful AUTO button will always be available now!\nOhhh how brilliant it is! You might also discover the hidden effect of sped up animation!:D");
                showAutoAlert = false;
            }
            // draw auto
            this.context.drawImage(auto_im, 0, 0, this.getWidth() * 1.5, this.getWidth());
        }

        if ((Date.now() - start)/1000 >= 600) 
        {   
            
            window.alert("THANK YOU FOR PLAYING THE GAME! Now please go back to your moodle course and continue.");
            window.close(); 
            
        }
    }

    

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        // background color
        this.context.fillStyle = "#009292";
        // this.context.drawImage(auto_im, 0, 0, this.getWidth() * 1.5, this.getWidth());

        this.context.fillRect(0 , 0, game_W, game_H);
        // peg color
        this.context.fillStyle = '#000000';
        for (let i = 1; i <= 3; i++) {
            this.context.beginPath();
            this.context.arc(x[i], 2 * this.getWidth(), this.getWidth() / 4, 0, 2 * Math.PI, false);
            this.context.fill();
            this.context.closePath()

            this.context.fillRect(x[i] - this.getWidth() / 4 , 2 * this.getWidth(), this.getWidth() / 2, game_H);
        }
        this.context.fillRect(0 , game_H - this.getWidth(), game_W, this.getWidth() * 1.1);
    }
    getWidth() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }

    solve(start, end, N) {
        if (N == 1) {
            B.push({s : start, e: end});
            A[end][A[end].length] = A[start][A[start].length - 1];
            A[start] = A[start].slice(0, A[start].length - 1);
        } else {
            let t = this.otherNumber(start, end);
            this.solve(start, t, N - 1);
            this.solve(start, end, 1);
            this.solve(t, end, N - 1);
        }
    }

    otherNumber(a, b) {
        for (let i = 1; i <= 3; i++)
            if (a != i && b != i)
            return i;
        return -1;
    }

    getCol(x) {
        if (x < game_W / 3)
            return 1;
        if (x < 2 * game_W / 3)
            return 2;
        return 3;
    }

    Auto() {
        messageWin = false;
        A[1] = [];
        A[2] = [];
        A[3] = [];
        for (let i = 0; i < N; i++)
            A[1][i] = N - i;
        count = 1;
        auto = true;
        Round = 0;
        game_W--;
        index = 0;
    }

    newN(n) {
        messageWin = false;
        N = n;
        if (N >= 10)
            N = 3;
        A[1] = [];
        A[2] = [];
        A[3] = [];
        for (let i = 0; i < N; i++)
            A[1][i] = N - i;
        B = [];
        index = Round = count = 0;
        this.solve(1, 3, N);
        A[1] = [];
        A[2] = [];
        A[3] = [];
        for (let i = 0; i < N; i++)
            A[1][i] = N - i;
        win = false;
        game_W--;
    }
}

var g = new game();