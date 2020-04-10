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

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}