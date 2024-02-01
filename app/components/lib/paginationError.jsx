export default function PaginationError({darkModeActive}){

    return (
        <div className="flex items-center gap-2">

            <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] fill-[#ee1a1a]" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm24-384H232v24V264v24h48V264 152 128zM232 368h48V320H232v48z" /></svg>
            <span className={`${darkModeActive && 'text-[white] mt-1'}`}>Unable to retrieve invoices</span>



        </div>
    )
}