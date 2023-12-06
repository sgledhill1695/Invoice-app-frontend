import { useContext } from "react";
import { DarkModeContext } from "@/app/context/darkModeContext";

export default function Invoice ({invoice}){

    const { darkModeActive } = useContext(DarkModeContext);


    return(
        <div className={`${darkModeActive ? 'bg-brand-three' : 'bg-[white]'}  shadow-md py-[27px] px-[24px] flex items-center justify-between rounded-[8px] hover:cursor-pointer hover:border-[1px] hover:border-brand-one gap-x-[100px] sm:gap-x-0 gap-y-[24px] sm:gap-y-0 flex-wrap`}>

            <h4 className="text-brand-seven heading-s-var order-1 sm:order-1">
                #
                <span className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'}`}>
                    {invoice.id}
                </span>
            </h4>

            <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-six'} order-3 sm:order-2`}>
                Due {invoice.dueDate}
            </p>

            <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-six'} order-2 sm:order-3`}>
                {invoice.name}
            </p>

            <p className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight' } order-4 heading-s  heading-s-var sm:order-4`}>
                £ 1,800.90
            </p>

            {/* If invoice status paid */}
            {invoice.status === 'paid' && (

                <div className="py-[10px] w-[104px] flex items-center justify-center bg-[#33d6a015] rounded-[6px] gap-[8px] order-5 sm:order-5">

                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" fill="#33D69F" />
                    </svg>

                    <span className="text-[#33D69F] heading-s-var">
                        Paid
                    </span>

                </div>

            )}


            {/* If invoice status pending */}
            {invoice.status === 'pending' && (

                <div className="py-[10px] w-[104px] flex items-center justify-center bg-[#ff910015] rounded-[6px] gap-[8px] order-5 sm:order-5">

                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="4" fill="#FF8F00" />
                    </svg>

                    <span className="text-[#FF8F00] heading-s-var">
                        Pending
                    </span>

                </div>

            )}

            
            {/* If invoice status draft */}
            {invoice.status === 'draft' && (

                <div className={`${darkModeActive ? 'bg-[#dfe3fa14]' : 'bg-[#373b530b]'} py-[10px] w-[104px] flex items-center justify-center bg-[#dfe3fa14] rounded-[6px] gap-[8px] order-5 lg:order-5`}>

                    <svg  xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                        <circle className={`${darkModeActive ? 'fill-brand-five' : 'fill-[#373B53]'} `} cx="4" cy="4" r="4"/>
                    </svg>

                    <span className={`${darkModeActive ? 'text-brand-five' : 'text-[#373B53]'}  heading-s-var`}>
                        Draft
                    </span>

                </div>

            )}


            <svg className="hidden sm:flex sm:order-6" xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10" fill="none">
                <path d="M1 1L5 5L1 9" stroke="#7C5DFA" stroke-width="2" />
            </svg>


        </div>
    )
}