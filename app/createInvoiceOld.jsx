import { useInView } from 'react-intersection-observer';
import { DarkModeContext } from "./context/darkModeContext";
import { useContext, useState, useEffect } from "react";
import { useForm, useFieldArray, watch } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import currency from 'currency.js';


export default function CreateInvoiceOld({openCreateInvoice, setOpenCreateInvoice, setInvoices}){

    //Format currency to pounds
    const POUND = value => currency(value, { symbol: '', decimal: '.', separator: ',', precision: 0 });

    //Context
    const { darkModeActive } = useContext(DarkModeContext);

    //Router
    const router = useRouter();

    //Form validation - react hook form
    const { register, handleSubmit, getValues, reset, formState: {errors}, control} = useForm({
        defaultValues: {
            streetAddress: '',
            itemList: [{itemName: '', quantity: 0, price: 0, total: 0 }]
        }

    });

    const {fields, append, remove, update } = useFieldArray({
        name: 'itemList',
        control
    })    
    
    //Handle form submission save and send
    const onSaveAndSend = async (data) => {

        //calulate invoice total
        let total = 0
        data.itemList.map(item => {
            const itemTotal = parseInt(item.total)
            total = total + itemTotal;
        });

        //Add item lists to data
        const items = []
        for(let i = 0; i < data.itemList.length; i++){
            items.push(data?.[`itemList${i}`]);
        };

        //Calc line totals
        items.forEach(item => {
            item.total = item.quantity * item.price
        });

        const dataToPost = {
            status: 'pending',
            billFromStreet_address: data.streetAddress,
            billFromCity: data.city,
            billFromPostCode: data.postCode,
            billFromCountry: data.country,
            billToName: data.clientsName,
            billToEmail: data.clientsEmail,
            billToStreetAddress: data.clientStreet,
            billToCity: data.clientCity,
            billToPostcode: data.clientPostCode,
            billToCountry: data.clientCountry,
            invoiceDate: data.invoiceDate,
            paymentTerms: data.paymentTerms,
            productDescription: data.productDescription,
            itemList: items,
            total: total
        };

        try {

            const resp = await fetch(`http://localhost:5000/invoices`, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToPost)

            });

            if(resp.status === 201){

                const responseData = await resp.json();

                //Fetch all invoices to include new 
                const fetchAllResp = await fetch('/api/invoices/index');
                
                if (fetchAllResp.status === 200){

                    const allInvoices = await fetchAllResp.json();
                    setInvoices(allInvoices.data)
                    setOpenCreateInvoice(false);
                    reset();


                } else if(resp.status === 500){

                    alert('error');
                }

            } else {

                alert('fail');

            }

        } catch(err){

            alert('there was an error');
            console.log(err);


        }


    };

    //Handle form submission for save as draft
    const onSaveAsDraft= async (data) => {

        //calulate invoice total
        let total = 0
        data.itemList.map(item => {
            const itemTotal = parseInt(item.total)
            total = total + itemTotal;
        });

        //Add item lists to data
        const items = []
        for (let i = 0; i < data.itemList.length; i++) {
            items.push(data?.[`itemList${i}`]);
        };

        //Calc line totals
        items.forEach(item => {
            item.total = item.quantity * item.price
        });


        const dataToPost = {
            status: 'draft',
            billFromStreet_address: data.streetAddress,
            billFromCity: data.city,
            billFromPostCode: data.postCode,
            billFromCountry: data.country,
            billToName: data.clientsName,
            billToEmail: data.clientEmail,
            billToStreetAddress: data.clientStreet,
            billToCity: data.clientCity,
            billToPostcode: data.clientPostCode,
            billToCountry: data.clientCountry,
            invoiceDate: data.invoiceDate,
            paymentTerms: data.paymentTerms,
            productDescription: data.productDescription,
            itemList: items,
            total: total 
        }

        



        try {

            const resp = await fetch(`http://localhost:5000/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToPost)

            });

            reset();
            router.refresh();

        } catch (err) {

            alert('there was an error');



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

    if(darkModeActive){
        inputStyle = "bg-brand-three border-brand-four text-[white]";
    };

    //Update line total when quantity changed
    const setQuantity = (index, quantity) => {

        const currentValues = getValues();
        const current = currentValues.itemList[index];

        let total = quantity * current.price;

        if(!total){
            total = 0;
        } else {
            total = POUND(total).format();
        }
        update(index, {
            quantity: quantity, 
            price: current.price, 
            total: total
        })

    };

    //Update line total when price changed
    const setPrice = (index, price) => {

        const currentValues = getValues();
        const current = currentValues.itemList[index];
        let total = current.quantity * price; 
        if (!total) {
            total = 0;
        } else {
            total = POUND(total).format();
        }
        update(index, { 
            quantity: current.quantity, 
            price: price, 
            total: total 
        })

    };

    //When discard, reset form state and also close the slide in
    const handleDiscard = () => {

        reset();
        setOpenCreateInvoice(false);
        document.body.classList.remove('overflow-hidden');

    };

    //Intersection observer options
    const options = {
        rootMargin: '0px',
        threshold: 0,
    };
    const { ref, inView, entry } = useInView(options);

    return(

        <>

                <div className={`${openCreateInvoice ? 'open-side-panel-bg' : 'close-side-panel-bg' } min-h-[100%] min-w-[100%] bg-[#0000008a] fixed top-0 left-0 z-10`}>

                    <div className={`${openCreateInvoice ? 'open-side-panel' : 'close-side-panel'} ${darkModeActive ? 'bg-brand-twelve' : 'bg-[white]'}  relative h-[100vh] sm:rounded-tr-[20px] sm:rounded-br-[20px] pt-[60px] ps-[5%] sm:ps-[56px] lg:ps-[155px] pe-[5%] sm:pe-[32px] sm:mt-[80px] sm:mb-[80px] lg:mt-[0px] lg:mb-[0px]`}>

                        <div className="overflow-y-scroll h-[100%] pe-[16px]">

                            <h5 className={`${darkModeActive ? 'text-[white]' : 'text-brand-eight'} heading-m`}>New Invoice</h5>


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

                                {/* Invoice date/Payment terms */}
                                <div className="mt-[49px] flex flex-col">

                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-[24px]">

                                        {/* Invoice date */}
                                        <div className="w-[100%] flex flex-col gap-[9px]">
                                            <label className={`${labelColor}`} style={errors.invoiceDate ? { color: '#EC5757' } : {}} htmlFor="invoiceDate">
                                                Invoice Date
                                            </label>
                                            {errors.invoiceDate && (

                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                    can't be empty
                                                </p>
                                            )}

                                            <input
                                                {...register("invoiceDate", { required: true })}
                                                type="date"
                                                id="invoiceDate"
                                                defaultValue={new Date().toISOString().substr(0, 10)}
                                                className={`${errors.invoiceDate ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} ${errors.invoiceDate && 'border-[red]'}  focus:border-brand-two w-[100%] pe-[16px] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                            />
                                        </div>

                                        {/* Payment terms */}
                                        <div className="w-[100%] flex flex-col gap-[9px]">
                                            <label className={`${labelColor}`} style={errors.paymentTerms ? { color: '#EC5757' } : {}} htmlFor="paymentTerms">
                                                Payment Terms
                                            </label>
                                            {errors.paymentTerms && (

                                                <p className="text-[#EC5757] text-[10px] ls-semibold">
                                                    can't be empty
                                                </p>
                                            )}

                                            <select
                                                {...register("paymentTerms", { required: true })}
                                                type="date"
                                                id="paymentTerms"
                                                className={`${errors.paymentTerms ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} ${errors.paymentTerms && 'border-[red]'}  focus:border-brand-two custom-select w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer pe-[16px]`}
                                                defaultValue="30 days"
                                            >

                                                <option value="1 day">Net 1 Day</option>
                                                <option value="7 days">Net 7 Days</option>
                                                <option value="14 days">Net 14 Days</option>
                                                <option value="30 days">Net 30 Days</option>

                                            </select>
                                        </div>

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

                                <h6 className="text-[#777F98] text-[1.1rem] ls-bold mt-[35px]">Item List</h6>

                                {/* Item list */}
                                <ul className="mt-[24px] flex flex-col gap-[18px]">

                                    {fields.map((field, index) => (
                                        <li key={index} className="flex sm:justify-between flex-wrap sm:flex-nowrap items-center gap-[16px]">

                                            {/* Item name*/}
                                            <div className="flex flex-col gap-[9px] w-[100%] lg:max-w-[270px]">

                                                <label className={`${labelColor}`} htmlFor={`itemList${index}.itemName`}>
                                                    Item Name
                                                </label>

                                                <input
                                                    {...register(`itemList${index}.itemName`, { required: true })}
                                                    type="text"
                                                    id={`itemList${index}.itemName`}
                                                    className={`${errors?.[`itemList${index}`]?.itemName ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                />

                                            </div>

                                            {/* Qnty */}
                                            <div className="flex flex-col gap-[9px] min-w-[46px] max-w-[60px]">

                                                <label className={`${darkModeActive ? 'text-brand-five' : 'text-brand-seven'}`} htmlFor="quantity">
                                                    Qnty.
                                                </label>

                                                <input
                                                    {...register(`itemList${index}.quantity`, 
                                                        { 
                                                            required: true, 
                                                            onChange: (e) =>  setQuantity(index, e.target.value),
                                                            pattern: {
                                                                value: /^-?\d+$/
                                                            },
                                                        }
                                                    )}
                                                    type="text"
                                                    id={`itemList${index}.quantity`}
                                                    placeholder="0"
                                                    className={`${errors?.[`itemList${index}`]?.quantity ? 'outline-[#EC5757]' : ''}  ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} focus:border-brand-two w-[100%] border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                />

                                            </div>

                                            {/* Price */}
                                            <div className="flex flex-col gap-[9px] min-w-[100px] max-w-[125px]">

                                                <label className={`${darkModeActive ? 'text-brand-five' : 'text-brand-seven'}`} htmlFor="price">
                                                    Price
                                                </label>

                                                <input
                                                    {...register(`itemList${index}.price`, 
                                                        { 
                                                            required: true, onChange: (e) => setPrice(index, e.target.value),
                                                            pattern: {
                                                                value: /^-?\d+$/
                                                            }
                                                        }
                                                    )}
                                                    type="text"
                                                    placeholder="100"
                                                    id={`itemList${index}.price`}
                                                    className={`${errors?.[`itemList${index}`]?.price ? 'outline-[#EC5757]' : ''} ${darkModeActive ? 'bg-brand-three border-brand-four text-[white]' : 'bg-[white]  text-brand-eight border-brand-five'} focus:border-brand-two w-[100%] test border-[1px] rounded-[4px] h-[48px] outline-none ps-[20px] heading-s-var  hover:cursor-pointer`}
                                                />

                                            </div>

                                            {/* Total */}
                                            <div className="flex flex-col min-w-[100px]">

                                                <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-seven'}`}>
                                                    Total
                                                </p>

                                                <p className={`${darkModeActive ? 'text-brand-five' : 'text-brand-six'} ls-bold  h-[48px] mt-[5px] flex items-center text-[0.93rem]`}>
                                                    £{field.total}
                                                </p>

                                            </div>

                                            {/* Delete item */}
                                            {fields.length > 1 && (
                                                <div>
                                                    <svg onClick={() => remove(index)} xmlns="http://www.w3.org/2000/svg" className="min-w-[12px] fill-[#888EB0] hover:fill-[#EC5757] max-w-[12px] flex items-center pt-[20px] hover:cursor-pointer" viewBox="0 0 13 16">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.47225 0L9.36117 0.888875H12.4722V2.66667H0.027832V0.888875H3.13892L4.02783 0H8.47225ZM2.6945 16C1.71225 16 0.916707 15.2045 0.916707 14.2222V3.55554H11.5834V14.2222C11.5834 15.2045 10.7878 16 9.80562 16H2.6945Z" />
                                                    </svg>
                                                </div>
                                            )}

                                        </li>

                                    ))}


                                </ul>

                            {/* Floating submit buttons */}
                            <div className={`${inView ? 'hidden' : ''} ${darkModeActive ? 'bg-brand-four' : 'bg-[#FFF]'} ${openCreateInvoice ? 'open-side-panel' : 'close-side-panel'}  fixed bottom-0 left-0 right-0 h-[110px] w-[100%] max-w-[790px] py-[30px] floating-submit flex gap-[10px] justify-between ps-[24px] sm:ps-[55px] lg:ps-[155px] pe-[24px] sm:pe-[55px]`}>

                                <button onClick={handleDiscard} type="button" className="w-[80px] sm:w-[96px] bg-[#F9FAFE] rounded-[24px] text-brand-seven ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px] ">
                                    Discard
                                </button>

                                <div className="flex gap-[8px]">

                                    <button type="button" onClick={handleSubmit(onSaveAsDraft)} className={`${darkModeActive ? 'text-[white]' : 'text-brand-six'} w-[105px] sm:w-[134px] bg-[#373B53] hover:bg-[#0C0E16] rounded-[24px]  ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]`}>
                                        Save as Draft
                                    </button>

                                    <button type="button" onClick={handleSubmit(onSaveAndSend)} className="w-[105px] sm:w-[134px] bg-brand-one hover:bg-brand-two rounded-[24px] text-[white] ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]">
                                        Save & Send
                                    </button>

                                </div>
                            </div>



                                {/* Add new item */}
                                <button type="button" onClick={() => append({  itemName: '', quantity: 0, price: 0, total: 0 } )} className={`${darkModeActive ? 'bg-brand-four text-brand-five' : 'bg-[#F9FAFE] text-brand-seven hover:bg-brand-five'} w-[100%]   rounded-[24px]  ls-bold text-[0.93rem] mt-[18px] py-[16.5px] tracking-[-0.25px]`}>
                                    + Add New Item
                                </button>

                                 {errors.itemList  && (
                                    <p className="text-[red]">Please provide an item</p>
                                )}

                                {/* Discard/ Submit */}
                                <div ref={ref} className={`${!openCreateInvoice && 'hidden'} mt-[39px] flex justify-between flex-wrap sm:pb-[130px] lg:pb-[62px]`}>

                                    <button onClick={handleDiscard} type="button" className="w-[80px] sm:w-[96px] bg-[#F9FAFE] rounded-[24px] text-brand-seven ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px] ">
                                        Discard
                                    </button>

                                    <div className="flex gap-[8px]">

                                        <button type="button" onClick={handleSubmit(onSaveAsDraft)} className={`${darkModeActive ? 'text-[white]' : 'text-brand-six'} w-[105px] sm:w-[134px] bg-[#373B53] hover:bg-[#0C0E16] rounded-[24px]  ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]`}>
                                            Save as Draft
                                        </button>

                                        <button type="button" onClick={handleSubmit(onSaveAndSend)} className="w-[105px] sm:w-[134px] bg-brand-one hover:bg-brand-two rounded-[24px] text-[white] ls-bold text-[0.93rem] py-[16.5px] tracking-[-0.25px]">
                                            Save & Send
                                        </button>
                                    
                                    </div>

                                </div>

                            </form>

                        </div>



                    </div>

                </div>
        
       
        </>

    )

}