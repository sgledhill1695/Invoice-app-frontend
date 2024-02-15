"use client"

import { useContext, useState, useEffect, useRef, useCallback} from "react";
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
import PaginationLoader from "./components/lib/paginationLoader";
import FetchError from "./components/lib/fetchError";
import PaginationError from "./components/lib/paginationError";

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
	const [totalPages, setTotalPages] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [paginateLoading, setPaginateLoading] = useState(false);
	const [paginationError, setPaginationError] = useState(false);
	const [allInvoicesRetrieved, setAllInvoicesRetrieved] = useState(false);
	const [filters, setFilters] = useState([]);
	const [fetchError, setFetchError] = useState(false);


	//Refs
	const observer = useRef();

	//Fetch all the invoices from db
	useEffect(() => {

		setCurrentPage(1);
		setAllInvoicesRetrieved(false);

		//Initial function to fetch invoices from backend
		const fetchInvoices = async () => {


			try {

				const res = await fetch(`/api/invoices/all?page=1&pageSize=8`);

				if(res.status === 200){

					const retrievedInvoices = await res.json();

					//Calc payment due date and add formatted creation date and due date to object.
					retrievedInvoices.data.invoices.forEach(invoice => {

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

					

					setInvoices(retrievedInvoices.data.invoices);
					setRetrievedInvoices(retrievedInvoices.data.invoices);
					setTotalPages(retrievedInvoices.data.totalPages);
					setLoading(false);

				} else {

					setFetchError(true);
				}

				

			} catch(err) {
				setFetchError(true);
			}
		};

		//function to fetch invoices if a filter is active
		const fetchFilteredInvoices = async () => {

			try {

				const filterResponse = await fetch(`/api/invoices/all?page=1&pageSize=8&filters=${filters.join(',')}`);
				const filteredInvoices = await filterResponse.json();

				filteredInvoices.data.invoices.forEach(invoice => {

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

				setInvoices(filteredInvoices.data.invoices);
				setRetrievedInvoices(filteredInvoices.data.invoices);
				setTotalPages(filteredInvoices.data.totalPages);
				setLoading(false);

			} catch (err) {

				setPaginateLoading(false);
				setFetchError(true);

			}
		};

		if(filters.length > 0){

			fetchFilteredInvoices();

		} else {

			fetchInvoices();

		}

		setReRender(false);

	}, [reRender, filters]);

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

					setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
					setPaginateLoading(true);
					fetchMoreInvoices();

				} else {

					setAllInvoicesRetrieved(true);

				}
				
			}

		})

		if (node) observer.current.observe(node);

	}, [paginateLoading, totalPages]);

	useEffect(() => {

		const fetchMoreInvoices = async () => {

			try {

				if (filters.length > 0) {

					const fetchResponse = await fetch(`/api/invoices/all?page=${currentPage}&pageSize=8&filters=${filters.join(',')}`);

					const moreInvoices = await fetchResponse.json();

					moreInvoices.data.invoices.forEach(invoice => {

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

					const updatedInvoices = [...invoices, ...moreInvoices.data.invoices];

					setInvoices(updatedInvoices);
					setRetrievedInvoices(updatedInvoices);
					setPaginateLoading(false);

				} else {

					const fetchResponse = await fetch(`/api/invoices/all?page=${currentPage}&pageSize=8`);

					const moreInvoices = await fetchResponse.json();

					moreInvoices.data.invoices.forEach(invoice => {

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


													{allInvoicesRetrieved && (
															<p className={`${darkModeActive && 'text-[white]'} flex align-middle gap-2`}>
																<svg xmlns="http://www.w3.org/2000/svg" className="w-[15px] fill-[#33D69F]" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
																<span>All invoices have been retrieved!</span>
													  	</p>
												  	)}
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
