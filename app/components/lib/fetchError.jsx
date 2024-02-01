export default function FetchError({setReRender, setFetchError, darkModeActive}){

    const handleTryAgain = () => {
        setFetchError(false);
        setReRender(true);
    };

    return (
        <h1 className="flex flex-col justify-center items-center h-[80vh] heading-m">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[40px] fill-[#ee1a1a]" viewBox="0 0 512 512"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm24-384H232v24V264v24h48V264 152 128zM232 368h48V320H232v48z" /></svg>
            <span className={`${darkModeActive && 'text-[white]'} mt-2`}>An Error Occurred</span>
            <button onClick={handleTryAgain} className={`${darkModeActive ? 'text-[#6262ff]' : 'text-[#3838ff]'} heading-s-var  hover:cursor-pointer`}>Try Again</button>
        </h1>
    )
}