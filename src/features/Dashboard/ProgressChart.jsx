// src/features/Dashboard/ProgressChart.jsx
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import dayjs from 'dayjs';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ProgressChart({ dailyLogs }) {
  // Xử lý dữ liệu để phù hợp với biểu đồ
  const chartData = {
    labels: dailyLogs.map(log => dayjs(log.logDate).format('DD/MM')), // Trục X: Ngày tháng
    datasets: [
      {
        label: 'Số điếu đã hút',
        data: dailyLogs.map(log => log.cigarettesSmoked), // Trục Y: Số điếu
        borderColor: '#ef4444', // Màu đường line (đỏ)
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Màu nền dưới đường line
        fill: true,
        tension: 0.4, // Làm cho đường cong mượt hơn
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn chú thích 'Số điếu đã hút'
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Số điếu thuốc'
        }
      },
      x: {
        grid: {
          display: false, // Ẩn đường kẻ dọc
        }
      }
    }
  };

  return (
    <div className="progress-chart-container">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}

export default ProgressChart;