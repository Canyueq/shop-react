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
          scroll-y="{{true}}"
          scroll-with-animation="{{true}}"
          scroll-top="{{scrollTop + 100}}"
          scroll-into-view="{{itemId}}"
        >
          <block v-for="(item, index) in typeListData" :key="index">
            <view
              class="type_item {{typeIndex === index ? 'active' : ''}}"
              id="target"
              @click="swichMenu(item)"
              data-index="{{index}}"
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
        <view class="vegetable_order_list" scroll-y="true" scroll-top="0rpx">
          <block v-for="(item, index) in dishListItems" :key="index">
            <view class="dish_item">
              <!-- 菜品图片 -->
              <view class="dish_img" @click="openDetailHandle(item)">
                <image
                  class="dish_img_url"
                  mode="aspectFill"
                  :src="item.image"
                ></image>
              </view>
              <!-- 菜品信息 -->
              <view class="dish_info">
                <view
                  class="dish_name"
                  @click="openDetailHandle(item)"
                  data-index="{{index}}"
                  >{{ item.name }}</view
                >
                <view
                  class="dish_label"
                  @click="openDetailHandle(item)"
                  data-index="{{index}}"
                  >{{ item.description || item.name }}</view
                >
                <view
                  class="dish_label"
                  @click="openDetailHandle(item)"
                  data-index="{{index}}"
                  >月销量0</view
                >
                <view class="dish_price">
                  <text class="ico">￥</text>{{ item.price }}
                </view>

                <!-- 无规格菜品：加减按钮 -->
                <block v-if="!item.flavors || item.flavors.length === 0">
                  <view class="dish_active">
                    <block v-if="item.dishNumber >= 1">
                      <image
                        class="dish_red"
                        src="../../static/btn_red.png"
                        @click="redDishAction"
                        data-type="普通"
                        data-index="{{index}}"
                      ></image>
                    </block>
                    <block v-if="item.dishNumber > 0">
                      <text class="dish_number">{{ item.dishNumber }}</text>
                    </block>
                    <image
                      class="dish_add"
                      src="../../static/btn_add.png"
                      @click="addDishAction(item)"
                      data-type="普通"
                      data-index="{{index}}"
                    ></image>
                  </view>
                  <Pop
                    confirm-text="加入购物车"
                    pop-text="+"
                    @beforeClick="addDishAction(item)"
                  >
                    <view>{{ popContent }}</view>
                  </Pop>
                </block>

                <!-- 有规格菜品：选择规格按钮 -->
                <!-- <block uni:else>
                  <view class="dish_active_btn">
                    <view
                      class="check_but"
                      @click="moreNormDataesHandle"
                      data-index="{{index}}"
                      >选择规格</view
                    >
                  </view>
                </block> -->
                <Pop v-else confirm-text="加入购物车" pop-text="选择规格">
                  <view>{{ item.name }}</view>
                </Pop>
              </view>
            </view>
          </block>
          <view class="seize_seat"></view>
        </view>
      </block>

      <!-- 无菜品提示 -->
      <block v-else>
        <view class="vegetable_order_list">
          <block v-if="typeListData.length > 0">
            <view>该分类下暂无菜品</view>
          </block>
        </view>
      </block>
    </view>
    <Footer class="restaurant_footer" />
    <!-- <modal v-if="open">
      <button class="dish_close" @click="handleClose">×</button>
      <view> name+price </view>
    </modal> -->
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { dishListItem, DishType, SetmealType } from "./type";
import Pop from "../../components/common/Pop.vue";
const open = ref(false);
const shopStatus = ref(0);
const code = ref<string>();
const token = ref<string>();
const typeListData = ref<any[]>([]);
const dishListItems = ref<dishListItem[]>([]);
const popContent = ref();
const getList = () => {
  uni.request({
    url: "http://localhost:8080/user/category/list",
    method: "GET",
    header: {
      authentication: token.value,
    },
    success: (res: any) => {
      console.log("获取分类列表结果", res);
      typeListData.value = res.data.data;
    },
  });
};
const swichMenu = (item: any) => {
  console.log("item", item);
  if (item.type === 2) {
    uni.request({
      url: `http://localhost:8080/user/setmeal/list?categoryId=${item.id}`,
      header: {
        authentication: token.value,
      },
      success: (res: any) => {
        console.log("获取分类的查询结果", res.data.data);
        dishListItems.value = res.data.data;
      },
    });
  } else {
    uni.request({
      url: `http://localhost:8080/user/dish/list?categoryId=${item.id}`,
      header: {
        authentication: token.value,
      },
      success: (res: any) => {
        console.log("获取分类的查询结果", res.data.data);
        dishListItems.value = res.data.data;
      },
    });
  }
};
const openDetailHandle = (item: dishListItem) => {
  console.log("open");
  // showModalConfirm(item);
};
const handleClose = () => {
  open.value = false;
};
const redDishAction = () => {
  console.log("switch");
};
const addDishAction = (item: any) => {
  uni.request({
    url: `http://localhost:8080/user/setmeal/dish/${item.id}`,
    header: {
      authentication: token.value,
    },
    success: (res: any) => {
      console.log("查询该分类套餐的菜品", res.data);
      popContent.value = res.data.data;
    },
  });
};
const moreNormDataesHandle = () => {
  console.log("switch");
};
onMounted(() => {
  uni.request({
    url: "http://localhost:8080/user/shop/status",
    method: "GET",
    success: (res: any) => {
      console.log(shopStatus.value);
      console.log("获取店铺状态", res);
      shopStatus.value = res.data.data;
      console.log(shopStatus.value);
    },
  });
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
          token.value = res.data.data.token;
          getList();
        },
      });
    },
  });
});
</script>
<style>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.restaurant_top {
  height: 10%;
}
.restaurant_menu_list {
  height: 80%;
}
.type_list {
  width: 30%;
  height: 100%;
  box-shadow: 0 0 1px 1px grey;
  display: inline-block;
  overflow-y: auto;
}
.type_item {
  display: flex;
  margin-bottom: 40px;
}
.vegetable_order_list {
  height: 100%;
  width: 70%;
  box-shadow: 0 0 1px 1px grey;
  display: inline-block;
  overflow-y: auto;
}
.dish_item {
  display: flex;
}
.dish_info {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 60%;
}
.dish_img {
  width: 40%;
}
.dish_img_url {
  width: 100px;
  height: 100px;
}
.dish_name {
  display: flex;
  flex-direction: row;
}
.dish_label {
  display: flex;
  flex-direction: row;
}
.dish_add {
  width: 20px;
  height: 20px;
}
.dish_close {
  width: 20px;
  height: 20px;
}
.restaurant_footer {
  height: 10%;
}
</style>
