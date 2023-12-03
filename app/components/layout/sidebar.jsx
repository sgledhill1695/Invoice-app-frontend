"use client"
import Image from "next/image";
import { useContext } from "react";
import { DarkModeContext } from "../context/darkModeContext";

export default function Sidebar(){


    const {darkModeActive, setDarkModeActive} = useContext(DarkModeContext);

    //Toggle light and dark mode
    const handleToggleMode = () => {
        darkModeActive ? setDarkModeActive(false) : setDarkModeActive(true);
    };

    
    return(

        <aside className={`${darkModeActive ? 'bg-dark-sidebar' : 'bg-light-sidebar'} flex lg:flex-col w-[100%] lg:w-[103px] h-[80px] lg:h-[100vh]  lg:rounded-br-[20px] lg:rounded-tr-[20px] justify-between`}>

            <div className="bg-brand-dark-purple flex justify-center items-center min-w-[80px] lg:min-w-0 lg:h-[103px] rounded-br-[20px] rounded-tr-[20px]">

                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="38" viewBox="0 0 40 38" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6942 0.292175L20 18.9999L29.3058 0.292175C35.6645 3.64073 40 10.314 40 17.9999C40 29.0456 31.0457 37.9999 20 37.9999C8.9543 37.9999 0 29.0456 0 17.9999C0 10.314 4.33546 3.64073 10.6942 0.292175Z" fill="white" />
                </svg> 

            </div>


            <div className="flex lg:flex-col items-center gap-[32px]">

                {darkModeActive ? (

                    <svg onClick={handleToggleMode} className="fill-[#858BB2] hover:fill-[#DFE3FA] hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
                        <path d="M5.81724 0.899658C3.1055 0.899658 0.899414 3.10618 0.899414 5.81792C0.899414 8.52966 3.1055 10.7362 5.81724 10.7362C8.52854 10.7362 10.7351 8.53009 10.7351 5.81792C10.7351 3.10575 8.52854 0.899658 5.81724 0.899658Z"/>
                    </svg>

                    ) : (

                    <svg onClick={handleToggleMode} className="hover:cursor-pointer fill-[#7E88C3] hover:fill-[#DFE3FA]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z" />
                    </svg>

                )}




                <div className="border-l-[1px] lg:border-t-[1px] border-[#494E6E] min-h-[100%] lg:min-h-0 lg:w-[100%] flex justify-center items-center">
                    <Image
                        src="/assets/image-avatar.jpg"
                        width={40}
                        height={40}
                        alt={"picture of the user"}
                        quality={100}
                        priority={true}
                        className="rounded-[40px] lg:my-[24px] mx-[24px] lg:mx-0 max-h-[40px]"
                    />
                </div>


            </div>

        </aside>
    )
}