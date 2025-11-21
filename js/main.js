import { fetch_json } from "./fetch.js";
import { search_code } from "./search.js";
import { render_data } from "./render.js";


async function main() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const companies = await fetch_json();
    
    if (code) {
        const company_data = await search_code(code, companies);
        render_data(company_data, code);
    }
    else {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "<p>証券コード、もしくは企業名を入力してください。"
    }
    
}


window.addEventListener("DOMContentLoaded", () => {
    main();
});