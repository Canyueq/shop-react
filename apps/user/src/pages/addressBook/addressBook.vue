<template>
  <view class="content">
    <!-- 地址编辑区域 -->
    <view class="address-form">
      <!-- 联系人 + 性别选择 -->
      <view class="form-item">
        <view class="label">联系人:</view>
        <input
          class="input"
          placeholder="请填写收货人的姓名"
          v-model="address.consignee"
          @input="handleNameInput"
        />
        <view class="gender-group">
          <button
            class="gender-btn"
            :class="{ active: address.sex === '1' }"
            @click="address.sex = '1'"
          >
            先生
          </button>
          <button
            class="gender-btn"
            :class="{ active: address.sex === '0' }"
            @click="address.sex = '0'"
          >
            女士
          </button>
        </view>
      </view>

      <!-- 手机号 -->
      <view class="form-item">
        <view class="label">手机号:</view>
        <input
          class="input"
          placeholder="请填写收货人的手机号"
          v-model="address.phone"
          @input="handlePhoneInput"
          type="number"
        />
      </view>

      <!-- 省市区选择 -->
      <view class="form-item">
        <view class="label">所在地区:</view>
        <picker
          mode="region"
          @change="handleRegionChange"
          :value="[
            address.provinceName,
            address.cityName,
            address.districtName,
          ]"
          class="region-picker"
        >
          <view class="picker-input">
            {{
              address.provinceName && address.cityName && address.districtName
                ? `${address.provinceName} ${address.cityName} ${address.districtName}`
                : "请选择省/市/区"
            }}
          </view>
        </picker>
      </view>

      <!-- 收货地址 -->
      <view class="form-item">
        <view class="label">详细地址:</view>
        <input
          class="input full-width"
          placeholder="请填写详细收货地址（如街道、小区、门牌号）"
          v-model="address.detail"
          @input="handleAddressInput"
        />
      </view>

      <!-- 地址标签 -->
      <view class="form-item">
        <view class="label">标签:</view>
        <view class="tag-group">
          <button
            class="tag-btn"
            :class="{ active: address.label === 'home' }"
            @click="address.label = 'home'"
          >
            家
          </button>
          <button
            class="tag-btn"
            :class="{ active: address.label === 'company' }"
            @click="address.label = 'company'"
          >
            公司
          </button>
          <button
            class="tag-btn"
            :class="{ active: address.label === 'other' }"
            @click="address.label = 'other'"
          >
            其他
          </button>
        </view>
      </view>

      <!-- 默认地址选择 -->
      <view class="form-item">
        <view class="label">默认地址:</view>
        <switch
          :checked="address.isDefault === 1"
          @change="(e: any) => (address.isDefault = e.detail.value ? 1 : 0)"
        />
      </view>
    </view>

    <!-- 操作按钮组 -->
    <view class="btn-group">
      <button class="save-btn" @click="handleSave">保存地址</button>
      <button v-if="props.addressData" class="delete-btn" @click="handleDelete">
        删除地址
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Address } from "../../common/typs/address";
import { useUserStore } from "../../common/store";
import { deleteById, save, update } from "../../common/api/address";

// 定义 UniApp 事件类型（修复 UniNamespace 不存在的问题）
type UniInputEvent = {
  detail: {
    value: string | number;
  };
  target: any;
};

type UniPickerChangeEvent = {
  detail: {
    value: string[];
  };
  target: any;
};

const userStore = useUserStore();

// 定义组件属性
const props = defineProps<{
  open: boolean;
  addressData?: Address;
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: "save", address: Address): void;
  (e: "delete", addressId?: number | string): void;
  (e: "close"): void;
}>();

// 初始化地址数据（严格对齐 Address 接口）
const address = ref<Address>({
  consignee: "",
  phone: "",
  sex: "1",
  provinceCode: "",
  provinceName: "",
  cityCode: "",
  cityName: "",
  districtCode: "",
  districtName: "",
  detail: "",
  label: "other",
  isDefault: 0,
  userId: userStore.token ? Number(userStore.token) : undefined, // 替换不存在的 userInfo
  id: undefined,
});

// 监听props.addressData变化，同步到本地（移除不存在的属性引用）
watch(
  () => props.addressData,
  (newVal) => {
    if (newVal) {
      address.value = {
        ...newVal,
        consignee: newVal.consignee || "",
        sex: newVal.sex || "1",
        label: newVal.label || "other",
      };
    }
  },
  { immediate: true },
);

// 联系人姓名输入处理（指定正确的事件类型）
const handleNameInput = (e: UniInputEvent) => {
  const value = String(e.detail.value);
  if (value && !/^[\u4e00-\u9fa5a-zA-Z]+$/.test(value)) {
    uni.showToast({ title: "姓名只能包含中文/英文", icon: "none" });
  }
};

