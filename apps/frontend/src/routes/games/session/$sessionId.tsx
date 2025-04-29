import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/session/$sessionId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/session/$sessionId"!</div>
}
