"use client"

import * as React from "react"
import Link from "next/link"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { HomeIcon, ComputerDesktopIcon, LockClosedIcon, ShieldCheckIcon, UsersIcon, BookOpenIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline"

const navigationArray = [
    {
        href: "/dashboards/main",
        text: "Overview",
        icon: <HomeIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/proxy",
        text: "Proxy",
        icon: <ComputerDesktopIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/accesslist",
        text: "Accesslist",
        icon: <LockClosedIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/security_rule_sets",
        text: "Security Rule Sets",
        icon: <ShieldCheckIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/users",
        text: "Users",
        icon: <UsersIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/audit_logs",
        text: "Audit Logs",
        icon: <BookOpenIcon className="w-6 h-6" />
    },
    {
        href: "/dashboards/secure_logs",
        text: "Security Logs",
        icon: <ShieldExclamationIcon className="w-6 h-6" />
    },
]

export function NavigationMenuDemo() {
    const [isSelected, setSelectedIndex] = React.useState<number>(0)

    const onClickNavigate = (index: number) => {
        setSelectedIndex(index)
    }

    React.useEffect(() => {
        console.log(isSelected);
    }, [isSelected])

    return (
        <NavigationMenu orientation="horizontal" className="items-start mt-6">
            <NavigationMenuList className="flex-col">
                {navigationArray.map((e, index) => {
                    return (
                        <NavigationMenuItem
                            className={`h-16 text-base rounded-md ${isSelected === index ? 'text-white' : 'text-black'}`}
                            style={{ width: "240px", backgroundColor: isSelected === index ? "rgb(14,165,233)" : "rgb(241, 245, 249)", transition: 'background-color 0.3s, color 0.3s' }}
                            key={index}
                            onClick={() => onClickNavigate(index)}
                        >
                            <Link href={e.href} legacyBehavior passHref>
                                <NavigationMenuLink
                                    href={e.href}
                                    className="group inline-flex h-9 items-center justify-left pl-5 px-4 py-2 text-base font-medium rounded-md w-full"
                                    style={{ height: "100%", backgroundColor: isSelected === index ? "rgb(14,165,233)" : "rgb(241, 245, 249)", transition: 'background-color 0.3s, color 0.3s' }}
                                >
                                    {e.icon}
                                    <span className="pl-4">{e.text}</span>
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}
