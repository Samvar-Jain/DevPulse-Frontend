import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

function CommitActivityChart({ commits }) {
  // Group commits by date (YYYY-MM-DD)
  const countsByDate = {}
  commits.forEach(commit => {
    const day = commit.date.split('T')[0]
    countsByDate[day] = (countsByDate[day] || 0) + 1
  })

  const sortedDates = Object.keys(countsByDate).sort()

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Commits',
        data: sortedDates.map(date => countsByDate[date]),
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa33',
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e5e7eb' } },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
    },
  }

  return <Line data={data} options={options} />
}

export default CommitActivityChart