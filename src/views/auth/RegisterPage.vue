<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1>网上商城系统</h1>
        <p>欢迎注册</p>
      </div>
      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleRegister"
        layout="vertical"
        class="register-form"
      >
        <a-form-item label="账号" name="userAccount">
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号（4-16位字母数字下划线）"
            size="large"
          >
            <template #prefix>
              <user-outlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="密码" name="userPassword">
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码（8-16位）"
            size="large"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" name="checkPassword">
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请再次输入密码"
            size="large"
          >
            <template #prefix>
              <lock-outlined />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading">
            注册
          </a-button>
        </a-form-item>
        <div class="register-footer">
          <span>已有账号？</span>
          <a @click="$router.push('/login')">立即登录</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userRegisterUsingPost } from '@/api/yonghujiekou'
import { validateAccount, validatePassword } from '@/utils'

const router = useRouter()
const loading = ref(false)

const formState = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const rules = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { validator: (_: any, value: string) => {
      if (!validateAccount(value)) {
        return Promise.reject('账号格式不正确，需要4-16位字母数字下划线')
      }
      return Promise.resolve()
    }},
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    { validator: (_: any, value: string) => {
      if (!validatePassword(value)) {
        return Promise.reject('密码格式不正确，需要8-16位')
      }
      return Promise.resolve()
    }},
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码' },
    { validator: (_: any, value: string) => {
      if (value !== formState.userPassword) {
        return Promise.reject('两次输入的密码不一致')
      }
      return Promise.resolve()
    }},
  ],
}

const handleRegister = async () => {
  loading.value = true
  try {
    // 注意：新用户注册时，后端应该自动设置 userRole 为 'user'（买家）
    // 卖家角色需要通过申请店铺并审核通过后由后端升级
    // 管理员角色由超级管理员在后台手动指定
    const res = await userRegisterUsingPost(formState)
    if (res.code === 0) {
      message.success('注册成功，请登录')
      router.push('/login')
    }
  } catch (error: any) {
    message.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    color: #1890ff;
    margin-bottom: 8px;
  }

  p {
    color: #666;
    font-size: 16px;
  }
}

.register-form {
  margin-top: 24px;
}

.register-footer {
  text-align: center;
  margin-top: 16px;

  a {
    color: #1890ff;
    margin-left: 8px;
  }
}
</style>