function goToMain() {
    window.location.href = "main.html";
}

const btn = document.getElementById("startBtn");

if (btn) {
    btn.addEventListener("mouseenter", () => {
        btn.classList.remove("animate");
        void btn.offsetWidth;
        btn.classList.add("animate");
    });

    btn.addEventListener("mouseleave", () => {
        btn.classList.remove("animate");
    });
}

function selectAlgo(algo) {
    if (algo === "job") window.location.href = "job.html";
    else if (algo === "fcfs") window.location.href = "fcfs.html";
    else if (algo === "priority") window.location.href = "priority.html";
    else if (algo === "rr") window.location.href = "rr.html";
}

/* ------------------------- FCFS ------------------------- */
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
        processes.push({
            pid:i+1,
            at:parseInt(document.getElementById("at"+i).value),
            bt:parseInt(document.getElementById("bt"+i).value)
        });
    }

    processes.sort((a,b)=>a.at - b.at);

    let time = 0;
    let result = [];

    processes.forEach(p=>{
        let start = Math.max(time, p.at);
        let finish = start + p.bt;
        let tat = finish - p.at;
        let wt = tat - p.bt;

        result.push({pid:p.pid, start, finish, wt, tat});
        time = finish;
    });

    let out = "<table><tr><th>PID</th><th>Start</th><th>Finish</th><th>Waiting</th><th>TAT</th></tr>";
    result.forEach(r=>{
        out += `<tr><td>P${r.pid}</td><td>${r.start}</td><td>${r.finish}</td><td>${r.wt}</td><td>${r.tat}</td></tr>`;
    });
    out += "</table>";

    document.getElementById("output").innerHTML = out;
    drawGantt(result);
}

/* ------------------------- Job Scheduling ------------------------- */
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
        jobs.push({
            id:i+1,
            profit:parseInt(document.getElementById("p"+i).value),
            deadline:parseInt(document.getElementById("d"+i).value)
        });
    }

    jobs.sort((a,b)=>b.profit - a.profit);

    let maxDeadline = Math.max(...jobs.map(j=>j.deadline));
    let slot = Array(maxDeadline).fill(null);
    let result = [];

    jobs.forEach(j=>{
        for (let i=j.deadline-1; i>=0; i--) {
            if (!slot[i]) {
                slot[i] = j;
                result.push({pid:j.id, start:i, finish:i+1});
                break;
            }
        }
    });

    let totalProfit = result.reduce((a,b)=>a + jobs.find(x=>x.id===b.pid).profit, 0);

    let out = `<h3>Total Profit = ${totalProfit}</h3><table><tr><th>Time Slot</th><th>Job</th></tr>`;
    slot.forEach((s,i)=>{
        out += `<tr><td>${i+1}</td><td>${s? "J"+s.id:"Empty"}</td></tr>`;
    });
    out += "</table>";

    document.getElementById("jobOutput").innerHTML = out;
    drawGantt(result);
}

/* ------------------------- Priority ------------------------- */
function createPriorityInputs() {
    let n = document.getElementById("numPp").value;
    let area = document.getElementById("priorityInputs");
    area.innerHTML = "";

    for (let i=0; i<n; i++) {
        area.innerHTML += `
            <h4>Process ${i+1}</h4>
            Arrival: <input type="number" id="pat${i}" min="0"><br>
            Burst: <input type="number" id="pbt${i}" min="1"><br>
            Priority: <input type="number" id="pri${i}" min="1"><br><br>
        `;
    }
    document.getElementById("pCalcBtn").style.display = "block";
}

function calculatePriority() {
    let n = document.getElementById("numPp").value;
    let processes = [];

    for (let i=0; i<n; i++) {
        processes.push({
            pid:i+1,
            at:parseInt(document.getElementById("pat"+i).value),
            bt:parseInt(document.getElementById("pbt"+i).value),
            pr:parseInt(document.getElementById("pri"+i).value)
        });
    }

    processes.sort((a,b)=>{
        if (a.at !== b.at) return a.at - b.at;
        return a.pr - b.pr;
    });

    let time=0, result=[];

    processes.forEach(p=>{
        let start = Math.max(time, p.at);
        let finish = start + p.bt;
        result.push({pid:p.pid, start, finish});
        time = finish;
    });

    drawGantt(result);
}

/* ------------------------- Round Robin ------------------------- */
function createRRInputs() {
    let n = document.getElementById("numRR").value;
    let area = document.getElementById("rrInputs");
    area.innerHTML = "";

    for (let i=0; i<n; i++) {
        area.innerHTML += `
            <h4>Process ${i+1}</h4>
            Arrival: <input type="number" id="rra${i}" min="0"><br>
            Burst: <input type="number" id="rrb${i}" min="1"><br><br>
        `;
    }
    document.getElementById("rrCalcBtn").style.display = "block";
}

function calculateRR() {
    let n = document.getElementById("numRR").value;
    let quantum = document.getElementById("quantum").value;
    quantum = parseInt(quantum);

    let ready = [], result=[], time=0;

    for (let i=0; i<n; i++) {
        ready.push({
            pid:i+1,
            bt:parseInt(document.getElementById("rrb"+i).value),
            at:parseInt(document.getElementById("rra"+i).value),
            rt:parseInt(document.getElementById("rrb"+i).value)
        });
    }

    ready.sort((a,b)=>a.at - b.at);

    let queue = [...ready];

    while(queue.length > 0) {
        let p = queue.shift();

        let exec = Math.min(p.rt, quantum);
        let start = time;
        let finish = time + exec;

        result.push({pid:p.pid, start, finish});

        time = finish;
        p.rt -= exec;

        if(p.rt > 0) queue.push(p);
    }

    drawGantt(result);
    document.getElementById("rrOutput").innerHTML = "Gantt Chart Shown Above";
}

/* ------------------------- Gantt Chart Universal ------------------------- */
function drawGantt(processes) {
    let canvas = document.getElementById("ganttChart");
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let x = 10;

    processes.forEach((p,i) => {
        let width = (p.finish - p.start) * 40;

        if (x + width > canvas.width - 20) {
            x = 10;
        }

        ctx.fillStyle = `hsl(${i*55}, 70%, 75%)`;
        ctx.fillRect(x, 40, width, 40);
        ctx.strokeRect(x, 40, width, 40);

        ctx.fillStyle = "#000";
        ctx.fillText(`P${p.pid}`, x + width/2 - 5, 65);

        x += width;
    });
}
