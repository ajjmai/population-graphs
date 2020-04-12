var currentChart;
var fetchedPopulationData;
var fetchedCountryData;
var chartType = "line";
var gender = "";
var age = "";
var label;

document
    .getElementById("clearRadioButton")
    .addEventListener("click", clearSelection);

function clearSelection() {
    $(".form-check-input").prop('checked', false);
    $("#collapseForm").collapse("hide");

}

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
    var dropdown = $("#countryCodeDropdown");

    var option;

    for (var i = 0; i < countryList.length; i++) {
        // skip regions etc.
        if (countryList[i].capitalCity === "") {
            continue;
        }

        option = document.createElement("option");
        option.text = countryList[i].name;
        option.value = countryList[i].id;
        dropdown.append(option);
    }
}

// Fetch data
document
    .getElementById("renderButton")
    .addEventListener("click", fetchData);

function fetchData() {
    var countryCode = $("#countryCodeDropdown").val();
    setGenderCode();
    setAgeCode();
    fetchPopulationData(countryCode);
    fetchCountryData(countryCode);
}

function setGenderCode() {
    if ($("#genderRadioGroup input:checked").val()) {
        gender = $("#genderRadioGroup input:checked").val();
    }
}

function setAgeCode() {
    if ($("#ageRadioGroup input:checked").val()) {
        age = $("#ageRadioGroup input:checked").val();
    }
}

function clearGenderAndAge() {
    gender = "";
    age = "";
}

// Fetch population data from the World Bank API
async function fetchPopulationData(countryCode) {
    const indicatorCode = "SP.POP.";
    var dataSetType;
    if (gender !== "" && age !== "")
        dataSetType = age + "." + gender + ".IN";
    else
        dataSetType = "TOTL"
    const baseUrl = "https://api.worldbank.org/v2/country/";
    const url = baseUrl + countryCode + /indicator/ + indicatorCode + dataSetType + "?format=json" + "&per_page=60";
    console.log("Fetching data from URL: " + url);

    var response = await fetch(url);

    if (response.status == 200) {
        fetchedPopulationData = await response.json();
        console.log(fetchedPopulationData)
        setLabel();
        renderChart(getValues(fetchedPopulationData), getLabels(fetchedPopulationData));
        clearSelection();
    }
}

function setLabel() {
    if (gender !== "" && age !== "") {
        label = "Population: " + $("label[for='inlineRadio" + gender + "']").text() + "s, aged " + $("label[for='inlineRadio" + age + "']").text();
        clearGenderAndAge();
    } else
        label = "Total population"
}

// Render population chart
function renderChart(data, labels) {
    var ctx = document.getElementById("populationChart").getContext("2d");

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
                label: label,
                data: data,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
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
        $("#graphTypeButton").css("display", "block");
    }
}

// Render country info
function renderCountryData(area, capital, flag, name, indicator, region) {

    $("#countryName").text(name + " (" + indicator + ")");
    $("#region").text("Region: " + region);
    $("#capital").text("Capital: " + capital);
    $("#area").text("Area: " + area + " m");

    var square = $("<sup></sup>").text("2");
    $("#area").append(square);

    var img = document.createElement("img");
    img.src = flag;
    img.id = "flag";
    img.alt = "Country flag";

    clearFlagImgContent();

    $("#flagContainer").append(img);
}

// Clear flag img content
function clearFlagImgContent() {
    if (document.getElementById("flagContainer").firstChild !== null) {
        document.getElementById("flagContainer").firstChild.remove();
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
    $("#graphTypeButton").text(text);

}