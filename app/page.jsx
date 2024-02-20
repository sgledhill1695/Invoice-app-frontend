"use client"

import { useContext, useState, useEffect, useRef, useCallback} from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { SuccessNotificationContext } from "./context/notificationContext";
import { ErrorNotificationContext } from "./context/notificationContext";
import useFetchInvoices from './hooks/useFetchInvoices';
import { formatDate, calcPaymentDueDate } from "./components/functions/functions";

import MainWrapper from "./components/mainWrapper";
import MainHeader from "./components/mainHeader";
import NoInvoicesSVG from "./components/noInvoicesSVG";
import Link from "next/link";
import SuccessNotification from "./components/lib/successNotification";
import ErrorNotification from "./components/lib/errorNotification";
import CreateInvoice from "./createInvoice";
import Invoices from "./components/index/invoices";
import InvoicesSkeleton from "./components/index/invoicesSkeleton";
import PaginationLoader from "./components/lib/paginationLoader";
import FetchError from "./components/lib/fetchError";
import PaginationError from "./components/lib/paginationError";

export default function Page() {

	//Context
	const { darkModeActive } = useContext(DarkModeContext);

	//States
	const [openCreateInvoice, setOpenCreateInvoice] = useState(false);
	const [invoices, setInvoices] = useState([]);
	const [retrievedInvoices, setRetrievedInvoices] = useState([]); //Keep track of invoices fetched from api through renders
	const {setShowSuccess} = useContext(SuccessNotificationContext);
	const {setShowError} = useContext(ErrorNotificationContext);
	const [reRender, setReRender] = useState(false);
	const [loading, setLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [paginateLoading, setPaginateLoading] = useState(false);
	const [paginationError, setPaginationError] = useState(false);
	const [allInvoicesRetrieved, setAllInvoicesRetrieved] = useState(false);
	const [filters, setFilters] = useState([]);
	const [fetchError, setFetchError] = useState(false);

	//Fetch all invoices
	useFetchInvoices(filters, reRender, setReRender, invoices, setInvoices, setLoading, setCurrentPage, setAllInvoicesRetrieved, setRetrievedInvoices, setTotalPages, setFetchError);

	//Refs
	const observer = useRef();

    //Open create invoice sidebar
	const handleOpenCreateInvoice = () => {
		setOpenCreateInvoice(true);
	};

	const lastInvoiceRef = useCallback(node => {

		//If currently fetching data return
		if (paginateLoading) return

		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {

				if(currentPage < totalPages){

					setAllInvoicesRetrieved(false);
					setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
					setPaginateLoading(true);

				} else if(currentPage === totalPages) {

					setAllInvoicesRetrieved(true);

				}
				
			}

		})

		if (node) observer.current.observe(node);

	}, [paginateLoading, totalPages, allInvoicesRetrieved]);

	//When user reaches last invoice, fetch 8 more invoices
	useEffect(() => {

		const fetchMoreInvoices = async () => {

			try {

				if (filters.length > 0) {

					const fetchResponse = await fetch(`/api/invoices/all?page=${currentPage}&pageSize=8&filters=${filters.join(',')}`);

					const moreInvoices = await fetchResponse.json();

					moreInvoices.data.invoices.forEach(invoice => {
						const paymentDueDate = calcPaymentDueDate(invoice.dateCreated, invoice.paymentTerms)
						invoice.invoiceCreationDateFormatted = formatDate(invoice.dateCreated);
						invoice.invoicePaymentDueDateFormatted = formatDate(paymentDueDate);
					});

					const updatedInvoices = [...invoices, ...moreInvoices.data.invoices];

					setInvoices(updatedInvoices);
					setRetrievedInvoices(updatedInvoices);
					setPaginateLoading(false);

				} else {

					const fetchResponse = await fetch(`/api/invoices/all?page=${currentPage}&pageSize=8`);

					const moreInvoices = await fetchResponse.json();

					moreInvoices.data.invoices.forEach(invoice => {
						const paymentDueDate = calcPaymentDueDate(invoice.dateCreated, invoice.paymentTerms)
						invoice.invoiceCreationDateFormatted = formatDate(invoice.dateCreated);
						invoice.invoicePaymentDueDateFormatted = formatDate(paymentDueDate);
					});

					const updatedInvoices = [...invoices, ...moreInvoices.data.invoices];

					setInvoices(updatedInvoices);
					setRetrievedInvoices(updatedInvoices);
					setPaginateLoading(false);
				}

			}
			catch (err) {
				setPaginateLoading(false);
				setFetchError(true);
			}
		}

		if(currentPage > 1){
			fetchMoreInvoices();
		}

	}, [currentPage])

  	return (
		<>
    		<MainWrapper>	

				{fetchError ? (

					<FetchError
						setFetchError={setFetchError}
						darkModeActive={darkModeActive}
						setReRender={setReRender}
					/>

				) : (
					<>

						<MainHeader
							handleOpenCreateInvoice={handleOpenCreateInvoice}
							invoices={invoices}
							setInvoices={setInvoices}
							retrievedInvoices={retrievedInvoices}
							filters={filters}
							setFilters={setFilters}
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

											{invoices.map((invoice, index) => {

												if(invoices.length === index + 1){

													return(

														<Link key={index} ref={lastInvoiceRef} href={`/view/${invoice._id}`}>
															<Invoices 
																invoice={invoice}
															/>
														</Link>
													)
													
												} else {

													return (
														<Link key={index} href={`/view/${invoice._id}`}>
															<Invoices
																invoice={invoice}
															/>
														</Link>
													)
												}
											})}

											<div className="flex justify-center">
												<PaginationLoader paginateLoading={paginateLoading} />

												{paginationError && (

													<PaginationError darkModeActive={darkModeActive} />
												)}


													{allInvoicesRetrieved ? (
														<p className={`${darkModeActive && 'text-[white]'} flex align-middle gap-2`}>
															<svg xmlns="http://www.w3.org/2000/svg" className="w-[15px] fill-[#33D69F]" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
															<span>All invoices have been retrieved!</span>
													  	</p>
												  	): (
														<>
														
														</>
													)
													}
											</div>

										</section>

									) : (

										<section className="flex flex-col items-center mt-[100px] sm:mt-[130px] lg:mt-[162px] gap-[66px]">
										  	<NoInvoicesSVG />
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
