<template>
  <view class="content">
    <view class="restaurant_top">
      营业状态：{{ shopStatus === 1 ? "营业中" : "打烊" }}
    </view>
    <!-- 菜品分类+菜品列表区域 -->
    <view class="restaurant_menu_list">
      <!-- 左侧分类列表（纵向滚动） -->
      <view class="type_list">
        <scroll-view
          class="menu-view"
          scroll-y
          scroll-with-animation
          :scroll-top="scrollTop"
          :scroll-into-view="activeTypeId"
        >
          <block v-for="(item, index) in typeListData" :key="item.id || index">
            <view
              class="type_item {{typeIndex === index ? 'active' : ''}}"
              :id="'type_' + item.id"
              @click="swichMenu(item, index)"
            >
              <view class="item {{item.name.length > 5 ? 'allLine' : ''}}">
                {{ item.name }}
              </view>
            </view>
          </block>
          <view class="seize_seat"></view>
        </scroll-view>
      </view>

      <!-- 右侧菜品列表 -->
      <block v-if="dishListItems && dishListItems.length > 0">
        <scroll-view
          class="vegetable_order_list"
          scroll-y
          @scroll="onDishListScroll"
        >
          <block v-for="(item, index) in dishListItems" :key="item.id || index">
            <view class="dish_item">
              <!-- 菜品图片 -->
              <view class="dish_img">
                <image
                  class="dish_img_url"
                  mode="aspectFill"
                  :src="item.image || '../../static/default-dish.png'"
                >
                  <Pop
                    v-model:open="popOpen"
                    confirm-text="加入购物车"
                    pop-text=""
                    @confirm="handlePopConfirm(item)"
                    @beforeClick="openDetailHandle(item)"
                  >
                    <view>{{ popContent }}</view>
                  </Pop>
                </image>
              </view>
              <!-- 菜品信息 -->
              <view class="dish_info">
                <view class="dish_name" @click="openDetailHandle(item)">
                  {{ item.name }}
                </view>
                <view class="dish_label" @click="openDetailHandle(item)">
                  {{ item.description || item.name }}
                </view>
                <view class="dish_label" @click="openDetailHandle(item)">
                  月销量0
                </view>
                <view class="dish_price">
                  <text class="ico">￥</text>{{ item.price || 0 }}
                </view>
              </view>
              <!-- 菜品操作 -->
              <view class="dish_operation">
                <!-- 无规格菜品：加减按钮 -->
                <block v-if="!item.flavors || item.flavors.length === 0">
                  <!-- 减号按钮：数量>0时显示 -->
                  <image
                    v-if="item.dishNumber > 0"
                    class="dish_red"
                    src="../../static/btn_red.png"
                    @click="redDishAction(item)"
                    data-type="普通"
                  ></image>
                  <!-- 数量：>0时显示 -->
                  <text v-if="item.dishNumber > 0" class="dish_number">
                    {{ item.dishNumber }}
                  </text>
                  <!-- 加号按钮 -->
                  <image
                    class="dish_add"
                    src="../../static/btn_add.png"
                    @click="addDishAction(item)"
                    data-type="普通"
                  ></image>
                </block>
                <!-- 有规格菜品：弹窗选择 -->
                <Pop
                  v-else
                  :open="popOpen"
                  confirm-text="加入购物车"
                  pop-text="选择规格"
                  @on-confirm="handleSpecConfirm(item)"
                  @before-click="openDetailHandle(item)"
                >
                  <view>选择规格</view>
                  <view style="display: flex; flex-direction: row">
                    <block v-for="item in popContent" :key="item">
                      <button>
                        {{ item.name }}
                      </button>
                    </block>
                  </view>
                </Pop>
              </view>
            </view>
          </block>
        </scroll-view>
      </block>

      <!-- 无菜品提示 -->
      <block v-else>
        <view class="vegetable_order_list">
          <block v-if="typeListData.length > 0">
            <view class="empty-tip">该分类下暂无菜品</view>
          </block>
        </view>
      </block>
    </view>
    <Footer class="restaurant_footer" />
    <ShoppingCart
      class="shopping-cart"
      :dishes="formatShoppingCart()"
      v-on:add-number="addDishAction"
      v-on:red-number="redDishAction"
    />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { dishListItem, DishType, SetmealType } from "./type";
import Pop from "../../components/common/Pop.vue";
import ShoppingCart from "../../components/common/ShoppingCart.vue";
import { addNumber, getShoppingCart, redNumber } from "../../common/api";
import { useUserStore } from "../../common/store";

// ===== 基础响应式数据 =====
const shopStatus = ref(0);
const code = ref<string>();
const token = ref<string>();
const typeListData = ref<any[]>([]);
const dishListItems = ref<dishListItem[]>([]);
const popContent = ref();
// 购物车：存储{id, name, price, number, ...}，避免重复push
const selectedDishes = ref<Record<string, any>>({});
// 新增：菜品数量缓存（核心！按ID永久存储数量，切换分类不丢失）
const dishNumberCache = ref<Record<string, number>>({});
const typeIndex = ref(0); // 当前选中的分类索引
const scrollTop = ref(0); // 左侧分类滚动条位置
const activeTypeId = ref(""); // 左侧滚动定位的ID
const popOpen = ref(false); // 普通弹窗显隐
const specPopOpen = ref(false); // 规格选择弹窗显隐
const currentSelectDish = ref<dishListItem | null>(null); // 当前操作的菜品
const userStore = useUserStore();

