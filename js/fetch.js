
export async function fetch_json() {
    const response = await fetch("./json_data/account_result.json");

    const companies = await response.json();

    return companies;


    
}

