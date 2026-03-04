import type { BaseRes } from "app/types/global";
export type StatisticsResponse = BaseRes<{ dateList: string[], turnoverList: number[] }>
export type StatisticsParams = {
    begin: string;
    end: string;
} 