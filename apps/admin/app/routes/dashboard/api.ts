import request from "app/utils/request"

const businessData = () => {
    return request.get('workspace/businessData')
}
const orderOverView = () => {
    return request.get('workspace/overviewOrders')
}
const dishOverView = () => {
    return request.get('workspace/overviewDishes')
}
const setmealOverView = () => {
    return request.get('workspace/overviewSetmeals')
}
export {
    businessData,
    orderOverView,
    dishOverView,
    setmealOverView
}