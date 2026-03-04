import request from "app/utils/request"
import type { StatisticsParams } from "./types/api";

export const turnoverStatistics = (params: StatisticsParams) => {
    return request.get(
        "report/turnoverStatistics", { params }
    )
}
export const userStatistics = (params: StatisticsParams) => {
    return request.get(
        "report/userStatistics", { params }
    )
}
export const orderStatistics = (params: StatisticsParams) => {
    return request.get(
        "report/orderStatistics", { params }
    )
}
export const topStatistics = (params: StatisticsParams) => {
    return request.get(
        "report/top10", { params }
    )
}
export const exportStatisticsData = () => {
    return request.get(
        "report/port"
    )
}