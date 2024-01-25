import { DarkModeContext } from "../context/darkModeContext";
import { useContext } from "react";

import InvoiceFilter from "./lib/invoiceFilter";

export default function MainHeader({handleOpenCreateInvoice, invoices, setInvoices, retrievedInvoices}){

    const { darkModeActive } = useContext(DarkModeContext);


    return(
        
            <div className="flex items-center justify-between">

                <div className="flex flex-col">
                    <h1 className={`${darkModeActive ? 'text-[white]' : 'brand-eight'} heading-m sm:heading-l `}>Invoices</h1>
                    <p className={`${darkModeActive ? 'text-brand-five' : 'text-[#888EB0]'} hidden sm:flex`}>There are {invoices.length} total invoices</p>
                    <p className={`${darkModeActive ? 'text-brand-five' : 'text-[#888EB0]'} sm:hidden`}>7 invoices</p>
                </div>

                <div className="flex items-center gap-[40px]">

                    <InvoiceFilter
                        invoices={invoices}
                        setInvoices={setInvoices}
                        retrievedInvoices={retrievedInvoices}
                    />

                    {/* Large screen button */}
                    <button onClick={handleOpenCreateInvoice} className="bg-brand-one py-[8px] ps-[8px] pe-[17px] text-[white] gap-[16px] items-center rounded-[24px] grow-0 max-h-[48px] hidden sm:flex hover:bg-brand-two">
                        <div className="p-[10px] rounded-[100px] bg-[white]">
                            <svg width="11" className="fill-brand-one" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z" fillRule="nonzero" /></svg>
                        </div>
                        New Invoice
                    </button>

                    {/* Small screen button */}
                    <button onClick={handleOpenCreateInvoice} className="bg-brand-one hover:bg-brand-two py-[8px] ps-[8px] pe-[17px] text-[white] gap-[16px] items-center rounded-[24px] grow-0 max-h-[48px] flex sm:hidden ">
                        <div className="p-[10px] rounded-[100px] bg-[white]">
                            <svg width="11" className="fill-brand-one" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z" fillRule="nonzero" /></svg>
                        </div>
                        New
                    </button>

                </div>

            </div>

    )
}