// ===== 新增：获取菜品缓存数量的函数 =====
const getDishNumberFromCache = (dishId: string | number) => {
  // 从缓存中读取数量，无缓存则返回0
  return dishNumberCache.value[dishId] || 0;
};

// ===== 新增：更新菜品缓存数量的函数 =====
const updateDishNumberCache = (dishId: string | number, number: number) => {
  // 数量>0则存入缓存，否则删除缓存（避免冗余）
  if (number > 0) {
    dishNumberCache.value[dishId] = number;
  } else {
    delete dishNumberCache.value[dishId];
  }
};

// ===== 方法：获取分类列表 =====
const getList = () => {
  if (!token.value) return;
  uni.request({
    url: "http://localhost:8080/user/category/list",
    method: "GET",
    header: {
      authentication: token.value,
    },
    success: (res: any) => {
      console.log("获取分类列表结果", res);
      typeListData.value = res.data.data || [];
      // 默认选中第一个分类
      if (typeListData.value.length > 0) {
        swichMenu(typeListData.value[0], 0);
      }
    },
    fail: (err) => {
      uni.showToast({ title: "分类加载失败", icon: "none" });
      console.error("分类请求失败", err);
    },
  });
};

// ===== 方法：切换分类（核心修改：加载菜品时从缓存恢复数量） =====
const swichMenu = (item: any, index: number) => {
  typeIndex.value = index; // 更新选中索引
  activeTypeId.value = "type_" + item.id; // 滚动到当前分类
  // 禁用打烊时的操作
  if (shopStatus.value !== 1) {
    uni.showToast({ title: "店铺已打烊，暂无法点餐", icon: "none" });
    return;
  }
  // 根据分类类型请求菜品/套餐
  const url =
    item.type === 2
      ? `http://localhost:8080/user/setmeal/list?categoryId=${item.id}`
      : `http://localhost:8080/user/dish/list?categoryId=${item.id}`;

  uni.request({
    url,
    header: {
      authentication: token.value,
    },
    success: (res: any) => {
      console.log("获取分类的查询结果", res.data.data);
      // 核心修改：加载菜品时，从缓存中读取dishNumber，而非初始化为0
      dishListItems.value = (res.data.data || []).map((dish: any) => ({
        ...dish,
        // 优先从缓存取数量，无缓存则为0
        dishNumber: getDishNumberFromCache(dish.id),
        type: item.type,
      }));
    },
    fail: (err) => {
      uni.showToast({ title: "菜品加载失败", icon: "none" });
      console.error("菜品请求失败", err);
    },
  });
};

// ===== 方法：打开菜品详情/规格弹窗 =====
const openDetailHandle = (item: dishListItem) => {
  popOpen.value = true;
  currentSelectDish.value = item; // 记录当前操作的菜品
  popContent.value = currentSelectDish.value.flavors;
};

// ===== 方法：减少菜品数量（核心修改：同步更新缓存） =====
const redDishAction = (item: any) => {
  if (item.dishNumber <= 0) return;
  item.dishNumber--;
  // 同步更新缓存
  updateDishNumberCache(item.id, item.dishNumber);
  // 更新购物车：数量>0则保留，否则删除F
  if (item.dishNumber > 0) {
    selectedDishes.value[item.id] = { ...item };
  } else {
    delete selectedDishes.value[item.id];
  }
  console.log("减少当前菜品", item, formatShoppingCart());
  redNumber(item);
  userStore.shoppingCart = getShoppingCart();
};
// ===== 方法：增加菜品数量（核心修改：同步更新缓存） =====
const addDishAction = (item: any) => {
  // 禁用打烊时的操作
  if (shopStatus.value !== 1) {
    uni.showToast({ title: "店铺已打烊，暂无法点餐", icon: "none" });
    return;
  }
  item.dishNumber++;
  // 同步更新缓存
  updateDishNumberCache(item.id, item.dishNumber);
  // 更新购物车：根据ID去重，只更新数量
  selectedDishes.value[item.id] = { ...item };
  console.log("增加当前菜品", item, formatShoppingCart());
  if (item.type === 2) {
    addNumber({ setmealId: item.id });
  } else {
    addNumber({ dishId: item.id });
  }
  userStore.shoppingCart = getShoppingCart();
};

// ===== 方法：格式化购物车数据（给子组件用） =====
const formatShoppingCart = () => {
  // 把对象转成数组，只保留数量>0的菜品
  return Object.values(selectedDishes.value).filter(
    (dish: any) => dish.dishNumber > 0,
  );
};

// ===== 方法：普通弹窗确认（加入购物车） =====
const handlePopConfirm = (item: any) => {
  if (!currentSelectDish.value) return;
  addDishAction(currentSelectDish.value);
  popOpen.value = false; // 关闭弹窗
  uni.showToast({ title: "加入购物车成功", icon: "success" });
};

