<template>
  <view class="page-container">
    <button
      @click="
        () => {
          emits('beforeClick');
          showPopup = true;
        }
      "
      class="open-btn"
    >
      {{ popText }}
    </button>
    <view v-if="showPopup" class="popup-mask">
      <view class="popup-content" @click.stop>
        <view class="popup-title">{{ title }}</view>
        <view class="popup-body"><slot></slot></view>
        <view class="popup-footer">
          <button
            v-if="confirmText"
            @click="
              () => {
                onConfirm;
                showPopup = false;
              }
            "
          >
            {{ confirmText }}
          </button>
          <button
            v-if="cancelText"
            @click="
              () => {
                onCancel;
                showPopup = false;
              }
            "
          >
            {{ cancelText }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const showPopup = ref(false);
const props = defineProps({
  popText: {
    type: String,
  },
  title: {
    type: String,
  },
  confirmText: {
    type: String,
  },
  onConfirm: {
    type: Function,
  },
  cancelText: {
    type: String,
  },
  onCancel: {
    type: Function,
  },
});
const emits = defineEmits(["beforeClick"]);
</script>
<style scoped>
/* 页面容器（仅占位，可根据你的页面调整） */
.page-container {
  height: auto;
}

/* 打开按钮样式 */
.open-btn {
  font-size: 20rpx;
}

/* ========== 核心：弹窗遮罩层 ========== */
.popup-mask {
  /* 1. 全屏固定定位，覆盖整个屏幕 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* 2. 半透明黑色背景（视觉：遮罩效果） */
  background-color: rgba(0, 0, 0, 0.5);
  /* 3. 让弹窗主体居中（flex布局最简洁） */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 4. 层级置顶，确保在所有内容上方 */
  z-index: 9999;
  /* 可选：禁止遮罩层滚动（防止底层页面滚动） */
  overflow: hidden;
}

/* ========== 核心：弹窗主体 ========== */
.popup-content {
  /* 1. 固定宽度，适配移动端 */
  width: 680rpx;
  /* 2. 白色背景 + 圆角（视觉：弹窗质感） */
  background-color: #ffffff;
  border-radius: 20rpx;
  /* 3. 阴影（视觉：提升层次感） */
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
  /* 4. 内边距（视觉：内容不贴边） */
  padding: 40rpx;
  /* 可选：限制最大高度，内容过多时滚动 */
  max-height: 80vh;
  overflow-y: auto;
  /* 修复uni-app的rpx适配问题 */
  box-sizing: border-box;
}

/* 弹窗标题样式 */
.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 30rpx;
}

/* 弹窗内容样式 */
.popup-body {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 40rpx;
}

/* 弹窗按钮组 */
.popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

/* 取消/确认按钮样式 */
.cancel-btn,
.confirm-btn {
  padding: 16rpx 32rpx;
  font-size: 28rpx;
  border-radius: 8rpx;
}
.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}
.confirm-btn {
  background-color: #007aff;
  color: #fff;
}
</style>
