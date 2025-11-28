import { useContext } from "react"
import { SubsContext } from "../context/SubsContext"

const useSubs = () => {
    const context = useContext(SubsContext) 

    if(!context) {
        throw new Error("useSubs must be used within a SubsProvider")
    }

    return context
}

export default useSubs