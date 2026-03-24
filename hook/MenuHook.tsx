import { useContext } from "react"
import { MenuContext } from "../context/MenuContext"

const useMenu = () => {
    const context = useContext(MenuContext);

    if(!context) {
        throw new Error("useMenu must be used within a MenuProvider")
    }

    return context;
}

export default useMenu