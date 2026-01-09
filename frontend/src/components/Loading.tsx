import { RingLoader } from 'react-spinners';
function Loading() {
  return (
<div className="flex h-screen items-center justify-center">
    <RingLoader size={90}/>
    </div>
  )
}

export default Loading