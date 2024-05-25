<template>
  <view v-if="userInfo.loginStatus">
    <uni-card title="欢迎你">
      <text class="uni-body">用户：{{ userInfo.username }}</text>
    </uni-card>
    <view class="login-container box">
      <button class="button popup-info" @click="this.$refs.alertDialog.open()">
        <text
            class="button-text info-text">注销
        </text>
      </button>
    </view>
    <view>
      <uni-popup ref="alertDialog" type="dialog">
        <uni-popup-dialog type="info" cancelText="取消" confirmText="确认" title="通知"
                          content="确认注销当前账户？" @confirm="confirmLogout"
                          @close="dialogClose"></uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
  <view v-else class="container">
    <uni-forms :modelValue="loginFormData">
      <uni-forms-item label="姓名" name="name">
        <uni-easyinput type="text" v-model="loginFormData.username" placeholder="请输入用户名"/>
      </uni-forms-item>
      <uni-forms-item label="密码" name="password">
        <uni-easyinput type="password" v-model="loginFormData.password" placeholder="请输入密码"/>
      </uni-forms-item>
    </uni-forms>
    <view>
      <button @click="goToRegister">暂无账号？前往注册</button>
    </view>
    <button @click="onClickLogin">登录</button>
  </view>
</template>

<script setup lang="ts">
import {onShow} from "@dcloudio/uni-app";
import {ref} from "vue";
import type {CloudResultData, UserInfo} from "@/utils/typings";

const userInfo = ref<UserInfo>({
  loginStatus: false,
  username: "",
})

onShow(() => {
  uni.getStorage({
    key: "userInfo",
    success: (res) => {
      userInfo.value = JSON.parse(res.data)
    },
    fail: () => {
    }
  })
})

const dialogClose = () => {
  console.log('点击关闭')
}

const confirmLogout = () => {
  uni.removeStorage({
    key: "userInfo",
    success: () => {
      userInfo.value = {
        username: "",
        loginStatus: false
      }
      uni.showToast({
        title: "已退出登录",
        icon: "none"
      })
    }
  })
  console.log("登出")
}
const loginFormData = ref({
  username: "",
  password: ""
})

const goToRegister = () => {
  if (loginFormData.value.username) {
    uni.setStorage({
      key: 'loginUsername',
      data: loginFormData.value.username
    })
  }
  if (loginFormData.value.password) {
    uni.setStorage({
      key: 'loginPassword',
      data: loginFormData.value.password
    })
  }
  uni.navigateTo({
    url: '/pages/myInfo/Register'
  })
}

const onClickLogin = () => {
  if (loginFormData.value.username && loginFormData.value.password) {
    uniCloud.callFunction({
      name: 'login_user',
      data: {
        username: loginFormData.value.username,
        password: loginFormData.value.password
      },
      success: (res) => {
        const result: CloudResultData = res.result
        uni.showToast({
          title: result.message,
          icon: result.code === 0 ? 'success' : 'error',
          duration: 2000
        })
        if (result.code === 0) {
          uni.setStorage({
            key: 'loginUsername',
            data: loginFormData.value.username
          })
          uni.setStorage({
            key: 'loginPassword',
            data: loginFormData.value.password
          })
          uni.setStorage({
            key: 'userInfo',
            data: JSON.stringify({username: loginFormData.value.username, loginStatus: true})
          })
          userInfo.value = {username: loginFormData.value.username, loginStatus: true}
          console.log("保存信息")
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '登录时发生异常',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
}
</script>


<style scoped lang="scss">
.container{
  padding: 50rpx;
}
@mixin flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

@mixin height {
  /* #ifndef APP-NVUE */
  height: 100%;
  /* #endif */
  /* #ifdef APP-NVUE */
  flex: 1;
  /* #endif */
}

.box {
  @include flex;
}

.button {
  @include flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 35px;
  margin: 0 5px;
  border-radius: 5px;
}

.login-container {
  background-color: #fff;
  padding: 10px 0;
}

.button-text {
  color: #fff;
  font-size: 12px;
}


.popup-height {
  @include height;
  width: 200px;
}

.text {
  font-size: 12px;
  color: #333;
}

.popup-info {
  color: #fff;
  background-color: #f2f6fc;
}

.info-text {
  color: #909399;
}

.dialog,
.share {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
}

.dialog-box {
  padding: 10px;
}

.dialog .button,
.share .button {
  /* #ifndef APP-NVUE */
  width: 100%;
  /* #endif */
  margin: 10px 0 0;
  padding: 3px 0;
  flex: 1;
}

.dialog-text {
  font-size: 14px;
  color: #333;
}
</style>

