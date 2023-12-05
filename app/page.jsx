"use client"
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import MainWrapper from "./components/mainWrapper";
import MainHeader from "./components/mainHeader";
import NoInvoicesSVG from "./components/noInvoicesSVG";

export default function Index() {

    const {darkModeActive} = useContext(DarkModeContext);
    const [invoices, setInvoices] = useState([]);

  return (

    	<MainWrapper>

    	    <MainHeader/>

    	    {invoices.length > 0 ? (
    	      	<>

    	      	</>
    	    ) : (
					<section className="flex flex-col items-center mt-[100px] sm:mt-[130px] lg:mt-[162px] gap-[66px]">
    	      		  	<NoInvoicesSVG/>
						<div className="flex flex-col items-center gap-[13px]">
							<h3 className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} heading-m`}>There is nothing here</h3>
						  	<p className={`${darkModeActive ? 'text-[white]' : 'text-brand-six'}  max-w-[193px] text-center`}>
								Create an invoice by clicking the New Invoice button and get started.
							</p>
						</div>
    	      		</section>
    	    )}

    	</MainWrapper>

  )
}
