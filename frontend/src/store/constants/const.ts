import { PaginationState } from "@tanstack/react-table";
import dotenv from 'dotenv'

dotenv.config();

export const BlacklistStatus = {
    ALLOW: 0,
    DENY: 1,
}

export const RuleStatus = {
    ENABLE: 0,
    DISABLE: 1,
}

export const InitialPaginationState: PaginationState = {
    pageIndex: 0,
    pageSize: 10
}

export const DebounceValue = 800

export const Secret = process.env.JWT_SECRET