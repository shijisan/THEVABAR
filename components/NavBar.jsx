"use client"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars,faXmark} from "@fortawesome/free-solid-svg-icons"
import { useState } from 'react';

export default function NavBar(){

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () =>{
        setIsMenuOpen(prevState => !prevState);
    };

    return(
    <>
        <nav className="fixed z-30 flex flex-col w-full text-yellow-200 lg:flex-row bg-red-950">
            <div className="flex w-full h-[10vh]">
                <div className="flex items-center justify-center w-5/6 lg:w-1/2">
                    <h2 className="text-lg font-medium text-white">THE VA BAR <span className='text-yellow-200'>Academy</span></h2>
                </div>
                <button onClick={toggleMenu} className="w-1/5 lg:w-0 menu lg:hidden">
                    <FontAwesomeIcon className='p-1 rounded-full hover:bg-opacity-35 aspect-square hover:bg-white' icon={isMenuOpen ? faXmark : faBars}/>
                </button>
            </div>
            <ul className={`${isMenuOpen ? "flex" : "hidden"} lg:flex flex-col items-center justify-center w-full lg:bg-transparent bg-yellow-200 lg:space-x-5 text-red-950 lg:text-yellow-200 lg:flex-row gap-y-1`}>
                <li className='py-1'><a href="/">Home</a></li>
                <li className='py-1'><a href="/">Link 1</a></li>
                <li className='py-1'><a href="/">Link 2</a></li>
                <li className='py-1'><a href="/">Link 3</a></li>
            </ul>
        </nav>
    </>
    );
}