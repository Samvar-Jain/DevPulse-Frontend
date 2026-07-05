import { useState, useEffect } from 'react'
import api from './api'
import CommitActivityChart from './components/CommitActivityChart'
import PRCountChart from './components/PRCountChart'
import { connectWebSocket } from './websocket'

function App() {
  const [commits, setCommits] = useState([])
  const [pullRequests, setPullRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [healthScore, setHealthScore] = useState(null)

  useEffect(() => {
    const repoParams = {
      params: {
        repos: ['Samvar-Jain/devpulse', 'Samvar-Jain/AI--Powered-Reciepe-Finder']
      },
      paramsSerializer: { indexes: null }
    }

    Promise.all([
      api.get('/dashboard', repoParams),
      api.get('/pulls', repoParams),
      api.get('/health-score', repoParams)
    ])
      .then(([commitsRes, prsRes, healthRes]) => {
        setCommits(commitsRes.data)
        setPullRequests(prsRes.data)
        setHealthScore(healthRes.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load dashboard data. Are you logged in at localhost:8080?')
        setLoading(false)
      })
  }, [])
  
  useEffect(() => {
  const client = connectWebSocket((updatedCommits) => {
    setCommits(updatedCommits)
    console.log('Received live update:', updatedCommits.length, 'commits')
  })

  return () => client.deactivate()
}, [])

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>

if (error) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">DevPulse Dashboard</h1>
      <p className="text-gray-400">Please log in with GitHub to view your dashboard.</p>
      
      <a href="/oauth2/authorization/github"
         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Login with GitHub
      </a>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Repositories</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="hover:text-white cursor-pointer">devpulse</li>
          <li className="hover:text-white cursor-pointer">AI-Powered-Recipe-Finder</li>
        </ul>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">DevPulse Dashboard</h1>
          <a href="/logout" className="text-sm text-gray-400 hover:text-white ml-4">
            Logout
          </a>
          <div className="flex gap-3 items-center text-sm">
            <input type="date" className="bg-gray-700 text-gray-200 rounded px-2 py-1 border border-gray-600" />
            <span className="text-gray-400">to</span>
            <input type="date" className="bg-gray-700 text-gray-200 rounded px-2 py-1 border border-gray-600" />
            <select className="bg-gray-700 text-gray-200 rounded px-2 py-1 border border-gray-600">
              <option>All Repos</option>
              <option>devpulse</option>
              <option>AI-Powered-Recipe-Finder</option>
            </select>
            <select className="bg-gray-700 text-gray-200 rounded px-2 py-1 border border-gray-600">
              <option>All Contributors</option>
              <option>Samvar-Jain</option>
            </select>
          </div>
        </header>

        <main className="flex-1 p-6 grid grid-cols-2 gap-6">
          <div className="col-span-2 bg-gray-800 rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-300">Avg PR Review Turnaround</h3>
              <p className="text-sm text-gray-500">Time from PR open to merge/close</p>
            </div>
            <div className="text-3xl font-bold">
              {typeof healthScore === 'number' ? `${healthScore.toFixed(1)}h` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="mb-4 font-semibold">Commit Activity ({commits.length} commits loaded)</h3>
            <CommitActivityChart commits={commits} />
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="mb-4 font-semibold">PRs by Contributor</h3>
            <PRCountChart pullRequests={pullRequests} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App