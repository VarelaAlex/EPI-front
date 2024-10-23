import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

let ClassroomStatistics = ({ classroomId }) => {

  let { classroomName } = useParams();
  const [chartData, setChartData] = useState({});
  const [total, setTotal] = useState(0);
  const [chartStackedData, setChartStackedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/classroom/${classroomId}`);
        const data = await response.json();

        if (data && data.stackedData) {
          setTotal(data.totalFeedbacks);
          const stackedData = data.stackedData;
          setChartStackedData(stackedData);

          const representations = Object.keys(stackedData);
          const networkTypes = [...new Set(representations.flatMap(representation => Object.keys(stackedData[representation])))];

          const totalCounts = representations.map(representation => {
            return networkTypes.reduce((sum, networkType) => sum + (stackedData[representation][networkType]?.count || 0), 0);
          });

          representations.forEach(representation => {
            networkTypes.forEach(networkType => {
              if (stackedData[representation][networkType]) {
                const count = stackedData[representation][networkType].count;
                const total = totalCounts[representations.indexOf(representation)];
                stackedData[representation][networkType].percentage = ((count / total) * 100).toFixed(2);
              }
            });
          });

          const datasets = networkTypes.map((networkType, index) => ({
            label: networkType,
            data: representations.map(representation => stackedData[representation][networkType]?.count || 0),
            backgroundColor: `rgba(${index * 120}, 100, 130, 1)`,
            borderColor: `rgba(${index * 120}, 100, 132, 1)`,
            borderWidth: 1,
            datalabels: {
              display: true,
              formatter: (value, context) => {
                const rep = context.chart.data.labels[context.dataIndex].split(" ")[0];
                console.log(context);
                const percentage = stackedData[rep] && stackedData[rep][networkType] ? stackedData[rep][networkType].percentage : 0;
                return `${value} (${percentage}%)`;
              },
              color: '#fff',
              anchor: 'center',
              align: 'center'
            }
          }));

          const labelsWithPercentages = representations.map((representation, index) => {
            const total = totalCounts[index];
            const percentage = ((total / totalCounts.reduce((sum, count) => sum + count, 0)) * 100).toFixed(2);
            return `${representation} (${percentage}%)`;
          });

          setChartData({
            labels: labelsWithPercentages,
            datasets: datasets,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [classroomId]);

  let { Title } = Typography;
  return (
    <Card style={{ width: "60%" }} title={<Title>{classroomName}</Title>}>
      <h2>Total: {total}</h2>

      <div>
        {chartData && chartData.labels && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Percentage of Exercises by Category and Type',
                },
                datalabels: {
                  display: true,
                  color: '#fff',
                  formatter: (value, context) => {
                    const datasetIndex = context.datasetIndex;
                    const labelIndex = context.dataIndex;
                    const rep = chartData.labels[labelIndex];
                    const networkType = chartData.datasets[datasetIndex].label;
                    const count = chartStackedData[rep] && chartStackedData[rep][networkType] ? chartStackedData[rep][networkType].count : 0;
                    const percentage = chartStackedData[rep] && chartStackedData[rep][networkType] ? chartStackedData[rep][networkType].percentage : 0;
                    return `${count} (${percentage}%)`;
                  },
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                },
              },
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default ClassroomStatistics;
