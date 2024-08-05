import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function LogLogGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // To store the chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Log the data being passed in
    //console.log('Data passed to LogLogGraph:', data);

    // Determine if the data is rank-frequency or word-frequency
    const isWordFrequency = data[0] && Array.isArray(data[0]) && typeof data[0][0] === 'string';

    // Map data to log-log format and filter out invalid values
    const chartData = data.map((item) => {
      if (isWordFrequency) {
        const [word, frequency] = item; // Destructure the array
        if (frequency > 0) {
          return {
            x: Math.log10(frequency), // Use frequency for X-axis
            y: Math.log10(word.length), // Use word length for Y-axis (or another metric)
            label: word // Add word as a label
          };
        } else {
          return null; // Exclude invalid data points
        }
      } else {
        const [rank, frequency] = item; // Destructure the array for rank-frequency
        if (rank > 0 && frequency > 0) {
          return {
            x: Math.log10(rank),
            y: Math.log10(frequency),
          };
        } else {
          return null; // Exclude invalid data points
        }
      }
    }).filter(item => item !== null);

    // Destroy any existing chart instance before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: isWordFrequency ? 'Word vs Frequency' : 'Rank vs Frequency',
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: isWordFrequency ? 'Log Frequency' : 'Log Rank',
            },
            ticks: {
              callback: function(value) {
                // Show labels for words if available
                const point = chartData.find(point => Math.log10(point.x) === value);
                return point ? point.label : value;
              }
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: isWordFrequency ? 'Word Length' : 'Log Frequency',
            },
          },
        },
      },
    });

    // Clean up function to destroy the chart when the component unmounts or data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default LogLogGraph;
