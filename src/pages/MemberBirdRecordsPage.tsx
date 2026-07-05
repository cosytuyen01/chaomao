import { Navigate, useParams } from 'react-router-dom'

export default function MemberBirdRecordsPage() {
  const { birdId } = useParams<{ birdId: string }>()
  if (!birdId) return <Navigate to="/" replace />
  return <Navigate to={`/che-do-di/tham-khao/${birdId}?tab=nhat-ky`} replace />
}
