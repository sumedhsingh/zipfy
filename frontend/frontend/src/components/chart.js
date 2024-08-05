import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function LogLogGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // To store the chart instance

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Log the data being passed in
    //console.log('Data passed to LogLogGraph:', data);

    // Map data to log-log format and filter out invalid values
    const chartData = data.map((item) => {
        const [rank, frequency] = item; // Destructure the array
        if (rank > 0 && frequency > 0) {
          return {
            x: Math.log10(rank),
            y: Math.log10(frequency),
          };
        } else {
          return null; // Exclude invalid data points
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
          label: 'Rank vs Frequency',
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
              text: 'Log Rank',
            },
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Log Frequency',
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
