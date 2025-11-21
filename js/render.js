import { display_header } from "./display_header.js";
import { display_table } from "./display_table.js";

export async function render_data(company_data, input_word) {

    // 完全一致
    if (company_data.type == "exact") {
        await display_header(company_data.data);
        display_table(company_data.data);
        return;
    }
    // 部分一致 
    else {
        const listDiv = document.getElementById("candidates");
        
        if (company_data.data.length === 0) {
            listDiv.innerHTML = `<p>「${input_word}」に一致する候補は0件でした。</p>`;
            return;
        } else {
            listDiv.innerHTML = `<p>「${input_word}」に一致する候補:</p><ul></ul>`;
        }

        const ul = document.querySelector("ul");
        company_data.data.forEach(c => {
            const li = document.createElement("li");
            li.textContent = `証券コード: ${c["証券コード"]} - ${c["企業名"]} (${c["業種"]}) `;
            
            const btn = document.createElement("button");
            btn.textContent = "確認";
            btn.addEventListener("click", () => {
                display_header(c);   // ヘッダー表示(外部関数)
                display_table(c);    // テーブル表示(外部関数)
            });

            li.appendChild(btn);
            ul.appendChild(li);
        });
    }

}
