export default function ViewInvoice({invoice, darkModeActive, handleDeleteModal, onDelete}){

    console.log(invoice)

    //CSS
    let invoiceHeader = 'text-brand-seven'
    if(darkModeActive){
        invoiceHeader = 'text-brand-five';
    };

    let invoiceData = 'text-brand-eight'
    if (darkModeActive) {
        invoiceData = 'text-[white]';
    };

    let listValues = 'text-brand-seven'
    if (darkModeActive) {
        listValues = 'text-brand-five';
    };


    return(
        <section className={`${darkModeActive ? 'bg-brand-three' : 'bg-[white]'} py-[24px] sm:py-[50px] px-[24px] sm:px-[48px] mt-[24px] mb-[100px] sm:mb-[24px] rounded-[8px]`}>
            
            
            {/* MAIN CONTAINER */}
            <div className="grid grid-cols-4">

                <div className="col-span-4 sm:col-span-3 justify-between">

                    <div className="flex flex-col gap-[7px]">
                        <h1 className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} heading-s-var `}><span className="text-brand-seven">#</span>{invoice._id?.slice(0, 6).toUpperCase()}</h1>
                        <h2 className={`${invoiceHeader}`}>{invoice?.productDescription}</h2>
                    </div>

                    <div className={`${invoiceHeader} flex flex-col gap-[4px] text-start mt-[30px] sm:hidden`}>
                        <p>{invoice?.billFromStreet_address}</p>
                        <p>{invoice?.billFromCity}</p>
                        <p>{invoice?.billFromPostCode}</p>
                        <p>{invoice?.billFromCountry}</p>
                    </div>


                        {/* SUB CONTAINER */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 justify-between gap-[40px] mt-[50px]">

                            <div className="col-span-1 flex flex-col gap-[31px]">
                                <div className="flex flex-col gap-[13px]">
                                    <h3 className={invoiceHeader}>Invoice Date</h3>
                                    <p className={`${invoiceData} heading-s-var`}>{invoice?.invoiceDate}</p>
                                </div>
                                <div className="flex flex-col gap-[13px]">
                                    <h3 className={invoiceHeader}>Payment Due</h3>
                                    <p className={`${invoiceData} heading-s-var`}>12 Mar 2023</p>
                                </div>

                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-col gap-[7px]">
                                    <h3 className={`${invoiceHeader}`}>Bill To</h3>
                                    <p className={`${invoiceData} heading-s-var mt-[6px]`}>{invoice?.billToName}</p>

                                    <div className={`${invoiceHeader} flex flex-col gap-[4px]`}>

                                        <p>{invoice?.billToStreetAddress}</p>
                                        <p>{invoice?.billToCity}</p>
                                        <p>{invoice?.billToPostcode}</p>
                                        <p>{invoice?.billToCountry}</p>

                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <div className="flex flex-col gap-[7px]">
                                    <h3 className={invoiceHeader}>Sent To</h3>
                                    <p className={`${invoiceData} heading-s-var mt-[6px]`}>{invoice?.billToEmail}</p>
                                </div>
                            </div>


                        </div>

                </div>


                <div className="col-span-1 hidden sm:flex">
                    <div className={`${invoiceHeader} flex flex-col gap-[4px] text-right `}>
                        <p>{invoice?.billFromStreet_address}</p>
                        <p>{invoice?.billFromCity}</p>
                        <p>{invoice?.billFromPostCode}</p>
                        <p>{invoice?.billFromCountry}</p>
                    </div>
                </div>

            </div>










            <div className={`${darkModeActive ? 'bg-brand-four' : 'bg-[#F9FAFE]'} py-[33px] px-[32px] items-center grid grid-cols-2 sm:grid-cols-5 mt-[44px] pb-[50px] rounded-tr-[8px] rounded-tl-[8px]`}>

                <div className="col-span-1 sm:col-span-2 text-start">
                    <p className={`${invoiceHeader} hidden sm:flex flex-col mb-[33px]`}>Item Name</p>
                    <div className="flex flex-col gap-[24px] sm:gap-[33px]">
                        {invoice?.itemList?.map(item => (
                            <div>
                                <p className={`${invoiceData} heading-s-var text-start`}>{item.itemName}</p>
                                <p className={`${darkModeActive ? 'text-brand-six' : 'text-brand-seven'} heading-s-var sm:hidden`}>{`${item.quantity} x £ ${item.price}`}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 text-center hidden sm:flex sm:flex-col">
                    <p className={`${invoiceHeader} flex flex-col gap-[4px] mb-[33px]`}>QTY.</p>
                    <div className="flex flex-col gap-[33px]">
                        {invoice?.itemList?.map(item => (
                            <p className={`${listValues} heading-s-var text-center`}>{item.quantity}</p>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 text-end hidden sm:flex sm:flex-col">
                    <p className={`${invoiceHeader} flex flex-col gap-[4px] text-end mb-[33px]`}>Price</p>
                    <div className="flex flex-col gap-[33px]">
                        {invoice?.itemList?.map(item => (
                            <p className={`${listValues} heading-s-var text-end`}>£ {item.price}</p>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 text-end">
                    <p className={`${invoiceHeader} hidden sm:flex flex-col gap-[4px] text-end mb-[33px]`}>Total</p>
                    <div className="flex flex-col gap-[33px]">
                        {invoice?.itemList?.map(item => (
                            <p className={`${darkModeActive ? 'text-[white]' : 'text-[#0C0E16]'} heading-s-var text-end`}>£ {item.total}</p>
                        ))}
                    </div>
                </div>

            </div>

            <div className={`${darkModeActive ? 'bg-[#0C0E16]' : 'bg-[#373B53]'} py-[40px] px-[48px] flex items-center justify-between rounded-bl-[8px] rounded-br-[8px]`}>
                <p className="text-[white]">Amount Due</p>
                <p className="text-[white] heading-m">£ {invoice?.total}</p>
            </div>

            {/* Floating submit buttons */}
            <div className={`${darkModeActive ? 'bg-brand-four' : 'bg-[#FFF]'} sm:hidden fixed bottom-0 left-0 right-0 h-[110px] w-[100%] py-[30px] floating-submit flex gap-[10px] justify-between ps-[24px] sm:ps-[55px] lg:ps-[155px] pe-[24px] sm:pe-[55px]`}>

                <div className="flex justify-between items-center gap-[8px] w-[100%]">

                    <button className={`${darkModeActive ? 'bg-brand-eight text-brand-five hover:bg-[white] hover:text-brand-seven' : 'bg-[#F9FAFE] text-brand-seven hover:bg-brand-five '} px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Edit</button>

                    <div className="flex gap-[5px]">
                        <button onClick={handleDeleteModal} className={`bg-[#EC5757] text-[white] hover:bg-[#FF9797] px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Delete</button>
                        <button onClick={handleDeleteModal} className={`bg-[#7C5DFA] hover:bg-brand-two text-[white] px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Mark as paid </button>
                    </div>


                </div>

            </div>



    </section>

    )
}