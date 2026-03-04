import { useUserStore } from "../store";
import { UniRequest } from "./UniRequest";

const userStore = useUserStore();
export const request = new UniRequest("http://localhost:8080/user");
