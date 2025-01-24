import {useEffect} from 'react'
import ApexCharts from 'apexcharts';
export default function ChartHome() {
    useEffect(() => {
        // Options configuration for ApexCharts
        const options = {
          series: [
            { name: 'ຍອດທັງໝົດ', type: 'column', data: [25, 30, 40, 45, 60, 60, 65, 70] },
            { name: 'ຍອດທີ່ຈ່າຍແລ້ວ', type: 'column', data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5] },
            { name: 'ຍອດຄ້າງຈ່າຍ', type: 'line', data: [20, 29, 37, 36, 44, 45, 50, 58] }
          ],
          chart: {
            height: 350,
            type: 'line',
            stacked: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [1, 1, 4]
          },
          title: {
            text: 'ຍອດລາຍຮັບປະຈຳປິ (2024 - 2025)',
            align: 'left',
            offsetX: 110
          },
          xaxis: {
            categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
          },
          yaxis: [
            {
              seriesName: 'Income',
              axisTicks: { show: true },
              axisBorder: { show: true, color: '#008FFB' },
              labels: { style: { colors: '#008FFB' } },
              title: { text: 'Income (thousand crores)', style: { color: '#008FFB' } },
              tooltip: { enabled: true }
            }
          ],
          tooltip: {
            fixed: {
              enabled: true,
              position: 'topLeft',
              offsetY: 30,
              offsetX: 60
            }
          },
          legend: {
            horizontalAlign: 'left',
            offsetX: 40
          }
        };
        const chart = new ApexCharts(document.querySelector("#chart"), options);
    
        // Render the chart
        chart.render();
    
        // Clean up function (optional)
        return () => {
          chart.destroy();
        };
      }, []); // Empty dependency array ensures this effect runs only once
    
  return (
    <div id="chart"></div>
  )
}
