var currentChart;
var fetchedPopulationData;
var fetchedCountryData;
var chartType = 'line';

// Fetch dropdown menu content
window.onload = async function fetchDropdownContent() {
    var url = "https://api.worldbank.org/v2/country?format=json&per_page=400";
    var response = await fetch(url);
    console.log("Fetching data from URL: " + url);

    if (response.status == 200) {
        var countryData = await response.json();
        var countryList = countryData[1];
        countryList = countryList.sort(sortCountryListAlphabetically);
        addDropdownOptions(countryList);
    }
}

function sortCountryListAlphabetically(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}

function addDropdownOptions(countryList) {
    var dropdown = document.getElementById('countryCodeDropdown');

    var option;

    for (var i = 0; i < countryList.length; i++) {
        // skip regions etc.
        if (countryList[i].capitalCity === '') {
            continue;
        }

        option = document.createElement("option");
        option.text = countryList[i].name;
        option.value = countryList[i].id;
        dropdown.appendChild(option);
    }

}

// Fetch data
document
    .getElementById("renderButton")
    .addEventListener("click", fetchData);

function fetchData() {
    var countryCode = document.getElementById("countryCodeDropdown").value;
    fetchPopulationData(countryCode);
    fetchCountryData(countryCode);
}

// Fetch population data from the World Bank API
async function fetchPopulationData(countryCode) {
    const indicatorCode = "SP.POP.TOTL";
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + /indicator/ + indicatorCode + "?format=json" + "&per_page=60";
    console.log("Fetching data from URL: " + url);

    var response = await fetch(url);

    if (response.status == 200) {
        fetchedPopulationData = await response.json();
        console.log(fetchedPopulationData)
        renderChart(getValues(fetchedPopulationData), getLabels(fetchedPopulationData));
    }
}

// Render population chart
function renderChart(data, labels) {
    var ctx = document.getElementById('populationChart').getContext('2d');

    // Clear the previous chart if there is one
    if (currentChart) {
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Population',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            animation: {
                duration: 5000
            }
        }
    });
}

// Fetch country info
async function fetchCountryData(countryCode) {
    const baseUrl = "https://restcountries.eu/rest/v2/alpha/";
    const url = baseUrl + countryCode;
    console.log("Fetching data from URL: " + url);

    var response = await fetch(url);

    if (response.status == 200) {
        fetchedCountryData = await response.json();
        console.log(fetchedCountryData)
        renderCountryData(getCountryArea(fetchedCountryData), getCountryCapital(fetchedCountryData), getCountryFlag(fetchedCountryData), getCountryName(fetchedCountryData), getCountryIndicator(fetchedCountryData), getCountryRegion(fetchedCountryData));
        document.getElementById("graphTypeButton").style.display = "block";
    }
}

// Render country info
function renderCountryData(area, capital, flag, name, indicator, region) {

    document.getElementById('countryName').textContent = name + " (" + indicator + ")";
    document.getElementById('region').textContent = "Region: " + region;
    document.getElementById('capital').textContent = "Capital: " + capital;
    document.getElementById('area').textContent = "Area: " + area + " m";
    var square = document.createElement("sup");
    square.textContent = "2";
    document.getElementById('area').appendChild(square);

    var img = document.createElement("img");
    img.src = flag;
    img.id = "flag";
    img.alt = 'Country flag';

    clearFlagImgContent();

    document.getElementById('flagContainer').appendChild(img);
}

// Clear flag img content
function clearFlagImgContent() {
    if (document.getElementById('flagContainer').firstChild !== null) {
        document.getElementById('flagContainer').firstChild.remove();
    }
}

// Helper getter functions
function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data.name;
    return countryName;
}

function getCountryIndicator(data) {
    var indicator = data.alpha3Code;
    return indicator;
}

function getCountryRegion(data) {
    var region = data.region;
    return region;
}

function getCountryArea(data) {
    var area = data.area;
    return area;
}

function getCountryCapital(data) {
    var capital = data.capital;
    return capital;
}

function getCountryFlag(data) {
    var flag = data.flag;
    return flag;
}

// Change chart type
document.getElementById("graphTypeButton").addEventListener("click", changeChartType);

function changeChartType() {
    if (chartType === "line") {
        chartType = "bar";
        renderChart(getValues(fetchedPopulationData), getLabels(fetchedPopulationData), getCountryName(fetchedPopulationData), getCountryIndicator(fetchedPopulationData));
        setGraphTypeButtonText("Show line chart");
    } else {
        chartType = "line";
        renderChart(getValues(fetchedPopulationData), getLabels(fetchedPopulationData), getCountryName(fetchedPopulationData), getCountryIndicator(fetchedPopulationData));
        setGraphTypeButtonText("Show bar chart");
    }
}

function setGraphTypeButtonText(text) {
    document.getElementById("graphTypeButton").textContent = text;

}