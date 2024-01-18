export default function ViewHeader({darkModeActive, invoice, handleDeleteModal, onMarkAsPaid, setOpenEditInvoice}){


    return(
        <section className={`${darkModeActive ? 'bg-brand-three' : 'bg-[white]'} flex justify-between  rounded-[8px] px-[32px] py-[24px] mt-[30px]`}>

            <div className="flex items-center justify-between sm:justify-start  gap-[20px] min-w-[100%] sm:min-w-[0px]">

                <p className={`${darkModeActive ? 'text-brand-five' : 'text-[#858BB2]'}`}>Status</p>

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

                    <div className={`${darkModeActive ? 'bg-[#dfe3fa14]' : 'bg-[#373b531c]'} py-[10px] w-[104px] flex items-center justify-center bg-[#dfe3fa14] rounded-[6px] gap-[8px] order-5 lg:order-5`}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">
                            <circle className={`${darkModeActive ? 'fill-brand-five' : 'fill-[#373B53]'} `} cx="4" cy="4" r="4" />
                        </svg>

                        <span className={`${darkModeActive ? 'text-brand-five' : 'text-[#373B53]'}  heading-s-var`}>
                            Draft
                        </span>

                    </div>

                )}

            </div>


            <div className="hidden sm:flex items-center gap-[8px]">

                <button onClick={() => setOpenEditInvoice(true)} className={`${darkModeActive ? 'bg-brand-eight text-brand-five hover:bg-[white] hover:text-brand-seven' : 'bg-[#F9FAFE] text-brand-seven hover:bg-brand-five '} px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Edit</button>
                <button onClick={handleDeleteModal} className={`bg-[#EC5757] text-[white] hover:bg-[#FF9797] px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Delete</button>
                <button onClick={() => onMarkAsPaid(invoice._id)} className={`bg-[#7C5DFA] hover:bg-brand-two text-[white] px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Mark as paid </button>

            </div>


        </section>
    )
}