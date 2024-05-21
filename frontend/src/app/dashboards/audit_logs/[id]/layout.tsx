import React from 'react'

const AccesslistDetailLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='p-4 md:py-8 md:px-12' style={{ width: "100%", backgroundColor: "rgb(241,245,249)" }}>
            {children}
        </div>

    )
}

export default AccesslistDetailLayout