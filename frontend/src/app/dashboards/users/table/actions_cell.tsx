import React from 'react'

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import useUserStore from '@/store/user'

interface ActionsCellProps {
    user: UserInput
    onDelete: (id: string) => void
}
const ActionsCell = ({ user, onDelete }: ActionsCellProps) => {
    let userStore = useUserStore()
    let role = userStore.user.role
    console.log("🚀 ~ ActionsCell ~ role:", role)
    return (
        <>
            {role === 0 ? (
                <div className="flex flex-row justify-end">
                    <div onClick={() => onDelete(user.id as string)} className="cursor-pointer w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                        <TrashIcon className='w-6 h6' />
                    </div>
                    <div className="w-5"></div>
                    <Link className="cursor-pointer w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500" href={`/dashboards/users/${user.id}/reset-pass`}>
                        <PencilSquareIcon className='w-6 h6' />
                    </Link>
                </div>
            ) : (
                <></>
            )}
        </>

    )
}

export default ActionsCell