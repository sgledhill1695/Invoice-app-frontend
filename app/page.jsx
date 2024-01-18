"use client"

import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { SuccessNotificationContext } from "./context/notificationContext";
import { ErrorNotificationContext } from "./context/notificationContext";

import MainWrapper from "./components/mainWrapper";
import MainHeader from "./components/mainHeader";
import NoInvoicesSVG from "./components/noInvoicesSVG";
import Invoice from "./components/index/invoice";
import Link from "next/link";
import SuccessNotification from "./components/lib/successNotification";
import ErrorNotification from "./components/lib/errorNotification";
import CreateInvoice from "./createInvoice";

export default function Page() {

	//Context
	const { darkModeActive } = useContext(DarkModeContext);

	//States
	const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
	const [invoices, setInvoices] = useState([]);
	const {setShowSuccess} = useContext(SuccessNotificationContext);
	const {setShowError} = useContext(ErrorNotificationContext);
	const [reRender, setReRender] = useState(false);


	//Fetch all the invoices from db
	useEffect(() => {

		const fetchInvoices = async () => {

			try {

				const res = await fetch('/api/invoices/index');
				const retrievedInvoices = await res.json();

				setInvoices(retrievedInvoices.data);


			} catch(err) {

			alert('error fetching');
			
			}
		};

		fetchInvoices();

		setReRender(false);

	}, [reRender]);


    //Open create invoice sidebar
	const handleOpenCreateInvoice = () => {

		setOpenCreateInvoice(true);

	};

  return (
	<>

    	<MainWrapper>			

    	    <MainHeader
				handleOpenCreateInvoice={handleOpenCreateInvoice}
				invoices={invoices}
			/>


    	    {invoices.length > 0 ? (

    	      	<section className="mt-[36px] sm:mt-[64px] mb-[60px] flex flex-col gap-[16px]">

					{invoices.map((invoice, index) => (

                        <Link key={index} href={`/view/${invoice._id}`}>
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



			<SuccessNotification/>
			<ErrorNotification/>
			
    	</MainWrapper>

 		<CreateInvoice
			openCreateInvoice={openCreateInvoice}
			setOpenCreateInvoice={setOpenCreateInvoice}
			setInvoices={setInvoices}
			setShowSuccess={setShowSuccess}
			setShowError={setShowError}
			setReRender={setReRender}
		/>

	</>
  )
}
