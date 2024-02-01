import { Fragment, useContext, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { DarkModeContext } from '@/app/context/darkModeContext'


export default function InvoiceFilter({invoices, setInvoices, retrievedInvoices, filters, setFilters}) {

    const {darkModeActive} = useContext(DarkModeContext);

    //States
    const [checkedFilters, setCheckedFilters] = useState([])

    const handleFilter = (filter) => {



        if(checkedFilters.includes(filter)){


            const updatedFilters = checkedFilters.filter(cFilter => {
                return cFilter != filter;
            });

            setCheckedFilters(updatedFilters);
            setFilters(updatedFilters)


/*             if(updatedFilters.length < 1){

                setInvoices(retrievedInvoices);

            } else {

                const filteredInvoices = retrievedInvoices.filter(invoice => {

                    return updatedFilters.includes(invoice.status);
                })

                setInvoices(filteredInvoices);

            }
 */

        } else {

            const activeFilters = [...checkedFilters];
            activeFilters.push(filter);
            setCheckedFilters(activeFilters);
            setFilters(activeFilters);

/*             const filteredInvoices = retrievedInvoices.filter(invoice => {
                return activeFilters.includes(invoice.status);
            })

            setInvoices(filteredInvoices);
 */            
        }

    }

    return (
        <Popover className="relative">
            <Popover.Button className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} heading-s-var flex gap-[14px]  items-center`}>
                <span className='hidden sm:flex '>Filter By Status</span>
                <span className='sm:hidden'>Filter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                    <path d="M1 1L5.2279 5.2279L9.4558 1" stroke="#7C5DFA" strokeWidth="2" />
                </svg>
            </Popover.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                    <div className={`${darkModeActive ? 'bg-[#1E2139]' : 'bg-white'} w-screen max-w-[192px] flex-auto overflow-hidden rounded-[8px]  text-sm leading-6 shadow-lg`}>
                        <div className="p-[24px] flex flex-col gap-[16px]">

                            <div className='flex items-center gap-[13px]'>
                                <input
                                    onChange={() => handleFilter('draft')}
                                    id="draft-input"
                                    aria-describedby="candidates-description"
                                    name="draft-input"
                                    type="checkbox"
                                    checked={checkedFilters.includes('draft')}
                                    className="h-4 w-4 rounded border-gray-300 text-[#7C5DFA]"
                                />
                                <p className={`${darkModeActive ? 'text-[white]' : 'text-[#0C0E16]'}  0.93rem font-bold`}>Draft</p>
                            </div>

                            <div className='flex items-center gap-[13px]'>
                                <input
                                    onChange={() => handleFilter('pending')}
                                    id="candidates"
                                    aria-describedby="candidates-description"
                                    name="candidates"
                                    type="checkbox"
                                    checked={checkedFilters.includes('pending')}
                                    className="h-4 w-4 rounded border-gray-300 text-[#7C5DFA]"
                                />
                                <p className={`${darkModeActive ? 'text-[white]' : 'text-[#0C0E16]'}  0.93rem font-bold`}>Pending</p>
                            </div>


                            <div className='flex items-center gap-[13px]'>
                                <input
                                    onChange={() => handleFilter('paid')}
                                    id="candidates"
                                    aria-describedby="candidates-description"
                                    name="candidates"
                                    type="checkbox"
                                    checked={checkedFilters.includes('paid')}
                                    className="h-4 w-4 rounded border-gray-300 text-[#7C5DFA]"
                                />
                                <p className={`${darkModeActive ? 'text-[white]' : 'text-[#0C0E16]'}  0.93rem font-bold`}>Paid</p>
                            </div>

                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    )
}
