import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { CheckCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline"


interface ActionsCellProps {
    data_id: string;
    id: string;
    onDelete: (id: string) => void
}
const ActionsCell = ({ id, data_id, onDelete }: ActionsCellProps) => {
    const router = useRouter()
    const viewDetail = (id: any, id_data: any) => {
        console.log("🚀 ~ viewDetail ~ e:", id)
        router.push(`/dashboards/security_rule_sets/${id}/datarule/${id_data}`)
    }
    return (
        <div className="flex flex-row justify-end">
            <div onClick={() => onDelete(data_id)} className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border hover:border-sky-500">
                <TrashIcon className='w-6 h6' />
            </div>
            <div className="w-5"></div>
            <div onClick={() => viewDetail(id, data_id)} className="w-10 h-10 flex justify-center rounded-lg hover:bg-sky-500 hover:text-white shadow border  hover:border-sky-500">
                <PencilSquareIcon className='w-6 h6' title="Detail DataRule" />
            </div>
        </div>
    )
}

export default ActionsCell
