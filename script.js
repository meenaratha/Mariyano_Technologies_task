let chart;
let lineSeries;
let areaSeries;
let preValue; 
const initialInvestment = 500; // Initial investment value
function loadCharts(lineColor) {
    console.log('charts..');

    const chartOptions = {
        layout: {
            textColor: '#807b7b',
            background: { type: 'solid', color: 'transparent' } // Set background color to white
        },
        grid: {
            vertLines: {
                color: '#807b7b', // Light grey vertical grid lines
                width: 3, // Increase the width of vertical grid lines
            },
            horzLines: {
                color: '#807b7b', // Light grey horizontal grid lines
                width: 3, // Increase the width of horizontal grid lines
            }
        },
        timeScale: {
            timeVisible: true,
            secondsVisible: true,
            tickMarkFormatter: (time, tickMarkType, locale) => {
                const date = new Date(time * 1000);
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            },
        }
    };

    var chartContainer = document.getElementById('chart-container');
      chart = LightweightCharts.createChart(chartContainer, chartOptions);
     lineSeries = chart.addLineSeries({
        color: lineColor, // Line color
        lineWidth: 3, // Line width
    });
    
    // Add an area series to fill below the line
     areaSeries = chart.addAreaSeries({
        topColor: 'rgba(20, 198, 44, 0.4)', // Green shadow color with transparency
        bottomColor: 'rgba(20, 198, 44, 0.1)',
        lineColor: lineColor,
        lineWidth: 1,
    });

     preValue = getAmountFromInput();

    setInterval(function() {
        var _currentValue = preValue + Math.floor(Math.random() * 10) - 10;

        // Get the current time in seconds
        var currentTime = Math.floor(Date.now() / 1000);
        
        // Update line series with new data
        var newData = { time: currentTime, value: _currentValue };
        lineSeries.update(newData);
        areaSeries.update(newData);
        updateProfitLossDisplay(_currentValue);

        preValue = _currentValue; // Update the previous value
    }, 1000);

    // Resize chart to fit the container
    // window.addEventListener('resize', () => {
    //     chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
    // });
    // chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);

}

function getAmountFromInput() {
    var amountStr = document.getElementById('amount-display').value;
    return parseFloat(amountStr.replace(/[^0-9.-]+/g, ""));
}

function setAmountToInput(amount) {
    document.getElementById('amount-display').value = `$${amount.toFixed(2)}`;
    document.getElementById('total-amount').innerText = `$${amount.toFixed(2)}`;

}

function updateChartWithNewValue(value) {
    // Get the current time in seconds
    var currentTime = Math.floor(Date.now() / 1000);

    // Update line series with new data
    var newData = { time: currentTime, value: value };
    lineSeries.update(newData);
    areaSeries.update(newData);
    updateProfitLossDisplay(value);
    preValue = value; // Update the previous value
}
function updateProfitLossDisplay(currentValue) {
    const profitLossValue = currentValue - initialInvestment;
    const profitLossPercentage = (profitLossValue / initialInvestment) * 100;

    document.getElementById('profit-loss-display').innerText = `${profitLossValue >= 0 ? '+' : ''}$${profitLossValue.toFixed(2)}`;
    document.getElementById('profit-loss-percentage').innerText = `${profitLossPercentage.toFixed(2)}%`;
    document.getElementById('final-percentage').innerText = `${profitLossPercentage.toFixed(2)}%`;

}

function incrementAmount() {
    var currentAmount = getAmountFromInput();
    var newAmount = currentAmount + 100; // Increment by 100
    setAmountToInput(newAmount);
    updateChartWithNewValue(newAmount);
}

function decrementAmount() {
    var currentAmount = getAmountFromInput();
    var newAmount = currentAmount - 100; // Decrement by 100
    setAmountToInput(newAmount);
    updateChartWithNewValue(newAmount);
}

 // Ensure chart responsiveness on window resize
window.addEventListener('resize', function() {
    var chartContainer = document.getElementById('chart-container');
    if (chart && chartContainer) {
        chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
    } else {
        console.error("Chart or chart container not found.");
    }
});
