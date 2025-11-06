function goToMain() {
    window.location.href = "main.html";
}

const btn = document.getElementById("startBtn");

btn.addEventListener("mouseenter", () => {
    btn.classList.remove("animate");
    void btn.offsetWidth; // <-- RESTART TRICK
    btn.classList.add("animate");
});

btn.addEventListener("mouseleave", () => {
    btn.classList.remove("animate");
});

function selectAlgo(algo) {
    if (algo === "job") {
        window.location.href = "job.html";
    }
    else if (algo === "fcfs") {
        window.location.href = "fcfs.html";
    }
    else if (algo === "priority") {
        window.location.href = "priority.html";
    }
    else if (algo === "rr") {
        window.location.href = "rr.html";
    }
}
// FCFS logic
function createInputs() {
    let n = document.getElementById("numProc").value;
    let box = document.getElementById("inputs");
    box.innerHTML = "";

    for (let i = 0; i < n; i++) {
        box.innerHTML += `
            <h4>Process ${i+1}</h4>
            Arrival Time: <input type="number" id="at${i}" min="0"><br>
            Burst Time: <input type="number" id="bt${i}" min="1"><br><br>
        `;
    }

    document.getElementById("calcBtn").style.display = "block";
}

function calculateFCFS() {
    let n = document.getElementById("numProc").value;
    let processes = [];

    for (let i = 0; i < n; i++) {
        let at = parseInt(document.getElementById("at"+i).value);
        let bt = parseInt(document.getElementById("bt"+i).value);
        processes.push({pid:i+1, at:at, bt:bt});
    }

    // Sort by arrival time
    processes.sort((a,b)=>a.at - b.at);

    let time=0, result=[];
    processes.forEach(p=>{
        let start = Math.max(time, p.at);
        let finish = start + p.bt;
        let tat = finish - p.at;
        let wt = tat - p.bt;

        result.push({pid:p.pid, start, finish, wt, tat});
        time = finish;
    });

    let out = "<table><tr><th>PID</th><th>Start</th><th>Finish</th><th>Waiting</th><th>Turnaround</th></tr>";
    result.forEach(r=>{
        out += `<tr><td>P${r.pid}</td><td>${r.start}</td><td>${r.finish}</td><td>${r.wt}</td><td>${r.tat}</td></tr>`;
    });
    out += "</table>";

    document.getElementById("output").innerHTML = out;
    drawGantt(result);
}

// Gantt chart for fcfs
function drawGantt(result) {
    let canvas = document.getElementById("ganttChart");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let x=10;
    result.forEach((p,i)=>{
        let width = (p.finish - p.start) * 30;
        ctx.fillStyle = `hsl(${i*60},70%,70%)`; // soft colors
        ctx.fillRect(x,40,width,40);
        ctx.strokeRect(x,40,width,40);
        ctx.fillStyle = "#000";
        ctx.fillText("P"+p.pid, x + width/2 - 5, 65);
        x += width;
    });
}

function createJobInputs() {
    let n = document.getElementById("numJob").value;
    let area = document.getElementById("jobInputs");
    area.innerHTML = "";

    for (let i = 0; i < n; i++) {
        area.innerHTML += `
            <h4>Job ${i+1}</h4>
            Profit: <input type="number" id="p${i}" min="1"><br>
            Deadline: <input type="number" id="d${i}" min="1"><br><br>
        `;
    }
    document.getElementById("jobCalcBtn").style.display = "block";
}

function calculateJobScheduling() {
    let n = document.getElementById("numJob").value;
    let jobs = [];

    for (let i = 0; i < n; i++) {
        let profit = parseInt(document.getElementById("p"+i).value);
        let deadline = parseInt(document.getElementById("d"+i).value);
        jobs.push({id:i+1, profit, deadline});
    }

    // Sort by profit descending
    jobs.sort((a,b)=> b.profit - a.profit);

    let maxDeadline = Math.max(...jobs.map(j=>j.deadline));
    let slot = Array(maxDeadline).fill(null);
    let totalProfit = 0;

    jobs.forEach(j=>{
        for (let i = j.deadline-1; i >= 0; i--) {
            if (!slot[i]) {
                slot[i] = j;
                totalProfit += j.profit;
                break;
            }
        }
    });

    let out = `<h3>Total Profit = ${totalProfit}</h3><table><tr><th>Time Slot</th><th>Job</th></tr>`;
    slot.forEach((s,i)=>{
        out += `<tr><td>${i+1}</td><td>${s? "J"+s.id:"Empty"}</td></tr>`;
    });
    out += "</table>";
    document.getElementById("jobOutput").innerHTML = out;
}

