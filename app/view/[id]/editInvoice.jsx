import { Fragment, useState, useContext, forwardRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DarkModeContext } from '@/app/context/darkModeContext';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, watch } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';



export default function EditInvoice({ openEditInvoice, setOpenEditInvoice, setInvoices, invoice, params, setReRender, setShowSuccess, setShowError }) {

    //Context
    const { darkModeActive } = useContext(DarkModeContext);

    //Router
    const router = useRouter();

    //Form validation - react hook form
    const { register, handleSubmit, getValues, reset, formState: { errors }, control, setValue } = useForm();

    //Set all form fields invoice prop
    useEffect(() => {

        reset({
            'streetAddress': invoice.billFromStreet_address,
            'city': invoice.billFromCity,
            'postCode': invoice.billFromPostCode,
            'country': invoice.billFromCountry,
            'clientsName': invoice.billToName,
            'clientsEmail': invoice.billToEmail,
            'clientStreet': invoice.billToStreetAddress,
            'clientCity': invoice.billToCity,
            'clientPostCode': invoice.billToPostcode,
            'clientCountry': invoice.billToCountry,
            'productDescription': invoice.productDescription,
            });

    }, [invoice, openEditInvoice]);

    //Handle form submission save and send
    const handleUpdate = async (data) => {

        try{

            const dataToSend = { ...data, id: params.id };

            const res = await fetch('/api/invoices/edit', {
                method: 'POST',
                body: JSON.stringify(dataToSend)
            });

            if (res.status === 200) {

                setOpenEditInvoice(false);
                setShowSuccess({
                    displayed: true,
                    message: 'Invoice has been updated'
                });
                setReRender(true);

            } else if (res.status === 500) {

                setOpenEditInvoice(false);
                setShowError({
                    displayed: true,
                    message: 'Invoice could not be updated'
                });

            }

        } catch {

            setOpenEditInvoice(false);
            setShowError({
                displayed: true,
                message: 'Invoice could not be updated'
            });



        }



    }; 
    
    //FORM CSS CONTROL
    //form labels
    let labelColor = "text-brand-seven";
    if (darkModeActive) {
        labelColor = "text-brand-five"
    }

    //form Inputs
    let inputStyle = "bg-[white]  text-brand-eight border-brand-five";

    if (darkModeActive) {
        inputStyle = "bg-brand-three border-brand-four text-[white]";
    };

    //When discard, reset form state and also close the slide in
    const handleDiscard = () => {

        reset();
        setOpenEditInvoice(false);
        document.body.classList.remove('overflow-hidden');

    };

    //Intersection observer options
    const options = {
        rootMargin: '0px',
        threshold: 0,
    };

    const { ref, inView, entry } = useInView(options);

    return (
        <Transition.Root show={openEditInvoice} as={Fragment}>

            <Dialog as="div" className="relative" onClose={setOpenEditInvoice}>

                <Transition
                    show={openEditInvoice}
                    enter="transition-opacity duration-75"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed inset-0 bg-[#0000007a] h-[100%] w-[100%]"
                />

                <div className="fixed inset-0 overflow-hidden z-[20]">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left left-0 flex max-w-full lg:pl-10 pt-[80px] lg:pt-[0px]">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-[719px]">
                                    <div className={`${darkModeActive ? 'bg-brand-twelve' : 'bg-[white]'} flex h-full flex-col overflow-y-scroll lg:ps-[100px] pe-[20px] sm:rounded-tr-[20px] sm:rounded-br-[20px] pt-[30px] lg:pt-[59px] shadow-xl`}>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">

                                            <div className="h-[100%] lg:pe-[16px]">

                                                <h5 className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} heading-m`}>Edit #{invoice?._id?.slice(0, 6)}</h5>


                                                <form className="ps-[5px]">

                                                    {/* Bill from */}
                                                    <h6 className={`text-brand-one heading-s-var  mt-[46px]`}>Bill From</h6>

                                                    {/* Street address */}
                                                    <div className="mt-[24px] flex flex-col gap-[9px]">

                                                        <div className="flex justify-between">

                                                            <label className={`${labelColor}`} style={errors.streetAddress ? { color: '#EC5757' } : {}} htmlFor="streetAddress">
                                                                Street Address
                                                            </label>

                                                            {errors.streetAddress && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    can't be empty
                                                                </p>
                                                            )}

                                                        </div>


                                                        <input
                                                            {...register("streetAddress", { required: true })}
                                                            type="text"
                                                            id="streetAddress"
                                                            className={`${errors.streetAddress ? 'outline-[#EC5757]' : ''} ${inputStyle} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                        />

                                                    </div>

                                                    {/* CITY/POSTCODE/COUNTRY */}
                                                    <div className="mt-[25px] grid grid-cols-2 sm:grid-cols-3 row-span-2 sm:row-span-1 gap-[23px] sm:gap-[24px] gap-y-6">

                                                        {/* City */}
                                                        <div className="col-span-1">
                                                            <div className="flex flex-col gap-[9px]">
                                                                <div className="flex justify-between">

                                                                    <label className={`${labelColor}`} style={errors.city ? { color: '#EC5757' } : {}} htmlFor="city">
                                                                        City
                                                                    </label>

                                                                    {errors.city && (

                                                                        <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                            can't be empty
                                                                        </p>
                                                                    )}

                                                                </div>

                                                                <input
                                                                    {...register("city", { required: true })}
                                                                    type="text"
                                                                    id="city"
                                                                    className={`${errors.city ? 'outline-[#EC5757]' : ''} ${inputStyle} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var hover:cursor-pointer`}
                                                                />

                                                            </div>
                                                        </div>


                                                        {/* Post code */}
                                                        <div className="col-span-1">
                                                            <div className="flex flex-col gap-[9px]">
                                                                <div className="flex justify-between">

                                                                    <label className={`${labelColor}`} style={errors.postCode ? { color: '#EC5757' } : {}} htmlFor="postCode">
                                                                        Post Code
                                                                    </label>

                                                                    {errors.postCode?.type === "required" && (

                                                                        <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                            can't be empty
                                                                        </p>
                                                                    )}

                                                                    {errors.postCode?.type === "pattern" && (

                                                                        <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                            must be a valid postcode
                                                                        </p>
                                                                    )}

                                                                </div>

                                                                <input
                                                                    {...register("postCode",
                                                                        {
                                                                            required: true,
                                                                            pattern: {
                                                                                value: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/,
                                                                                message: 'must be a valid postcode',
                                                                            }
                                                                        })}
                                                                    type="text"
                                                                    id="postCode"
                                                                    className={`${errors.postCode ? 'outline-[#EC5757]' : ''} ${inputStyle} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two min-w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                                />

                                                            </div>
                                                        </div>

                                                        {/* Country */}
                                                        <div className="col-span-2 sm:col-span-1 flex flex-col gap-[9px]">

                                                            <div className="flex justify-between">


                                                                <label className={`${labelColor}`} style={errors.country ? { color: '#EC5757' } : {}} htmlFor="country">
                                                                    Country
                                                                </label>

                                                                {errors.country && (

                                                                    <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                        can't be empty
                                                                    </p>
                                                                )}

                                                            </div>


                                                            <input
                                                                {...register("country", { required: true })}
                                                                type="text"
                                                                id="country"
                                                                className={`${errors.country ? 'outline-[#EC5757]' : ''} ${inputStyle} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                            />

                                                        </div>

                                                    </div>

                                                    {/* BILL TO */}
                                                    <h6 className={`text-brand-one heading-s-var  mt-[46px]`}>Bill To</h6>

                                                    {/* Client's Name */}
                                                    <div className="mt-[24px] flex flex-col gap-[9px]">

                                                        <div className="flex justify-between">

                                                            <label className={`${labelColor}`} style={errors.clientsName ? { color: '#EC5757' } : {}} htmlFor="clientsName">
                                                                Client's Name
                                                            </label>

                                                            {errors.clientsName && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    can't be empty
                                                                </p>
                                                            )}

                                                        </div>


                                                        <input
                                                            {...register("clientsName", { required: true })}
                                                            type="text"
                                                            id="clientsName"
                                                            className={`${errors.clientsName ? 'outline-[#EC5757]' : ''} ${inputStyle} ${darkModeActive ? ' bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                        />

                                                    </div>

                                                    {/* Client's Email */}
                                                    <div className="mt-[24px] flex flex-col gap-[9px]">

                                                        <div className="flex justify-between">

                                                            <label className={`${labelColor}`} style={errors.clientsEmail ? { color: '#EC5757' } : {}} htmlFor="clientsEmail">
                                                                Client's Email
                                                            </label>

                                                            {errors.clientsEmail?.type === "required" && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    can't be empty
                                                                </p>
                                                            )}

                                                            {errors.clientsEmail?.type === "pattern" && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    must be a valid email address
                                                                </p>
                                                            )}


                                                        </div>


                                                        <input
                                                            {...register("clientsEmail",
                                                                {
                                                                    required: true,
                                                                    pattern: {
                                                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                                        message: 'Must be a vaild email address',
                                                                    }
                                                                })}
                                                            type="text"
                                                            id="clientsEmail"
                                                            placeholder="e.g. email@example.com"
                                                            className={`${errors.clientsEmail ? 'outline-[#EC5757]' : ''}  ${darkModeActive ? ' bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                        />

                                                    </div>

                                                    {/* Client's Street address */}
                                                    <div className="mt-[24px] flex flex-col gap-[9px]">

                                                        <div className="flex justify-between">

                                                            <label className={`${labelColor}`} style={errors.clientStreet ? { color: '#EC5757' } : {}} htmlFor="clientStreet">
                                                                Street Address
                                                            </label>

                                                            {errors.clientStreet && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    can't be empty
                                                                </p>
                                                            )}

                                                        </div>


                                                        <input
                                                            {...register("clientStreet", { required: true })}
                                                            type="text"
                                                            id="clientStreet"
                                                            className={`${errors.clientStreet ? 'outline-[#EC5757]' : ''} ${inputStyle} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                        />

                                                    </div>

                                                    {/* CLIENT'S CITY/POSTCODE/COUNTRY */}
                                                    <div className="mt-[25px] grid grid-cols-2 sm:grid-cols-3 gap-[24px]">

                                                        {/* City */}
                                                        <div className="col-span-1 flex flex-col gap-[9px]">

                                                            <div className="flex justify-between">


                                                                <label className={`${labelColor}`} style={errors.clientCity ? { color: '#EC5757' } : {}} htmlFor="clientCity">
                                                                    City
                                                                </label>

                                                                {errors.clientCity && (

                                                                    <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                        can't be empty
                                                                    </p>
                                                                )}

                                                            </div>


                                                            <input
                                                                {...register("clientCity", { required: true })}
                                                                type="text"
                                                                id="clientCity"
                                                                className={`${errors.clientCity ? 'outline-[#EC5757]' : ''} ${inputStyle} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} ${errors.clientCity ? 'border-[#EC5758]' : ''} focus:border-brand-two  w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                            />

                                                        </div>

                                                        {/* Post Code */}
                                                        <div className="col-span-1 flex flex-col gap-[9px]">

                                                            <div className="flex justify-between">


                                                                <label className={`${labelColor}`} style={errors.clientPostCode ? { color: '#EC5757' } : {}} htmlFor="clientpostCode">
                                                                    Post Code
                                                                </label>


                                                                {errors.clientPostCode?.type === "required" && (

                                                                    <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                        can't be empty
                                                                    </p>
                                                                )}

                                                                {errors.clientPostCode?.type === "pattern" && (

                                                                    <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                        must be a valid postcode
                                                                    </p>
                                                                )}

                                                            </div>


                                                            <input
                                                                {...register("clientPostCode",
                                                                    {
                                                                        required: true,
                                                                        pattern: {
                                                                            value: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]?\s*\d[A-Za-z]{2}$/,
                                                                            message: 'must be a valid postcode',
                                                                        }
                                                                    })}
                                                                type="text"
                                                                id="postCode"
                                                                className={`${errors.clientPostCode ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                            />

                                                        </div>

                                                        {/* Country */}
                                                        <div className="col-span-2 sm:col-span-1 flex flex-col gap-[9px]">

                                                            <div className="flex justify-between">

                                                                <label className={`${labelColor}`} style={errors.clientCountry ? { color: '#EC5757' } : {}} htmlFor="clientCountry">
                                                                    Country
                                                                </label>

                                                                {errors.clientCountry && (

                                                                    <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                        can't be empty
                                                                    </p>
                                                                )}

                                                            </div>


                                                            <input
                                                                {...register("clientCountry", { required: true })}
                                                                type="text"
                                                                id="clientCountry"
                                                                className={`${errors.clientCountry ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'}  focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                            />

                                                        </div>

                                                    </div>


                                                    {/* Product description */}
                                                    <div className="mt-[24px] flex flex-col gap-[9px]">

                                                        <div className="flex justify-between">

                                                            <label className={`${labelColor}`} style={errors.productDescription ? { color: '#EC5757' } : {}} htmlFor="productDescription">
                                                                Product Description
                                                            </label>

                                                            {errors.productDescription && (

                                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                                    can't be empty
                                                                </p>
                                                            )}

                                                        </div>


                                                        <input
                                                            {...register("productDescription", { required: true })}
                                                            type="text"
                                                            placeholder="e.g. Graphic Design Service"
                                                            id="productDescription"
                                                            className={`${errors.productDescription ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} ${errors.productDescription && 'border-[red]'} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                        />

                                                    </div>

                                                    {/* Floating submit buttons */}
                                                    <div className={`${inView ? 'hidden' : ''} ${darkModeActive ? 'bg-brand-four' : 'bg-[#FFF]'} ${openEditInvoice ? 'open-side-panel' : 'close-side-panel'}  fixed bottom-0 left-0 right-0 h-[110px] w-[100%] max-w-[790px] py-[30px] floating-submit flex gap-[10px] justify-between sm:rounded-br-[20px] ps-[24px] sm:ps-[55px] lg:ps-[130px] pe-[24px] sm:pe-[55px] top-shadow z-40`}>

                                                        <button onClick={handleDiscard} type="button" className="w-[80px] sm:w-[96px] bg-[#F9FAFE] rounded-[24px] text-brand-seven ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px] ">
                                                            Discard
                                                        </button>

                                                        <div className="flex gap-[8px]">


                                                            <button type="button" onClick={handleSubmit(handleUpdate)} className="w-[105px] sm:w-[134px] bg-brand-one hover:bg-brand-two rounded-[24px] text-[white] ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]">
                                                                Update
                                                            </button>

                                                        </div>
                                                    </div>

                                                    {errors.itemList && (
                                                        <p className="text-[red]">Please provide an item</p>
                                                    )}

                                                    {/* Discard/ Submit */}
                                                    <div ref={ref} className={`${!openEditInvoice && 'hidden'} mt-[39px] flex justify-between flex-wrap pb-[40px]  lg:pb-[62px]`}>

                                                        <button onClick={handleDiscard} type="button" className="w-[80px] sm:w-[96px] bg-[#F9FAFE] rounded-[24px] text-brand-seven ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px] ">
                                                            Discard
                                                        </button>

                                                        <div className="flex gap-[8px]">

                                                            <button type="button" onClick={handleSubmit(handleUpdate)} className="w-[105px] sm:w-[134px] bg-brand-one hover:bg-brand-two rounded-[24px] text-[white] ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]">
                                                                Update
                                                            </button>

                                                        </div>

                                                    </div>

                                                </form>

                                            </div>



                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
