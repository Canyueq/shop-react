<template>
  <view class="container">
    <view class="btn-container">
      <button class="btn" @click="goToIndex"><text>首页</text></button>
    </view>
    <view class="btn-container">
      <button class="btn" @click="goToOrder">订单</button>
    </view>
    <view class="btn-container">
      <button class="btn" @click="goToMine">我的</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
const goToIndex = () => {
  uni.navigateTo({
    url: "/pages/index/index",
  });
};
const goToOrder = () => {
  uni.navigateTo({
    url: "/pages/order/order",
  });
};
const goToMine = () => {
  uni.navigateTo({
    url: "/pages/mine/mine",
  });
};
</script>

<style scoped>
/* 外层容器：横向排列，占满宽度，垂直居中，适配移动端 */
.container {
  width: 100%;
  display: flex;
  flex-direction: row; /* 整体横向排列（按钮容器之间） */
  justify-content: space-around; /* 均匀分布，替代margin避免挤压 */
  align-items: center; /* 垂直居中 */
  padding: 20rpx 0; /* 上下留白 */
  box-sizing: border-box;
}

/* 按钮容器：仅包裹按钮，取消多余margin */
.btn-container {
  display: flex;
  flex-direction: row; /* 容器内部横向（按钮本身） */
}

/* 按钮样式：确保内部文字横向排列，样式优化 */
.btn {
  display: flex;
  flex-direction: row; /* 按钮内部横向排列（文字） */
  align-items: center; /* 文字垂直居中 */
  justify-content: center; /* 文字水平居中 */
  border: none;
  box-shadow: none;
  background-color: white;
  padding: 15rpx 30rpx; /* 按钮内边距，点击区域更大 */
  font-size: 32rpx; /* 适配移动端字体大小 */
}
</style>
