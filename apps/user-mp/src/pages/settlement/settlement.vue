<template>
  <view class="content">
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button @click="handleAddressClick">打开地址</button>
    <ShoppingCart btn-text="结算" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ShoppingCart from "../../components/common/ShoppingCart.vue";
const title = ref("Hello");
const handleAddressClick = () => {
  uni.navigateTo({
    url: "/pages/address/address",
  });
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
