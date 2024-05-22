import React from 'react'
import { useRouter } from "next/navigation";

import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
interface ActionsCellProps {
    rule_id: string;
    id: string;
    onDelete: (id: string) => void
}
const ActionsCell = ({ id, rule_id, onDelete }: ActionsCellProps) => {
    const router = useRouter()
    const viewDetail = (id: any, rule_id: any) => {
        console.log("🚀 ~ viewDetail ~ e:", id)
        router.push(`/dashboards/security_rule_sets/${id}/ruleset/${rule_id}`)
    }
    return (
        <div className="flex flex-row justify-end">
            <div onClick={() => onDelete(rule_id)} className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                <TrashIcon className='w-6 h6' />
            </div>
            <div className="w-5"></div>
            <div onClick={() => viewDetail(id, rule_id)} className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500">
                <PencilSquareIcon className='w-6 h6' />
            </div>
        </div>
    )

}

export default ActionsCell