function createPriorityInputs() {
    let n = document.getElementById("numPp").value;
    let area = document.getElementById("priorityInputs");
    area.innerHTML = "";

    for (let i = 0; i < n; i++) {
        area.innerHTML += `
            <h4>Process ${i+1}</h4>
            Arrival Time: <input type="number" id="pat${i}" min="0"><br>
            Burst Time: <input type="number" id="pbt${i}" min="1"><br>
            Priority (lower = higher priority): <input type="number" id="pri${i}" min="1"><br><br>
        `;
    }
    document.getElementById("pCalcBtn").style.display = "block";
}

function calculatePriority() {
    let n = document.getElementById("numPp").value;
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            pid:i+1,
            at:parseInt(document.getElementById("pat"+i).value),
            bt:parseInt(document.getElementById("pbt"+i).value),
            pr:parseInt(document.getElementById("pri"+i).value)
        });
    }

    // Sort by Arrival, then Priority
    processes.sort((a,b)=>{
        if (a.at !== b.at) return a.at - b.at;
        return a.pr - b.pr;
    });

    let time = 0, result=[];
    processes.forEach(p=>{
        let start = Math.max(time, p.at);
        let finish = start + p.bt;
        let tat = finish - p.at;
        let wt = tat - p.bt;

        result.push({...p, start, finish, tat, wt});
        time = finish;
    });

    let out = `<table><tr><th>PID</th><th>Pr</th><th>Start</th><th>Finish</th><th>WT</th><th>TAT</th></tr>`;
    result.forEach(r=>{
        out += `<tr><td>P${r.pid}</td><td>${r.pr}</td><td>${r.start}</td><td>${r.finish}</td><td>${r.wt}</td><td>${r.tat}</td></tr>`;
    });
    out += "</table>";

    document.getElementById("pOutput").innerHTML = out;
    drawGantt(result);  // uses same chart function
}

function createRRInputs() {
    let n = document.getElementById("numRR").value;
    let area = document.getElementById("rrInputs");
    area.innerHTML = "";

    for (let i = 0; i < n; i++) {
        area.innerHTML += `
            <h4>Process ${i+1}</h4>
            Arrival Time: <input type="number" id="rra${i}" min="0"><br>
            Burst Time: <input type="number" id="rrb${i}" min="1"><br><br>
        `;
    }
    document.getElementById("rrCalcBtn").style.display = "block";
}

function calculateRR() {
    let n = document.getElementById("numRR").value;
    let quantum = parseInt(document.getElementById("quantum").value);

    let queue = [];
    for (let i = 0; i < n; i++) {
        queue.push({
            pid:i+1,
            at:parseInt(document.getElementById("rra"+i).value),
            bt:parseInt(document.getElementById("rrb"+i).value),
            rt:parseInt(document.getElementById("rrb"+i).value)
        });
    }

    queue.sort((a,b)=>a.at - b.at);

    let gantt = [];

    while(queue.length > 0) {
        let p = queue.shift();

        let execTime = Math.min(p.bt, quantum);
        let start = time;
        let finish = time + execTime;

        gantt.push({ pid: p.pid, start, finish });

        time = finish;
        p.bt -= execTime;

        if(p.bt > 0) queue.push(p);
    }
    drawGantt(gantt);
    result.push({ pid: job.id, start: current, finish: current + job.duration });
    drawGantt(result);


    // Show Gantt
    document.getElementById("rrOutput").innerHTML = "Gantt Chart:";
    drawGantt(result);
}

function drawGantt(processes) {
    let canvas = document.getElementById("ganttChart");
    if (!canvas) return; // safety check
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let x = 10;

    processes.forEach((p,i) => {
        let width = (p.finish - p.start) * 30;
        ctx.fillStyle = `hsl(${i*70}, 70%, 75%)`; // soft pastel colors
        ctx.fillRect(x, 40, width, 35);
        ctx.strokeRect(x, 40, width, 35);

        ctx.fillStyle = "#000";
        ctx.fillText(`P${p.pid}`, x + width/2 - 5, 60);

        x += width;
    });
}
function drawGantt(processes) {
    let canvas = document.getElementById("ganttChart");
    if (!canvas) return; // safety check
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let x = 10;

    processes.forEach((p,i) => {
        let width = (p.finish - p.start) * 30;
        ctx.fillStyle = `hsl(${i*70}, 70%, 75%)`; // soft pastel colors
        ctx.fillRect(x, 40, width, 35);
        ctx.strokeRect(x, 40, width, 35);

        ctx.fillStyle = "#000";
        ctx.fillText(`P${p.pid}`, x + width/2 - 5, 60);

        x += width;
    });
}
drawGantt(result);
