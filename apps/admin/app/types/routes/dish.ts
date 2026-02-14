type DishType = {
  id: number;
  name: string;
  image: string;
  price: number;
  status: number;
  updateTime: number[];
  updateUser: number;
  createTime: number[];
  createUser: number;
};
type DishReq = {
  categoryId: number;
  description?: string;
  flavors?: { name: string; value: number }[];
  id: number;
  image: string;
  name: string;
  price: number;
  status: number;
};
