"use client"
import Image from "next/image";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

export default function Sidebar(){


    const {darkModeActive, setDarkModeActive} = useContext(DarkModeContext);

    //Toggle light and dark mode
    const handleToggleMode = () => {

        if(!darkModeActive){

            setDarkModeActive(true);

            const darkModeActiveLocalStorage = true;

            localStorage.setItem('Dark Mode Active', 'true');
        
        } else {

            setDarkModeActive(false);

            localStorage.removeItem("Dark Mode Active")
        }


        //darkModeActive ? setDarkModeActive(false) : setDarkModeActive(true);
    };

    
    return(
        <aside className={`${darkModeActive ? 'bg-[#141625]' : 'bg-[#F8F8FB]'}`}>

            <div className={`${darkModeActive ? 'bg-dark-sidebar' : 'bg-light-sidebar'} relative lg:fixed z-20 flex lg:flex-col w-[100vw] lg:min-h-[280px] lg:w-[103px] h-[80px] lg:h-[100%]  lg:rounded-br-[20px] lg:rounded-tr-[20px] justify-between`}>

                <div className="bg-brand-dark-purple flex justify-center items-center min-w-[80px] lg:min-w-0 lg:h-[103px] rounded-br-[20px] rounded-tr-[20px] ">

                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="38" viewBox="0 0 40 38" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.6942 0.292175L20 18.9999L29.3058 0.292175C35.6645 3.64073 40 10.314 40 17.9999C40 29.0456 31.0457 37.9999 20 37.9999C8.9543 37.9999 0 29.0456 0 17.9999C0 10.314 4.33546 3.64073 10.6942 0.292175Z" fill="white" />
                    </svg> 

                </div>


                <div className="flex lg:flex-col items-center gap-[32px]">

                    {darkModeActive ? (


                        <svg onClick={handleToggleMode} className="hover:cursor-pointer fill-[#7E88C3] hover:fill-[#DFE3FA]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                            <path d="M280 24V0H232V24 88v24h48V88 24zm157 84.9l17-17L420 58l-17 17-45.3 45.3-17 17 33.9 33.9 17-17L437 108.9zM108.9 75L92 58 58 92l17 17 45.3 45.3 17 17 33.9-33.9-17-17L108.9 75zM24 232H0v48H24 88h24V232H88 24zm400 0H400v48h24 64 24V232H488 424zM154.2 391.8l17-17-33.9-33.9-17 17L75 403.1 58 420 92 454l17-17 45.3-45.3zm237.6-33.9l-17-17-33.9 33.9 17 17L403.1 437l17 17L454 420l-17-17-45.3-45.3zM280 424V400H232v24 64 24h48V488 424zm-24-56a112 112 0 1 0 0-224 112 112 0 1 0 0 224z"/>
                        </svg>


                        ) : (

                        <svg onClick={handleToggleMode} className="hover:cursor-pointer fill-[#7E88C3] hover:fill-[#DFE3FA]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z" />
                        </svg>

                    )}




                    <div className="border-l-[1px] lg:border-t-[1px] border-[#494E6E] min-h-[100%] lg:min-h-0 lg:w-[100%] flex justify-center items-center">
                        <Image
                            src="/assets/images/image-avatar.jpg"
                            width={40}
                            height={40}
                            alt={"picture of the user"}
                            quality={100}
                            priority={true}
                            className="rounded-[40px] lg:my-[24px] mx-[24px] lg:mx-0 max-h-[40px]"
                        />
                    </div>


                </div>

            </div>

        </aside>

    )
}