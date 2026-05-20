const towersDiv = [
    document.getElementById("tower0"),
    document.getElementById("tower1"),
    document.getElementById("tower2")
];

const moveCounter = document.getElementById("moveCounter");
const minMoves = document.getElementById("minMoves");
const progressBar = document.getElementById("progressBar");
const movesList = document.getElementById("movesList");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const diskCountSelect = document.getElementById("diskCount");
const speedControl = document.getElementById("speedControl");

let towers = [[], [], []];
let moves = [];
let moveIndex = 0;
let moveCount = 0;
let isPaused = false;
let animationTimeout;

function initGame(n){

    towers = [[], [], []];

    towersDiv.forEach(t => t.innerHTML = "");

    for(let i=n; i>=1; i--){

        towers[0].push(i);
    }

    render();

    moveCounter.textContent = 0;

    moveCount = 0;

    moves = [];

    moveIndex = 0;

    movesList.innerHTML = "";

    progressBar.style.width = "0%";

    minMoves.textContent = Math.pow(2,n)-1;
}

function render(){

    towersDiv.forEach(t => t.innerHTML = "");

    towers.forEach((tower,index)=>{

        tower.forEach(size=>{

            const disk = document.createElement("div");

            disk.classList.add("disk");

            disk.style.width = `${size*35+40}px`;

            disk.style.background =
            `linear-gradient(90deg,
            hsl(${size*40},70%,50%),
            hsl(${size*40+40},70%,60%))`;

            towersDiv[index].appendChild(disk);
        });
    });
}

function hanoi(n,from,aux,to){

    if(n===1){

        moves.push([from,to,n]);

        return;
    }

    hanoi(n-1,from,to,aux);

    moves.push([from,to,n]);

    hanoi(n-1,aux,from,to);
}

function executeMove(){

    if(isPaused) return;

    if(moveIndex >= moves.length) return;

    const [from,to,disk] = moves[moveIndex];

    const removed = towers[from].pop();

    towers[to].push(removed);

    render();

    moveCount++;

    moveCounter.textContent = moveCount;

    const percent = (moveCount/moves.length)*100;

    progressBar.style.width = percent + "%";

    const div = document.createElement("div");

    div.classList.add("move-item");

    div.textContent =
    `Déplacement disque ${disk} : ${
        String.fromCharCode(65+from)
    } → ${
        String.fromCharCode(65+to)
    }`;

    movesList.prepend(div);

    moveIndex++;

    const speed = speedControl.value;

    animationTimeout =
    setTimeout(executeMove,speed);
}

startBtn.addEventListener("click",()=>{

    clearTimeout(animationTimeout);

    const n =
    parseInt(diskCountSelect.value);

    initGame(n);

    hanoi(n,0,1,2);

    isPaused = false;

    executeMove();
});

pauseBtn.addEventListener("click",()=>{

    isPaused = !isPaused;

    pauseBtn.textContent =
    isPaused ? "▶ Reprendre" : "⏸ Pause";

    if(!isPaused){

        executeMove();
    }
});

resetBtn.addEventListener("click",()=>{

    clearTimeout(animationTimeout);

    const n =
    parseInt(diskCountSelect.value);

    initGame(n);
});

initGame(3);