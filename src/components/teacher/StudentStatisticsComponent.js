import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useParams } from 'react-router-dom';
import { Card, Typography } from 'antd';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

let StudentStatistics = ({ studentName }) => {

  let { studentId } = useParams();
  const [iconicMixedData, setIconicMixedData] = useState({});
  const [symbolicData, setSymbolicData] = useState({});
  let [totalFeedbacks, setTotalFeedbacks] = useState(0);
  let [iconicMixedErrorsTotal, setIconicMixedErrorsTotal] = useState(0);
  let [symbolicErrorsTotal, setSymbolicErrorsTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/student/${studentId}`);
        const data = await response.json();

        if (data) {
          const { iconicMixedErrors, symbolicErrors, percentageLexical, percentageSyntactic, percentageSemantic, totalFeedbacks, iconicMixedErrorsTotal, symbolicErrorsTotal } = data;

          setTotalFeedbacks(totalFeedbacks);
          setIconicMixedErrorsTotal(iconicMixedErrorsTotal);
          setSymbolicErrorsTotal(symbolicErrorsTotal);
          // Prepare datasets for ICONIC and MIXED errors
          const iconicMixedDatasets = [
            {
              label: 'Incorrect Order',
              data: [
                iconicMixedErrors.Lexical.incorrectOrder.count,
                iconicMixedErrors.Syntactic.incorrectOrder.count,
                iconicMixedErrors.Semantic.incorrectOrder.count
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              datalabels: {
                display: true,
                formatter: (value, context) => {
                  const errorType = context.chart.data.labels[context.dataIndex].split(" ")[0];
                  return `${value} (${iconicMixedErrors[errorType].incorrectOrder.percentage}%)`;
                },
                color: '#fff',
                anchor: 'center',
                align: 'center'
              }
            },
            {
              label: 'Incorrect Position',
              data: [
                iconicMixedErrors.Lexical.incorrectPos.count,
                iconicMixedErrors.Syntactic.incorrectPos.count,
                iconicMixedErrors.Semantic.incorrectPos.count
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              datalabels: {
                display: true,
                formatter: (value, context) => {
                  const errorType = context.chart.data.labels[context.dataIndex].split(" ")[0];
                  return `${value} (${iconicMixedErrors[errorType].incorrectPos.percentage}%)`;
                },
                color: '#fff',
                anchor: 'center',
                align: 'center'
              }
            },
            {
              label: 'Out of Bounds',
              data: [
                iconicMixedErrors.Lexical.outOfBounds.count,
                iconicMixedErrors.Syntactic.outOfBounds.count,
                iconicMixedErrors.Semantic.outOfBounds.count
              ],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              datalabels: {
                display: true,
                formatter: (value, context) => {
                  const errorType = context.chart.data.labels[context.dataIndex].split(" ")[0];
                  return `${value} (${iconicMixedErrors[errorType].outOfBounds.percentage}%)`;
                },
                color: '#fff',
                anchor: 'center',
                align: 'center'
              }
            }
          ];

          setIconicMixedData({
            labels: [`Lexical (${percentageLexical}%)`, `Syntactic (${percentageSyntactic}%)`, `Semantic (${percentageSemantic}%)`],
            datasets: iconicMixedDatasets,
          });

          // Prepare data for SYMBOLIC errors
          setSymbolicData({
            labels: ['Lexical', 'Syntactic', 'Semantic'],
            datasets: [
              {
                data: [
                  symbolicErrors.Lexical.count,
                  symbolicErrors.Syntactic.count,
                  symbolicErrors.Semantic.count
                ],
                backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
                datalabels: {
                  display: true,
                  formatter: (value, context) => {
                    const errorType = context.chart.data.labels[context.dataIndex];
                    return `${value} (${symbolicErrors[errorType].percentage}%)`;
                  },
                  color: '#fff',
                  anchor: 'center',
                  align: 'center'
                }
              }
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  let { Title } = Typography;
  return (
    <Card style={{ width: "60%" }} title={<Title>{studentName}</Title>}>
      <h2>Número de ejercicios: {totalFeedbacks}</h2>

      <div>
        <h3>ICONIC and MIXED Error Types</h3>
        <h4>Total: {iconicMixedErrorsTotal}</h4>
        {iconicMixedData && iconicMixedData.labels && (
          <Bar
            data={iconicMixedData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Errors by Category and Type for ICONIC and MIXED',
                },
                datalabels: {
                  display: true,
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

      <div style={{ marginTop: '50px' }}>
        <h3>SYMBOLIC Error Types</h3>
        <h4>Total: {symbolicErrorsTotal}</h4>
        {symbolicData && symbolicData.labels && (
          <Bar
            data={symbolicData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Errors by Category for SYMBOLIC',
                },
                datalabels: {
                  display: true,
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
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

export default StudentStatistics;
