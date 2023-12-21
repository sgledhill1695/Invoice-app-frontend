import Link from "next/link";

export default function GoBack({darkModeActive}){

    return(

        <Link href={'/'} className="flex items-center gap-[24px] hover:cursor-pointer">

            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="11" viewBox="0 0 6 11" fill="none">
                <path d="M4.3418 0.886047L0.113895 5.11395L4.3418 9.34185" stroke="#7C5DFA" strokeWidth="2" />
            </svg>

            <p className={`${darkModeActive ? 'text-[white] hover:text-brand-six' : 'text-brand-eight hover:text-brand-seven '}  heading-s-var`}>Go back</p>

        </Link>

    )


}