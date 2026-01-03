<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>网上商城系统</h1>
        <p>欢迎登录</p>
      </div>
      <a-form
        :model="formState"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
        class="login-form"
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
        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading">
            登录
          </a-button>
        </a-form-item>
        <div class="login-footer">
          <span>还没有账号？</span>
          <a @click="$router.push('/register')">立即注册</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { validateAccount, validatePassword } from '@/utils'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)

const formState = reactive({
  userAccount: '',
  userPassword: '',
})

const rules = {
  userAccount: [
    { required: true, message: '请输入账号' },
    {
      validator: (_: any, value: string) => {
        if (!validateAccount(value)) {
          return Promise.reject('账号格式不正确，需要4-16位字母数字下划线')
        }
        return Promise.resolve()
      },
    },
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    {
      validator: (_: any, value: string) => {
        if (!validatePassword(value)) {
          return Promise.reject('密码格式不正确，需要8-16位')
        }
        return Promise.resolve()
      },
    },
  ],
}

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await userStore.login(formState.userAccount, formState.userPassword)
    if (res.code === 0) {
      message.success('登录成功')

      // 根据用户实际角色跳转到不同页面
      const userRole = userStore.userInfo?.userRole
      let redirectPath = '/'

      if (userRole === 'seller') {
        redirectPath = '/seller'
      } else if (userRole === 'admin') {
        redirectPath = '/admin'
      } else {
        // 默认跳转到买家首页
        redirectPath = '/'
      }

      // 如果有重定向参数则优先使用
      const redirect = (route.query.redirect as string) || redirectPath
      await router.push(redirect)
    } else {
      message.error(res.message || '登录失败')
    }
  } catch (error: any) {
    message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
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

.login-form {
  margin-top: 24px;
}

.login-footer {
  text-align: center;
  margin-top: 16px;

  a {
    color: #1890ff;
    margin-left: 8px;
  }
}
</style>