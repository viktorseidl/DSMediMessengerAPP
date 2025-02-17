import { useEffect, useState } from "react"


 const PersistentScreen = ({ children }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setIsReady(true)
    
      return () => {
        setIsReady(false)
      }
    }, [])

    if (!isReady) return null;

    return <>{children}</>;
    
}

export default PersistentScreen