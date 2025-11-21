// 企業をcodeから検索

export async function search_code(code, companies) {

    const input = normalizeText(code);

    const exactMatch = companies.find(c => c["証券コード"] == input) || companies.find(c => c["企業名"] == input);
    if (exactMatch) {
        return {type: "exact", data: exactMatch}
    }

    const candidates = companies.filter(c => {
        const json_code = normalizeText(c["証券コード"]);
        const json_name = normalizeText(c["企業名"]);
        return json_code.includes(input) || json_name.includes(input)
    });


    return {type: "candidates", data: candidates}
}


// 全角・半角、大文字、小文字をそろえる
function normalizeText(str) {
    if (str == null) return "";
    return str
        .normalize("NFKC")
        .toUpperCase()
        .trim();
}