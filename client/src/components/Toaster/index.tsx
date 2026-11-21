import { useSyncExternalStore } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { Bounce, ToastContainer } from 'react-toastify'

// Same breakpoint as Tailwind's lg (sidebar layout).
const DESKTOP = '(min-width: 64rem)'
const subscribe = (onChange: () => void) => {
  const query = matchMedia(DESKTOP)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const isDesktop = () => matchMedia(DESKTOP).matches

// App-wide toasts: call toast.success / toast.error from 'react-toastify' anywhere.
// Phone: bottom centre, lifted above the 72px bottom nav. Desktop: top right.
export const Toaster = () => {
  const desktop = useSyncExternalStore(subscribe, isDesktop)
  return (
    <ToastContainer
      position={desktop ? 'top-right' : 'bottom-center'}
      autoClose={5000}
      transition={Bounce}
      hideProgressBar={false}
      closeOnClick={false}
      pauseOnFocusLoss
      pauseOnHover
      draggable
      newestOnTop={false}
      rtl={false}
      icon={({ type }) => (
        <span
          className={`grid size-8 place-items-center rounded-full ${type === 'error' ? 'bg-danger/10 text-danger' :  'text-primary'}`}
        >
          {type === 'error' ? <CircleAlert size={18} /> : <CircleCheck size={18} />}
        </span>
      )}
      toastClassName="rounded-2xl! font-sans! text-ink! font-semibold"
      progressClassName={({ type, defaultClassName } = {}) =>
        `${defaultClassName} ${type === 'error' ? 'bg-danger!' : 'bg-primary!'}`
      }
      // ! beats toastify's own phone rule, which pins the container to the screen's bottom edge.
      // and its full-width rule (≤480px), so the toast keeps a 16px gutter each side.
      className="max-lg:bottom-[calc(80px+env(safe-area-inset-bottom))]! max-[480px]:left-4! max-[480px]:w-[calc(100vw-2rem)]!"
    />
  )
}
