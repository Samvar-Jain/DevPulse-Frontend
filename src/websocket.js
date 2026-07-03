import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function connectWebSocket(onCommitsUpdate) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${import.meta.env.VITE_WS_URL || 'http://localhost:8080'}/ws`),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('WebSocket connected')
      client.subscribe('/topic/commits', (message) => {
        const commits = JSON.parse(message.body)
        onCommitsUpdate(commits)
      })
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame)
    },
  })

  client.activate()
  return client
}