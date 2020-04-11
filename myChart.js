var currentChart;
var fetchedData;
var chartType = 'line';

// EventListener for the Button
document
    .getElementById("renderButton")
    .addEventListener("click", fetchData);

document.getElementById("graphTypeButton").addEventListener("click", changeChartType);

// fetch data from the World Bank API
async function fetchData() {
    var countryCode = document.getElementById("country").value;
    const indicatorCode = "SP.POP.TOTL";
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + /indicator/ + indicatorCode + "?format=json" + "&per_page=60";
    console.log("Fetching data from URL: " + url);

    var response = await fetch(url);

    if (response.status == 200) {
        fetchedData = await response.json();
        console.log(fetchedData)
        renderChart(getValues(fetchedData), getLabels(fetchedData), getCountryName(fetchedData), getCountryIndicator(fetchedData));
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

function getCountryIndicator(data) {
    var indicator = data[1][0].countryiso3code;
    return indicator;
}

function renderChart(data, labels, countryName, countryIndicator) {
    var ctx = document.getElementById('populationChart').getContext('2d');

    document.getElementById("countryTitle").textContent = countryName + " (" + countryIndicator + ")";


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
                label: 'Population, ' + countryName,
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
                duration: 10000
            }
        }
    });
}

function changeChartType() {
    if (chartType === "line") {
        chartType = "bar";
        renderChart(getValues(fetchedData), getLabels(fetchedData), getCountryName(fetchedData), getCountryIndicator(fetchedData));
        document.getElementById("graphTypeButton").textContent = "Show line chart";
    } else {
        chartType = "line";
        renderChart(getValues(fetchedData), getLabels(fetchedData), getCountryName(fetchedData), getCountryIndicator(fetchedData));
        document.getElementById("graphTypeButton").textContent = "Show bar chart";
    }
}