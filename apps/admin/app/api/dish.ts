import {request} from "../utils/request"

export const page = (data:pagination) => {
  return request.get("/dish/page",data)
}
export const deleteById = (data:pagination) => {
  return request.delete("/dish",data)
}
export const add = (data:pagination) => {
  return request.post("/dish",data)
}
export const update = (data:pagination) => {
  return request.put("/dish",data)
}
export const setStatus = (statsu:number,id:number) => {
  return request.post(`/dish/status/${status}`,{},{params:id})
}
