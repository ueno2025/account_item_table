
export async function display_header(company_data) {
    const listDiv = document.getElementById("candidates");
    listDiv.innerHTML = ""; // 候補リストを削除

    const resultDiv = document.getElementById("header_result");
    const header = document.createElement("p");
    header.classList.add("header")
    header.innerHTML = `
        証券コード: ${company_data["証券コード"]}<br>
        企業名: ${company_data["企業名"]}<br>
        業種: ${company_data["業種"]}<br>
        `;
    resultDiv.appendChild(header);

    // URLの?code=を証券コードに置き換える
    const newUrl = `${window.location.pathname}?code=${company_data["証券コード"]}`;
    window.history.pushState({companyCode: company_data["証券コード"]}, "", newUrl);
}