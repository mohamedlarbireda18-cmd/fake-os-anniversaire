import { useState } from 'react'
import BootSequence from './components/system/BootSequence'
import Desktop from './components/desktop/Desktop'
import { useClickSound } from './hooks/useClickSound'

function App() {
  const [bootComplete, setBootComplete] = useState(false)
  
  // Active le son de clic
  useClickSound()

  if (!bootComplete) {
    return <BootSequence onComplete={() => setBootComplete(true)} />
  }

  return <Desktop />
}

export default App