// ===== 方法：规格弹窗确认（加入购物车） =====
const handleSpecConfirm = (item: any) => {
  if (!currentSelectDish.value) return;
  addDishAction(currentSelectDish.value);
  specPopOpen.value = false; // 关闭弹窗
  uni.showToast({ title: "选择规格并加入购物车", icon: "success" });
  if (item.type === 2) {
    addNumber({ setmealId: item.id });
  } else {
    addNumber({ dishId: item.id, flavor: item.flavor });
  }
  popOpen.value = false;
};

// ===== 方法：右侧菜品列表滚动（联动左侧分类，可选） =====
const onDishListScroll = (e: any) => {
  // 可扩展：根据右侧滚动位置，自动切换左侧分类选中项
  // 示例逻辑（需根据实际需求调整）：
  // const scrollTop = e.detail.scrollTop;
  // 根据scrollTop计算当前显示的菜品所属分类，更新typeIndex
};
// ===== 生命周期：初始化 =====
onMounted(() => {
  // 1. 获取店铺状态
  uni.request({
    url: "http://localhost:8080/user/shop/status",
    method: "GET",
    success: (res: any) => {
      console.log("获取店铺状态", res);
      shopStatus.value = res.data.data || 0;
      if (shopStatus.value !== 1) {
        uni.showToast({ title: "当前店铺已打烊", icon: "none" });
      }
    },
    fail: (err) => {
      console.error("店铺状态请求失败", err);
    },
  });

  // 2. 微信登录 + 获取token + 加载分类
  uni.login({
    provider: "weixin",
    success: (res) => {
      console.log("微信登录结果", res);
      code.value = res.code;
      uni.request({
        url: `http://localhost:8080/user/user/login?code=${code.value}`,
        method: "POST",
        success: (res: any) => {
          console.log("获取登录结果", res);
          token.value = res.data.data?.token;
          userStore.token = token.value;
          console.log("pinia中的token", userStore.token);
          getShoppingCart().then((res: any) => {
            userStore.shoppingCart = res.data.data;
            console.log("pinia中的shoppingcart", userStore.shoppingCart);
          });
          if (token.value) {
            getList(); // 登录成功后加载分类
          } else {
            uni.showToast({ title: "登录失败", icon: "none" });
          }
        },
        fail: (err) => {
          uni.showToast({ title: "登录请求失败", icon: "none" });
          console.error("登录请求失败", err);
        },
      });
    },
    fail: (err) => {
      uni.showToast({ title: "微信登录失败", icon: "none" });
      console.error("微信登录失败", err);
    },
  });
});

// ===== 监听：购物车变化（可选，用于调试） =====
watch(
  () => selectedDishes.value,
  (newCart) => {
    console.log("购物车更新", formatShoppingCart());
  },
  { deep: true },
);

// ===== 新增：监听缓存变化（用于调试，可选） =====
watch(
  () => dishNumberCache.value,
  (newCache) => {
    console.log("菜品数量缓存更新", newCache);
  },
  { deep: true },
);
</script>

<style scoped>
.content {
  position: relative;
  height: 100vh; /* 改为vh，适配不同屏幕 */
  display: flex;
  flex-direction: column;
}
.shopping-cart {
  background-color: aqua;
  position: absolute;
  left: 40%;
  bottom: 20%;
  padding: 10px;
  border-radius: 8px;
}
.restaurant_top {
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: #f5f5f5;
}
.restaurant_menu_list {
  height: 80%;
  display: flex; /* 加flex，让左右两栏并排 */
}
.type_list {
  width: 30%;
  height: 100%;
  box-shadow: 0 0 1px 1px grey;
  overflow-y: auto;
}
.menu-view {
  height: 100%;
}
.type_item {
  padding: 15px 10px;
  margin-bottom: 0; /* 移除多余margin，避免间距过大 */
  border-bottom: 1px solid #eee;
}
.type_item.active {
  background-color: #fff0f0;
  color: #ff4444;
  font-weight: bold;
}
.item.allLine {
  font-size: 12px; /* 长名称缩小字体 */
}
.vegetable_order_list {
  height: 100%;
  width: 70%;
  box-shadow: 0 0 1px 1px grey;
}
.empty-tip {
  text-align: center;
  margin-top: 50px;
  color: #999;
}
.dish_item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.dish_info {
  display: flex;
  flex-direction: column; /* 改为column，垂直排列信息 */
  width: 50%;
  padding: 0 10px;
}
.dish_img {
  width: 30%;
}
.dish_img_url {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}
.dish_name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
.dish_label {
  font-size: 12px;
  color: #999;
  margin-bottom: 3px;
}
.dish_price {
  margin-top: 5px;
  color: #ff4444;
  font-weight: bold;
}
.dish_operation {
  width: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px; /* 加减按钮间距 */
}
.dish_red,
.dish_add {
  width: 20px;
  height: 20px;
}
.dish_number {
  font-size: 14px;
  min-width: 20px;
  text-align: center;
}
.restaurant_footer {
  height: 10%;
  border-top: 1px solid #eee;
}
</style>
