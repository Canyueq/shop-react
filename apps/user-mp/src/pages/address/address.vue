<template>
  <view class="content">
    <!-- 标题 -->
    <view class="page-title">
      <text>地址管理</text>
    </view>

    <!-- 地址列表 -->
    <view class="address-list" v-if="addressData.length > 0">
      <view class="address-item" v-for="item in addressData" :key="item.id">
        <!-- 地址信息 -->
        <view class="address-info">
          <view class="name-phone">
            <text class="consignee">{{ item.consignee }}</text>
            <text class="phone">{{ item.phone }}</text>
            <!-- 默认地址标签 -->
            <text class="default-tag" v-if="item.isDefault === 1"
              >默认地址</text
            >
          </view>
          <view class="address-detail">
            {{ item.provinceName }}{{ item.cityName }}{{ item.districtName
            }}{{ item.detail }}
          </view>
          <view class="label" v-if="item.label">
            标签：{{ getLabelText(item.label) }}
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="address-actions">
          <button class="edit-btn" @click="handleAddressOpen(item)">
            编辑地址
          </button>
          <button
            class="default-btn"
            @click="handleDefault(item)"
            v-if="item.isDefault !== 1"
          >
            设为默认
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-address" v-else>
      <text>暂无收货地址，快去添加吧～</text>
    </view>

    <!-- 新增地址按钮 -->
    <button class="add-btn" @click="handleAddressOpen()">新增收货地址</button>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../../common/store";
import type { Address } from "../../common/typs/address";
import { list, setDefault } from "../../common/api/address";

const userStore = useUserStore();

// 定义地址列表数据（指定精准类型）
const addressData = ref<Address[]>([]);

/**
 * 设为默认地址
 * @param item 地址项
 */
const handleDefault = async (item: Address) => {
  if (!item.id) {
    return uni.showToast({ title: "地址ID不存在", icon: "none" });
  }

  try {
    // 调用设为默认接口（传递地址ID）
    await setDefault({ id: item.id });
    uni.showToast({ title: "设为默认地址成功", icon: "success" });

    // 刷新列表（更新默认状态）
    await loadAddressList();
  } catch (err) {
    console.error("设为默认地址失败", err);
    uni.showToast({ title: "操作失败，请重试", icon: "none" });
  }
};

/**
 * 打开地址编辑页
 * @param address 可选：编辑的地址数据
 */
const handleAddressOpen = (address?: Address) => {
  // 传递当前编辑的地址到store
  if (address) {
    userStore.currentAddress = address;
  } else {
    userStore.currentAddress = undefined;
  }

  // 跳转到编辑页
  uni.navigateTo({
    url: "/pages/addressBook/addressBook",
  });
};

/**
 * 加载地址列表
 */
const loadAddressList = async () => {
  try {
    // 调用列表接口并指定返回类型
    const res = (await list()) as { data: Address[] };
    // 赋值并确保是数组类型
    addressData.value = res.data || [];
  } catch (err) {
    console.error("加载地址列表失败", err);
    uni.showToast({ title: "加载地址失败，请重试", icon: "none" });
    addressData.value = [];
  }
};

/**
 * 转换标签文本（兼容前端枚举值）
 * @param label 标签值
 * @returns 易读的标签文本
 */
const getLabelText = (label: string): string => {
  const labelMap = {
    home: "家",
    company: "公司",
    other: "其他",
    家: "家",
    公司: "公司",
    其他: "其他",
  };
  return labelMap[label as keyof typeof labelMap] || "未分类";
};

// 页面挂载时加载地址列表
onMounted(async () => {
  await loadAddressList();
});
</script>

<style scoped lang="scss">
.content {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

// 页面标题
.page-title {
  width: 100%;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #eee;
}

// 地址列表
.address-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

// 地址项
.address-item {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15rpx;

  // 地址信息
  .address-info {
    .name-phone {
      display: flex;
      align-items: center;
      gap: 20rpx;
      margin-bottom: 10rpx;

      .consignee {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }

      .phone {
        font-size: 28rpx;
        color: #666;
      }

      .default-tag {
        background-color: #007aff;
        color: #fff;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        margin-left: 10rpx;
      }
    }

    .address-detail {
      font-size: 28rpx;
      color: #333;
      line-height: 1.5;
    }

    .label {
      font-size: 24rpx;
      color: #999;
      margin-top: 5rpx;
    }
  }

  // 操作按钮
  .address-actions {
    display: flex;
    gap: 20rpx;
    margin-top: 10rpx;

    button {
      flex: 1;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      border-radius: 8rpx;
      border: none;
    }

    .edit-btn {
      background-color: #f5f5f5;
      color: #333;
    }

    .default-btn {
      background-color: #007aff;
      color: #fff;
    }

    button:active {
      opacity: 0.8;
    }
  }
}

// 空状态
.empty-address {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 100rpx 0;
}

// 新增按钮
.add-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 8rpx;
  border: none;
  margin-top: 20rpx;

  &:active {
    opacity: 0.8;
  }
}
</style>
