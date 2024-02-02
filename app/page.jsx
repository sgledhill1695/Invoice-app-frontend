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
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [paginateLoading, setPaginateLoading] = useState(false);
	const [paginationError, setPaginationError] = useState(false);
	const [allInvoicesRetrieved, setAllInvoicesRetrieved] = useState(false);
	const [filters, setFilters] = useState([]);
	const [fetchError, setFetchError] = useState(false);


	//Fetch all the invoices from db
	useEffect(() => {

		const fetchInvoices = async () => {

			try {

				const res = await fetch(`/api/invoices/index?page=1&pageSize=8`);
				const retrievedInvoices = await res.json();

				console.log(retrievedInvoices);

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
				setTotalPages(retrievedInvoices.data.totalPages)
				setLoading(false);

			} catch(err) {
				console.log(err);
				setFetchError(true);
			}
		};

		fetchInvoices();
		setReRender(false);

	}, [reRender]);


    //Open create invoice sidebar
	const handleOpenCreateInvoice = () => {
		setOpenCreateInvoice(true);
	};

	//Inifinite Scroll Pagination
	//Check for the user reaching the bottom of the viewport
	const handleScroll = () => { 

		if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || paginateLoading) {
			return;
		} else {
			setPaginateLoading(true);
			setCurrentPage(currentPage => currentPage + 1);
		};
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [paginateLoading]);

	//Fetch more invoices when current page is incremmented by 1
	useEffect(() => {

		const fetchMoreInvoices = async () => {

			try {

				if(filters.length > 0){

					const fetchResponse = await fetch(`/api/invoices/index?page=${currentPage}&pageSize=8&filters=${filters.join(',')}`);

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



					const fetchResponse = await fetch(`/api/invoices/index?page=${currentPage}&pageSize=8`);

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

			if (currentPage >= totalPages) {
				setPaginateLoading(false);
				setAllInvoicesRetrieved(true);
			} else {
				fetchMoreInvoices();
			};
		};


	}, [currentPage]);

	//Fetch filtered invoices
	useEffect(() => {

		setCurrentPage(1);

		const fetchFilteredInvoices = async () => {

			try{

				const filterResponse = await fetch(`/api/invoices/index?page=1&pageSize=8&filters=${filters.join(',')}`);
				const filteredInvoices = await filterResponse.json();

				console.log('filtered Invoices below');
				console.log(filteredInvoices);

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

			} catch(err){

				setPaginateLoading(false);
				setPaginationError(true);

			}
		}


		if(filters.length > 0){
			fetchFilteredInvoices();
		} else {
			setReRender(true);
		};

	},[filters]);


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

										{invoices.map((invoice, index) => (
											<Link key={index} href={`/view/${invoice._id}`}>
												<Invoices
													invoice={invoice}
												/>
											</Link>
										))}

										<div className="flex justify-center">
											<PaginationLoader paginateLoading={paginateLoading} />

											{paginationError && (

												<PaginationError darkModeActive={darkModeActive} />
											)}


												{allInvoicesRetrieved && (
												    <p className={`${darkModeActive && 'text-[white]'}`}>
													  	All invoices have been retrieved!
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
