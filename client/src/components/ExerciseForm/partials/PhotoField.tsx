import { PhotoInput } from '@/components/PhotoInput'
import { ImagePlus } from 'lucide-react'

type Props = { photo: string | undefined; onPick: (url: string) => void }

// Optional photo of the exercise (e.g. the machine), shown as its thumbnail everywhere it's listed.
export const PhotoField = ({ photo, onPick }: Props) => (
  <PhotoInput
    label={photo ? 'Change photo' : 'Add photo'}
    onPick={onPick}
    className="relative flex size-24 flex-none flex-col items-center justify-center gap-1 overflow-hidden rounded-[18px] border border-dashed border-ink-3 bg-surface text-xs font-bold text-ink-2 hover:bg-surface-2"
  >
    {photo ? (
      <>
        <img src={photo} alt="" className="absolute inset-0 size-full object-cover" />
        <span className="absolute inset-x-0 bottom-0 bg-ink/55 py-1 text-center text-[11px] text-on-primary">
          Change
        </span>
      </>
    ) : (
      <>
        <ImagePlus size={20} aria-hidden />
        Photo
      </>
    )}
  </PhotoInput>
)
