// src/App.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, Typography } from 'antd';
import { useParams } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

let ClassroomStatistics = () => {

  let { classroomName } = useParams();

  const data = {
    labels: ['Body', 'Transports', 'Food'],
    datasets: [
      {
        label: 'I-I',
        data: [20, 15, 10], // % of exercises done by T1
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'I-II',
        data: [15, 10, 5], // % of exercises done by T2
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'I-III',
        data: [10, 5, 10], // % of exercises done by T3
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Percentage of Exercises Done by Category and Relationship',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: function (value) {
            return value + '%'; // Display percentage on y-axis
          },
        },
      },
    },
  };

  let { Title } = Typography;
  return (
    <Card style={{ width: "75%" }} title={<Title>{classroomName}</Title>}>
      <Bar data={data} options={options} />
    </Card>
  );
};

export default ClassroomStatistics;