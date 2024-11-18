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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/classroom/${classroomId}`);
        const data = await response.json();

        if (data && data.stackedData) {
          setTotal(data.totalFeedbacks);
          const stackedData = data.stackedData;

          const representations = Object.keys(stackedData);
          const networkTypes = [...new Set(representations.flatMap(representation => Object.keys(stackedData[representation])))];

          const normalizedData = {};
          representations.forEach(representation => {
            const totalForCategory = networkTypes.reduce((sum, networkType) => {
              return sum + (stackedData[representation][networkType]?.count || 0);
            }, 0);

            normalizedData[representation] = {};
            networkTypes.forEach(networkType => {
              if (stackedData[representation][networkType]) {
                const count = stackedData[representation][networkType].count;
                normalizedData[representation][networkType] = {
                  ...stackedData[representation][networkType],
                  normalizedCount: count / totalForCategory || 0,
                };
              }
            });
          });

          const datasets = networkTypes.map((networkType, index) => {
            let calculatePercentage = (value) => (value * 100).toFixed(2) <= 0 ? '' : (value * 100).toFixed(2) + '%';
            return ({
              label: networkType,
              data: representations.map(representation => normalizedData[representation][networkType]?.normalizedCount || 0),
              backgroundColor: `rgba(${index * 120}, 100, 130, 1)`,
              borderColor: `rgba(${index * 120}, 100, 132, 1)`,
              borderWidth: 1,
              datalabels: {
                display: true,
                formatter: (value, context) => `${stackedData[representations[context.dataIndex]][networkType]?.count || ''} ${calculatePercentage(value)}`,
                color: '#fff',
                anchor: 'center',
                align: 'center'
              }
            });
          });

          setChartData({
            labels: representations,
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
                }
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  max: 1,
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