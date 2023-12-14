"use client"
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import MainWrapper from "./components/mainWrapper";
import MainHeader from "./components/mainHeader";
import NoInvoicesSVG from "./components/noInvoicesSVG";
import Invoice from "./components/index/invoice";
import Link from "next/link";
import CreateInvoice from "./createInvoice";

export default function Page() {

	//Context
	const { darkModeActive } = useContext(DarkModeContext);

	//States
	const [openCreateInvoice, setOpenCreateInvoice] = useState(false);

    //Test data
	const [invoices, setInvoices] = useState([
		{
			id: 'RT3080',
			dueDate: '19 Jan 2024',
			name: 'Jensen Huang',
			date: '1,800.90',
			status: 'paid'
		},
		{
			id: 'XM9141',
			dueDate: '20 Sep 2024',
			name: 'Jensen Huang',
			date: '1,800.90',
			status: 'pending'
		},
		{
			id: 'RG0314',
			dueDate: '12 Mar 2024',
			name: 'John Morrison',
			date: '14,002.33',
			status: 'draft'
		}


	]);

  return (
	<>

    	<MainWrapper>

    	    <MainHeader
				setOpenCreateInvoice={setOpenCreateInvoice}
			/>


    	    {invoices.length > 0 ? (

    	      	<section className="mt-[36px] sm:mt-[64px] mb-[60px] flex flex-col gap-[16px]">

					{invoices.map((invoice, index) => (

                        <Link key={index} href={`view/${invoice._id}`}>
							<Invoice
								invoice={invoice}
							/>
						</Link>

					))}


    	      	</section>

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

		<CreateInvoice
			openCreateInvoice={openCreateInvoice}
		/>
	</>
  )
}
