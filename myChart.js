function logCountryCode() {
    var countryCode = document.getElementById("country").value;
    console.log(countryCode);
}

// EventListener for the Button
document
    .getElementById("renderButton")
    .addEventListener("click", fetchData);

// fetch data from the World Bank API
async function fetchData() {
    var countryCode = document.getElementById("country").value;
    const indicatorCode = "SP.POP.TOTL";
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + /indicator/ + indicatorCode + "?format=json";
    console.log("Fetching data from URL: " + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData)
    }
}