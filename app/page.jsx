"use client"

import { useContext, useState, useEffect} from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { SuccessNotificationContext } from "./context/notificationContext";
import { ErrorNotificationContext } from "./context/notificationContext";

import MainWrapper from "./components/mainWrapper";
import MainHeader from "./components/mainHeader";
import NoInvoicesSVG from "./components/noInvoicesSVG";
import Link from "next/link";
import SuccessNotification from "./components/lib/successNotification";
import ErrorNotification from "./components/lib/errorNotification";
import CreateInvoice from "./createInvoice";
import Invoices from "./components/index/invoices";
import InvoicesSkeleton from "./components/index/invoicesSkeleton";

export default function Page() {

	//Context
	const { darkModeActive } = useContext(DarkModeContext);

	//States
	const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
	const [invoices, setInvoices] = useState([]);
	const [retrievedInvoices, setRetrievedInvoices] = useState([]); //Keep track of invoices fetched from api
	const {setShowSuccess} = useContext(SuccessNotificationContext);
	const {setShowError} = useContext(ErrorNotificationContext);
	const [reRender, setReRender] = useState(false);
	const [loading, setLoading] = useState(true);

	
	//Fetch all the invoices from db
	useEffect(() => {

		const fetchInvoices = async () => {

			try {

				const res = await fetch('/api/invoices/index');
				const retrievedInvoices = await res.json();


				//Calc payment due date and add formatted creation date and due date to object.
				retrievedInvoices.data.forEach(invoice => {

					const invoiceCreationDate = new Date(invoice.dateCreated);
					const paymentDueDate = new Date(invoiceCreationDate);
					paymentDueDate.setDate(invoiceCreationDate.getDate() + invoice.paymentTerms);

					const formattedPaymentDueDate = paymentDueDate.toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					});

					const formattedInvoiceCreationDate = invoiceCreationDate.toLocaleDateString('en-GB', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					});

					invoice.invoiceCreationDateFormatted = formattedInvoiceCreationDate;
					invoice.invoicePaymentDueDateFormatted = formattedPaymentDueDate;

				});

				setInvoices(retrievedInvoices.data);
				setRetrievedInvoices(retrievedInvoices.data);
				setLoading(false);


			} catch(err) {

			alert('error fetching');
			console.log(err)
			
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
				setInvoices={setInvoices}
				retrievedInvoices={retrievedInvoices}
			/>


			{/* If loading display skeleton, when loaded display invoices if any in DB. If none in DB display SVG */}
			{loading ? (

				<section className="mt-[36px] sm:mt-[64px] mb-[60px] flex flex-col gap-[16px]">
					<InvoicesSkeleton loadingInvoices={7} />
				</section>

			) : (
				<>
    	    		{invoices.length > 0 ? (

    	    		  	<section className="mt-[36px] sm:mt-[64px] mb-[60px] flex flex-col gap-[16px]">

							{invoices.map((invoice, index) => (
            		            <Link key={index} href={`/view/${invoice._id}`}>
									<Invoices
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
				</>

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
