import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function PRCountChart({ pullRequests }) {
  if (!pullRequests || pullRequests.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm text-center">
        No pull requests found for these repos yet.<br />
        (This project uses direct commits rather than a PR workflow.)
      </div>
    )
  }

  const countsByContributor = {}
  pullRequests.forEach(pr => {
    const author = pr.authorLogin || 'unknown'
    countsByContributor[author] = (countsByContributor[author] || 0) + 1
  })

  const contributors = Object.keys(countsByContributor)

  const data = {
    labels: contributors,
    datasets: [
      {
        label: 'PRs',
        data: contributors.map(c => countsByContributor[c]),
        backgroundColor: '#a78bfa',
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

  return <Bar data={data} options={options} />
}

export default PRCountChart