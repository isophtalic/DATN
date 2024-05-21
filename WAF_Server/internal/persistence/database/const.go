package database

const Query_Count_Record_By_Time = "select %s, count(*) as count from secure_log_monitor where created_at >= CURRENT_DATE - INTERVAL '%s' group by %s;"
const LAST_WEEK = "7 days"
const LAST_MONTH = "1 month"
const LAST_DAY = "1 day"
