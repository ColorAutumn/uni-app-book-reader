<template>
  <view class="container">
    <uni-forms :modelValue="registerFormData" :rules="registerRules">
      <uni-forms-item label="姓名" name="name">
        <uni-easyinput type="text" v-model="registerFormData.username" placeholder="请输入用户名"/>
      </uni-forms-item>
      <uni-forms-item label="密码" name="password">
        <uni-easyinput type="password" v-model="registerFormData.password" placeholder="请输入密码"/>
      </uni-forms-item>
      <uni-forms-item label="重复密码" name="rePassword">
        <uni-easyinput type="password" v-model="registerFormData.rePassword"
                       placeholder="请输入密码"/>
        <view v-if="registerFormData.rePassword !== '' &&registerFormData.password !== registerFormData.rePassword"
              style="color: red">
          两次密码不一致
        </view>
      </uni-forms-item>
    </uni-forms>
    <view>
      <button @click="goToLogin">有账号？返回登录</button>
    </view>
    <button @click="onClickRegister">注册</button>
  </view>
</template>

<script setup lang="ts">
import {onShow} from "@dcloudio/uni-app";
import {ref} from "vue";
import type {CloudResultData} from "@/utils/typings";

const registerFormData = ref({
  username: '',
  password: '',
  rePassword: '',
})

const registerRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  rePassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
}

const username = ref('')
const password = ref('')
onShow(() => {
  uni.getStorage({
    key: 'loginUsername',
    success: function (res) {
      username.value = res.data
    },
  })
  uni.getStorage({
    key: 'loginPassword',
    success: function (res) {
      password.value = res.data
    },
  })
})

const goToLogin = () => {
  uni.navigateBack()
}

const onClickRegister = () => {
  if (registerFormData.value.password !== registerFormData.value.rePassword) {
    uni.showToast({
      title: '两次密码不一致',
      icon: 'none',
      duration: 2000
    })
  }
  if (registerFormData.value.username === '' || registerFormData.value.password === '') {
    uni.showToast({
      title: '请输入用户名或密码',
      icon: 'none',
      duration: 2000
    })
  }

  uniCloud.callFunction({
    name: 'register_user',
    data: registerFormData.value,
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
          data: registerFormData.value.username,
          success: () => {
            console.log("存储用户名成功")
          }
        })
        uni.setStorage({
          key: 'loginPassword',
          data: registerFormData.value.password,
          success: () => {
            console.log("存储密码成功")
          }
        })
        uni.setStorage({
          key: 'userInfo',
          data: JSON.stringify({username: registerFormData.value.username, loginStatus: true})
        })
        uni.navigateBack()
        console.log("跳转")
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '注册时发生异常',
        icon: 'none',
        duration: 2000
      })
    }
  })
}
</script>


<style scoped lang="scss">
.container{
  padding: 50rpx;
}
</style>