// 手机号输入处理（指定正确的事件类型）
const handlePhoneInput = (e: UniInputEvent) => {
  const phone = String(e.detail.value);
  if (phone) {
    if (phone.length > 11) {
      address.value.phone = phone.slice(0, 11);
      return;
    }
    if (phone.length === 11 && !/^1[3-9]\d{9}$/.test(phone)) {
      uni.showToast({ title: "手机号格式错误", icon: "none" });
    }
  }
};

// 地址输入处理（指定正确的事件类型）
const handleAddressInput = (e: UniInputEvent) => {
  const value = String(e.detail.value);
  if (!value.trim()) {
    uni.showToast({ title: "详细地址不能为空", icon: "none", duration: 1000 });
  }
};

// 省市区选择处理（指定正确的事件类型）
const handleRegionChange = (e: UniPickerChangeEvent) => {
  const [province, city, district] = e.detail.value;
  address.value = {
    ...address.value,
    provinceName: province,
    cityName: city,
    districtName: district,
  };
};

// 保存地址
const handleSave = async () => {
  const addr = address.value;

  // 基础校验
  if (!addr.consignee.trim()) {
    return uni.showToast({ title: "请填写联系人姓名", icon: "none" });
  }
  if (!/^1[3-9]\d{9}$/.test(addr.phone)) {
    return uni.showToast({ title: "请填写正确的手机号", icon: "none" });
  }
  // if (!addr.provinceName || !addr.cityName || !addr.districtName) {
  //   return uni.showToast({ title: "请选择所在地区", icon: "none" });
  // }
  if (!addr.detail.trim()) {
    return uni.showToast({ title: "请填写详细收货地址", icon: "none" });
  }

  try {
    // 替换不存在的 userInfo，改用 token 或其他存在的字段
    addr.userId = userStore.token ? Number(userStore.token) : undefined;
    if (addr.id) {
      await update(addr);
      uni.showToast({ title: "修改成功", icon: "success" });
    } else {
      await save(addr);
      uni.showToast({ title: "新增成功", icon: "success" });
    }
    emit("save", addr);
    emit("close");
    userStore.currentAddress = undefined;
  } catch (err) {
    console.error("保存地址失败", err);
    uni.showToast({ title: "保存失败，请重试", icon: "none" });
  }
};

// 删除地址（修复 ID 类型不匹配问题）
const handleDelete = async () => {
  const addrId = address.value.id;
  if (!addrId) {
    return uni.showToast({ title: "地址ID不存在", icon: "none" });
  }

  uni.showModal({
    title: "提示",
    content: "确定要删除该地址吗？",
    async success(res) {
      if (res.confirm) {
        try {
          // 转换为 number 类型，匹配 deleteById 参数要求
          await deleteById(Number(addrId));
          uni.showToast({ title: "删除成功", icon: "success" });
          emit("delete", addrId);
          emit("close");
        } catch (err) {
          console.error("删除地址失败", err);
          uni.showToast({ title: "删除失败，请重试", icon: "none" });
        }
      }
    },
  });
};
</script>

<style scoped lang="scss">
// 全局容器
.content {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

// 表单区域
.address-form {
  width: 100%;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

// 表单项样式
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  flex-wrap: wrap;

  .label {
    width: 120rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }

  .input {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 20rpx;
    border: 1px solid #eee;
    border-radius: 8rpx;
    font-size: 28rpx;
    box-sizing: border-box;
    background-color: #fafafa;

    &.full-width {
      width: calc(100% - 120rpx);
      margin-top: 10rpx;
      margin-left: 120rpx;
    }
  }

  // 性别选择组
  .gender-group {
    display: flex;
    gap: 10rpx;
    margin-left: 20rpx;

    .gender-btn {
      padding: 10rpx 20rpx;
      font-size: 24rpx;
      border: 1px solid #eee;
      border-radius: 8rpx;
      background: #fff;

      &.active {
        background: #007aff;
        color: #fff;
        border-color: #007aff;
      }
    }
  }

  // 标签选择组
  .tag-group {
    display: flex;
    gap: 20rpx;
    margin-left: 20rpx;
    flex-wrap: wrap;

    .tag-btn {
      padding: 10rpx 20rpx;
      font-size: 24rpx;
      border: 1px solid #eee;
      border-radius: 8rpx;
      background: #fff;

      &.active {
        background: #007aff;
        color: #fff;
        border-color: #007aff;
      }
    }
  }

  // 地区选择器
  .region-picker {
    flex: 1;
    height: 80rpx;

    .picker-input {
      width: 100%;
      height: 100%;
      line-height: 80rpx;
      padding: 0 20rpx;
      border: 1px solid #eee;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #666;
      background-color: #fafafa;
    }
  }
}

// 按钮组样式
.btn-group {
  display: flex;
  gap: 20rpx;
  justify-content: center;
  padding: 0 20rpx;

  button {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    border-radius: 8rpx;
    border: none;
  }

  .save-btn {
    background: #007aff;
    color: #fff;
  }

  .delete-btn {
    background: #ff3b30;
    color: #fff;
  }

  button:active {
    opacity: 0.8;
  }
}
</style>
