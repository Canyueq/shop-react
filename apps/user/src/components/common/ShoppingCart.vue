<template>
  <view class="shopping-container">
    <!-- 总价：基于全局状态计算，保留2位小数 -->
    <view class="price"> 总价：{{ totalPrice.toFixed(2) }} </view>
    <!-- 结算弹窗：绑定显隐 + 结算/取消事件 -->
    <view class="btn">
      <Pop :open="popOpen" :pop-text="props.btnText" @before-click="getData">
        <view>
          <view class="cart-top">
            <view>购物车</view>
            <button class="btn" @click="handleClean">清空</button>
          </view>
          <view class="cart-content">
            <!-- 空购物车提示 -->
            <view v-if="!dishesData.length" class="empty-cart">
              购物车为空，快去添加菜品吧～
            </view>
            <block
              v-else
              v-for="(item, index) in dishesData"
              :key="`cart-item-${item.id || index}`"
            >
              <view class="cart-item">
                <view>名称：{{ item.name }}</view>
                <view>价格：{{ (item.amount || 0).toFixed(2) }}</view>
                <view class="cart-item">
                  <button class="btn" @click="handleAdd(item)">+</button>
                  <view>份数：{{ item.number || 0 }}</view>
                  <button class="btn" @click="handleRed(item)">-</button>
                </view>
              </view>
            </block>
          </view>
        </view>
        <view class="cart-item">
          <button class="btn" @click="handleCancel">取消</button>
          <button class="btn" @click="handleConfirm">结算</button>
        </view>
      </Pop>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "@dcloudio/uni-app";
import Pop from "./Pop.vue";
import { cleanNumber } from "../../common/api";
import { useUserStore } from "../../common/store";

// 仅保留按钮文本props，移除dishes props（改为依赖全局状态）
const props = defineProps({
  btnText: {
    type: String,
    default: "打开购物车",
  },
});
const emits = defineEmits(["redNumber", "addNumber"]);

// 弹窗显隐控制
const popOpen = ref(false);
const userStore = useUserStore();

// 核心：基于全局状态的响应式菜品数据（初始化+监听更新）
const dishesData = ref<any[]>(userStore.shoppingCart || []);

// 总价计算：完全依赖全局状态，移除对props的依赖
const totalPrice = computed(() => {
  if (!dishesData.value || dishesData.value.length === 0) return 0;
  return dishesData.value.reduce((sum: number, item: any) => {
    const price = Number(item.amount) || 0; // 价格兜底，避免NaN
    const number = Number(item.number) || 0; // 数量兜底
    return sum + price * number;
  }, 0); // 初始值必须为0
});

// 监听全局购物车变化，同步更新dishesData（核心修改）
watch(
  () => userStore.shoppingCart,
  (newCart) => {
    console.log("全局购物车更新：", newCart);
    dishesData.value = newCart || []; // 确保始终是数组，避免undefined
    console.log("dishesData同步后：", dishesData.value);
  },
  { deep: true, immediate: true }, // immediate：组件初始化时立即执行
);

// 监听菜品/总价变化（调试+空购物车提示）
watch(
  () => [dishesData.value, totalPrice.value],
  ([newDishes, newPrice]) => {
    console.log("购物车菜品：", newDishes);
    console.log("最新总价：", newPrice);
    if (newDishes.length === 0) {
      console.log("购物车为空");
    }
  },
  { deep: true },
);

// 组件初始化时主动拉取一次购物车（可选，确保数据不丢失）
onMounted(() => {
  dishesData.value = userStore.shoppingCart || [];
  console.log("组件初始化，购物车数据：", dishesData.value);
});

// 取消按钮事件
const handleCancel = () => {
  popOpen.value = false;
  uni.showToast({ title: "已取消结算", icon: "none" });
};

// 数量增加
const handleAdd = (item: any) => {
  emits("addNumber", item);
};

// 数量减少
const handleRed = (item: any) => {
  emits("redNumber", item);
};

// 打开弹窗
const getData = () => {
  popOpen.value = true;
};

// 清空购物车（调用接口+同步全局状态）
const handleClean = () => {
  uni.showModal({
    title: "提示",
    content: "确定清空购物车吗？",
    success: (res) => {
      if (res.confirm) {
        cleanNumber(); // 调用清空接口
        // 同步清空全局状态（根据你的store逻辑调整）
        userStore.shoppingCart = [];
        dishesData.value = [];
        popOpen.value = false;
        uni.showToast({ title: "购物车已清空", icon: "success" });
      }
    },
  });
};

// 结算按钮事件（基于全局状态判断）
const handleConfirm = () => {
  // 空购物车拦截
  if (dishesData.value.length === 0) {
    uni.showToast({ title: "购物车为空，无法结算", icon: "none" });
    return;
  }
  popOpen.value = false;
  // 结算逻辑：传递全局购物车数据
  uni.showToast({
    title: `结算成功！总价：${totalPrice.value.toFixed(2)}元`,
    icon: "success",
  });
  console.log("结算菜品（全局状态）：", dishesData.value);
  // 跳转到结算页
  uni.navigateTo({
    url: "/pages/settlement/settlement",
  });
};
</script>

<style scoped>
/* 原有样式保留，新增空购物车提示样式 */
.shopping-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4444;
}

.btn {
  padding: 8px 16px;
  background-color: #fff;
  border-radius: 20px;
  color: #000;
  font-size: 14px;
}

.cart-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cart-content {
  min-height: 100px;
}

/* 新增空购物车样式 */
.empty-cart {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 14px;
}

.cart-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px 0;
}
.cart-item > view {
  margin-right: 10px;
}
</style>
