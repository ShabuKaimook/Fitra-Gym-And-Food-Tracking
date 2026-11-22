import { PhotoInput } from '@/components/PhotoInput'
import { ImagePlus } from 'lucide-react'

type Props = {
  /** The picked photo; missing = `fallback`. */
  image: string | undefined
  /** Illustration shown until a photo is picked. */
  fallback: string
  onPick: (url: string) => void
}

// A cover image (e.g. FormPage's `cover`) with an "Add photo" / "Change photo" button at its bottom right.
// The parent must be positioned (FormPage's cover band is).
export const PhotoCover = ({ image, fallback, onPick }: Props) => {
  const label = image ? 'Change photo' : 'Add photo'
  return (
    <>
      {/* The illustration's subject sits low, so anchor it to the bottom; photos stay centred. */}
      <img src={image ?? fallback} alt="" className={`size-full object-cover ${image ? '' : 'object-bottom'}`} />
      <PhotoInput
        label={label}
        onPick={onPick}
        className="absolute right-3 bottom-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-4.5 text-sm font-extrabold text-on-primary shadow-[0_4px_14px_rgba(0,0,0,0.25)] ring-2 ring-surface hover:bg-primary-hover"
      >
        <ImagePlus size={18} aria-hidden />
        {label}
      </PhotoInput>
    </>
  )
}
