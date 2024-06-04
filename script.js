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
                width: 3 ,// Increase the width of vertical grid lines
            },
            horzLines: {
                color: '#807b7b', // Light grey horizontal grid lines
                width: 3 ,// Increase the width of horizontal grid lines
            }
        }
    };

    var chartContainer = document.getElementById('chart-container');
    var chart = LightweightCharts.createChart(chartContainer, chartOptions);
    var lineSeries = chart.addLineSeries({ 
        color: '#32ac48', // Line color
        lineWidth: 3, // Line width
    });
    
    // Add an area series to fill below the line
    var areaSeries = chart.addAreaSeries({ 
        topColor: 'rgba(20, 198, 44, 0.4)', // Green shadow color with transparency
        bottomColor: 'rgba(20, 198, 44, 0.1)', 
    });

    var preValue = 48499;
    var referenceLine = null;
    var direction = null;
    var initialInvestment = 500;

    setInterval(function() {
        var _currentValue = preValue + Math.floor(Math.random() * 7) - 3;
        
        // Update line series with new data
        var newData = { time: parseInt(Date.now() / 1000), value: _currentValue };
        lineSeries.update(newData);
        areaSeries.update(newData);

        
        // Update line color based on direction
        if (direction === 'up' && _currentValue > referenceLine) {
            lineSeries.applyOptions({ color: 'green' });
        } else if (direction === 'down' && _currentValue < referenceLine) {
            lineSeries.applyOptions({ color: 'red' });
        }

        // Calculate and display profit/loss
        if (referenceLine !== null) {
            let profitLoss = calculateProfitLoss(referenceLine, _currentValue, direction, initialInvestment);
            document.getElementById('profit-loss-display').innerText = `$${profitLoss.toFixed(2)}`;
        }

        preValue = _currentValue;
    }, 1000);

    window.setDirection = function(dir) {
        direction = dir;
        referenceLine = preValue; // Set the reference line to the current value
        chart.addLineSeries({ // Add a new line series to mark the reference line
            color: dir === 'up' ? 'blue' : 'yellow',
            lineWidth: 2
        }).setData([{ value: referenceLine, time: parseInt(Date.now() / 1000) }]);
    }
}

function calculateProfitLoss(referenceValue, currentValue, direction, investment) {
    let profitLoss = 0;
    if (direction === 'up') {
        profitLoss = ((currentValue - referenceValue) / referenceValue) * investment;
    } else if (direction === 'down') {
        profitLoss = ((referenceValue - currentValue) / referenceValue) * investment;
    }
    return profitLoss;
}
