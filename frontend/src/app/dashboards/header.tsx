import React from 'react'
import ShadcnAvatar from './main/components/avatar'
const Header = () => {
    return (
        <div className='flex items-center h-full'>

            <div className='flex items-center hidden md:flex ml-2 w-full '>
                <ShadcnAvatar />
            </div>
        </div>

    )
}

export default Header