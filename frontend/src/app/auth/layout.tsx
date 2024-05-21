import React from 'react'

const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className={"pt-60"} style={{ minHeight: "100vh", backgroundColor: "rgb(241,245,249)" }}>
            {children}
        </div>

    )
}

export default AuthLayout