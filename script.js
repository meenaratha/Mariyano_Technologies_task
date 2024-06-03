function loadCharts() {
    console.log('charts..');

    const chartOptions = {
        layout: {
            textColor: '#e0e0e0',
            background: { type: 'solid', color: 'transparent' }
        },
        grid: {
            vertLines: {
                color: '#e0e0e0' // Light grey vertical grid lines
            },
            horzLines: {
                color: '#e0e0e0' // Light grey horizontal grid lines
            }
        }
    };

    var chartContainer = document.getElementById('chart-container');
    var chart = LightweightCharts.createChart(chartContainer, chartOptions);
    var lineSeries = chart.addLineSeries({ color: '#2962FF' });

    var data = [{ value: 48500, time: parseInt(Date.now() / 1000) }];
    lineSeries.setData(data);

    var preValue = 48499;
    var _currentValue = 30;
    var _rnd = 1;
    var referenceLine = null;
    var direction = null;
    var initialInvestment = 500;

    setInterval(function() {
        _rnd = Math.floor(Math.random() * 10);

        if (_rnd < 5) {
            _currentValue = preValue - Math.floor(Math.random() * 3);
        } else {
            _currentValue = preValue + Math.floor(Math.random() * 3);
        }

        lineSeries.update({ value: _currentValue, time: parseInt(Date.now() / 1000) });

        if (direction && referenceLine !== null) {
            if (direction === 'up') {
                if (_currentValue > referenceLine) {
                    lineSeries.applyOptions({ color: 'green' });
                } else {
                    lineSeries.applyOptions({ color: 'red' });
                }
            } else if (direction === 'down') {
                if (_currentValue < referenceLine) {
                    lineSeries.applyOptions({ color: 'green' });
                } else {
                    lineSeries.applyOptions({ color: 'red' });
                }
            }
        }

        if (referenceLine !== null) {
            let profitLoss = calculateProfitLoss(referenceLine, _currentValue, direction, initialInvestment);
            document.getElementById('profit-loss-display').innerText = `$${profitLoss.toFixed(2)}`;
        }

        preValue = _currentValue;
    }, 1000);

    window.setDirection = function(dir) {
        direction = dir;
        referenceLine = _currentValue; // Set the reference line to the current value
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
