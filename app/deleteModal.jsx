import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

export default function DeleteModal({modalOpen, setModalOpen, invoice, darkModeActive, onDelete}) {

    return (
        <Transition.Root show={modalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[black] bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className={`${darkModeActive ? 'bg-brand-three' : 'bg-white'} relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[480px] py-[34px] px-[32px] sm:py-[50px] sm:px-[48px]`}>
                                <div className="sm:flex sm:items-start">
                                    <div className="text-start">
                                        <Dialog.Title as="h3" className={`${darkModeActive ? 'text-[white]' : 'text-[#0C0E16]'} heading-m`}>
                                            Confirm Deletion
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className={`${darkModeActive ? 'text-[#DFE3FA]' : 'text-brand-six'} leading-[22px] mt-[12px]`}>
                                                Are you sure you want to delete invoice #XM9141? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-[8px]">

                                    <button onClick={() => setModalOpen(false)} className={`${darkModeActive ? 'bg-brand-eight text-brand-five hover:bg-[white] hover:text-brand-seven' : 'bg-[#F9FAFE] text-brand-seven hover:bg-brand-five '} px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Cancel</button>
                                    <button onClick={() => onDelete(invoice._id)} className={`bg-[#EC5757] hover:bg-[#FF9797] text-[white] px-[24px] py-[15px] rounded-[24px] heading-s-var`}>Delete</button>


                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
