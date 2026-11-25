import { EditorHeader } from '@/components/EditorHeader'
import { ExerciseForm } from '@/components/ExerciseForm'
import { ROUTE_PATHS } from '@/constants/routePaths'
import { useNavigate } from 'react-router-dom'

const FORM_ID = 'exercise-form'

// New exercise (wireframe 1n) as its own page. The split builder opens the same form as a sheet instead.
// shortcut: back to Gym until the exercise library page exists; send it there then.
const ExerciseNewPage = () => {
  const navigate = useNavigate()
  return (
    <ExerciseForm
      formId={FORM_ID}
      header={(saving) => (
        <EditorHeader
          title="New exercise"
          crumb="Gym / Exercises /"
          backTo={ROUTE_PATHS.GYM}
          formId={FORM_ID}
          saving={saving}
          saveLabel="Save exercise"
        />
      )}
      onSaved={() => navigate(ROUTE_PATHS.GYM, { replace: true })}
    />
  )
}

export default ExerciseNewPage
