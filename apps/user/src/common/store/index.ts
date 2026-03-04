import { defineStore } from "pinia";
import { ref } from "vue"; 
import type { Address } from "../typs/address";

const useUserStore = defineStore("useUserStore", () => {
  const token = ref<string>();
  const address = ref<Address[]>([]);
  const currentAddress = ref<Address>();
  const shoppingCart = ref();
  return {
    token,
    address,
    currentAddress,
    shoppingCart,
  };
});
export { useUserStore };
