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

        if (data && data.groupedData) {
          setTotal(data.totalFeedbacks);
          const groupedData = data.groupedData;

          const representationOrder = ["ICONIC", "MIXED", "SYMBOLIC"];
          const networkTypeOrder = ["I-I", "I-II", "I-III"];

          // Transform groupedData into chartData
          const labels = representationOrder;
          const datasets = networkTypeOrder.map((networkType, index) => {
            return {
              label: networkType,
              data: labels.map(rep => groupedData[networkType].representationCounts[rep] || 0),
              backgroundColor: `rgba(${index * 80 + 100}, ${index * 50 + 100}, 200, 0.6)`,
              borderColor: `rgba(${index * 80 + 100}, ${index * 50 + 100}, 200, 1)`,
              borderWidth: 1,
              datalabels: {
                display: true,
                color: '#fff',
                anchor: 'center',
                align: 'center',
                formatter: (value, context) => {
                  const totalForRep = labels.reduce((sum, rep) => sum + groupedData[networkType].representationCounts[rep] || 0, 0);
                  const percentage = totalForRep > 0 ? ((value / totalForRep) * 100).toFixed(2) + '%' : '';
                  return `${value} (${percentage})`;
                },
              },
            };
          });

          setChartData({ labels, datasets });
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
                        text: 'Percentage of Exercises by Representation and Type',
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