type BusinessDataRes = {
    turnover: number;
    validOrderCount: number;
    orderCompletionRate: number;
    unitPrice: number;
    newUsers: number;
}
type OrderOverViewRes = {
    waitingOrders: number;
    deliveredOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    allOrders: number;
}
type DishOverViewRes = {
    sold: number;
    discontinued: number;
}
type SetmealOverViewRes = {
    sold: number;
    discontinued: number;
}
