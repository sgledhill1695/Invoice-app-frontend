import { DarkModeContext } from "../context/darkModeContext";
import { useContext } from "react";

export default function MainWrapper({children}){

    const { darkModeActive } = useContext(DarkModeContext);

    return(

        <main className={`${darkModeActive ? 'bg-[#141625]' : 'bg-[#F8F8FB]'} min-h-[100vh]`}>
            <div className="lg:w-[730px] mt-[36px] sm:mt-[62px] lg:mt-[70px] mx-[3%] sm:mx-[5%] lg:m-auto">

                {children}

            </div>
        </main>

    )
}