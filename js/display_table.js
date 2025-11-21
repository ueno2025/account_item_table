export async function display_table(company_data) {
    const resultDiv = document.getElementById("result");

    const table = document.createElement("table");
    table.classList.add("yaku-table");

    const data = company_data["業績情報"];

    if (!data || data.length === 0) {
        resultDiv.innerHTML += "<p>業績情報が存在しません。</p>";
        return;
    }

    // --- 最初の有効な勘定科目を取り出す ---
    let sampleKamoku = null;
    for (const info of data) {
        if (info?.["勘定科目"]) {
            sampleKamoku = info["勘定科目"];
            break;
        }
    }

    if (!sampleKamoku) {
        resultDiv.innerHTML += "<p>勘定科目が存在しません。</p>";
        return;
    }

    const kamokuList = Object.keys(sampleKamoku);

    // --- 数値フォーマット関数 ---
    const formatNum = (v) => {
        if (v === null || v === undefined || v === "" || v === "-") return "-";
        if (typeof v !== "number") v = Number(v);
        if (isNaN(v)) return "-";
        return v.toLocaleString();
    };

    // --- ヘッダー行 ---
    let headerHTML = "<tr><th>時期</th>";
    kamokuList.forEach(k => {
        headerHTML += `<th>${k}</th>`;
    });
    headerHTML += "</tr>";
    table.innerHTML = headerHTML;

    // --- グラフ用データ ---
    const periods = [];
    const valueMap = {};
    kamokuList.forEach(k => valueMap[k] = []);

    // --- データ行 ---
    data.forEach(info => {
        if (!info || !info["勘定科目"]) return;

        const period = info["四半期"];
        if (!period || period === "None/NoneQ") return;

        const kamoku = info["勘定科目"];

        let rowHTML = `<tr><td>${period}</td>`;
        kamokuList.forEach(k => {
            rowHTML += `<td>${formatNum(kamoku?.[k])}</td>`;
        });
        rowHTML += "</tr>";

        table.innerHTML += rowHTML;

        periods.push(period);
        kamokuList.forEach(k => {
            const v = kamoku?.[k];
            valueMap[k].push(v === "-" ? null : Number(v));
        });
    });

    resultDiv.appendChild(table);

    // --- ▼ グラフ UI ▼ ---
    const select = document.getElementById("accountSelect");

    // プルダウンに勘定科目を追加
    kamokuList.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        select.appendChild(opt);
    });

    // 初期グラフ描画
    drawGraph(periods, valueMap[kamokuList[0]], kamokuList[0]);

    select.addEventListener("change", (e) => {
        const k = e.target.value;
        drawGraph(periods, valueMap[k], k);
    });
}

let chartInstance = null;
function drawGraph(periods, values, kamokuName) {
    const ctx = document.getElementById("accountChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: periods,
            datasets: [{
                label: kamokuName,
                data: values,
                borderWidth: 2,
                pointRadius: 3,         // ● 小さめの点
                pointHoverRadius: 7,    // ホバー時に大きくなる
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            // ここが重要（ツールチップ）
            plugins: {
                tooltip: {
                    enabled: true,   // ← 数字を浮かび上がらせる
                    mode: "nearest",
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const v = context.raw;
                            // 数値を3桁カンマにして表示
                            return `${kamokuName}: ${v?.toLocaleString()}`;
                        }
                    }
                }
            },

            // マウス追従ライン（crosshair風）
            interaction: {
                mode: "nearest",
                intersect: false
            },

            scales: {
                y: {
                    ticks: {
                        callback: (v) => v.toLocaleString()
                    }
                }
            }
        }
    });
}
