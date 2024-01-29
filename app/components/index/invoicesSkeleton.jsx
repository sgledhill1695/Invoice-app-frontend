import { useContext } from "react";
import { DarkModeContext } from "@/app/context/darkModeContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


export default function InvoicesSkeleton({loadingInvoices}){

    //Context
    const { darkModeActive } = useContext(DarkModeContext);

    return(

        <>
            {Array(loadingInvoices).fill(0).map(invoice => (

                <div className={`${darkModeActive ? 'bg-brand-three' : 'bg-[white]'} grid grid-cols-2 sm:grid-cols-6 items-center justify-between shadow-md py-[27px] px-[24px] rounded-[8px]   gap-x-[100px] sm:gap-x-[25px] gap-y-[24px] sm:gap-y-0`}>

                    <h4 className="text-brand-seven heading-s-var order-1 sm:order-1 col-span-1">
                        <Skeleton baseColor={darkModeActive && "#777A92"} />
                        <span className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'}`}>

                        </span>
                    </h4>

                    <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-six'} order-3 sm:order-2 col-span-1`}>
                        <Skeleton baseColor={darkModeActive && "#777A92"} />
                    </p>

                    <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-six'} order-2 sm:order-3 col-span-1`}>
                        <Skeleton baseColor={darkModeActive && "#777A92"} />
                    </p>

                    <p className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} order-4 heading-s  heading-s-var sm:order-4 col-span-1`}>
                        <Skeleton baseColor={darkModeActive && "#777A92"} />
                    </p>

                    <div className={`${darkModeActive ? 'bg-[#777A92]' : 'bg-[#F9FAFE]'} py-[10px] w-[104px] h-[44px] sm:h-45px] flex items-center justify-center  rounded-[6px] gap-[8px] order-5 sm:order-5`}>
                        <Skeleton />
                    </div>

                    <svg className="hidden sm:flex sm:order-6 col-span-1 justify-self-center" xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M1 1L5 5L1 9" stroke="#7C5DFA" strokeWidth="2" />
                    </svg>

                </div>

            ))}
        </>
    )
}