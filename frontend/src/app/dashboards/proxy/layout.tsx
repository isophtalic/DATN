import React from 'react'

const ProxyLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div style={{ width: "100%", backgroundColor: "rgb(241,245,249)" }}>
            {children}
        </div>

    )
}

export default ProxyLayout