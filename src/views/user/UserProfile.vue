<template>
  <div class="user-profile">
    <a-card title="个人中心" class="profile-card">
      <a-tabs v-model:activeKey="activeTab" type="card">
        <!-- 个人资料标签页 -->
        <a-tab-pane key="profile" tab="个人资料">
          <a-spin :spinning="profileLoading">
            <a-form
              :model="profileForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
              class="profile-form"
            >
              <!-- 头像 -->
              <a-form-item label="头像">
                <div class="avatar-section">
                  <a-avatar
                    :size="100"
                    :src="profileForm.userAvatar || 'https://via.placeholder.com/100'"
                    class="user-avatar"
                  />
                  <div class="avatar-input">
                    <a-input
                      v-model:value="profileForm.userAvatar"
                      placeholder="请输入头像URL"
                      style="margin-bottom: 8px"
                    />
                    <a-typography-text type="secondary" style="font-size: 12px">
                      提示:请输入图片链接地址
                    </a-typography-text>
                  </div>
                </div>
              </a-form-item>

              <!-- 昵称 -->
              <a-form-item
                label="昵称"
                name="userName"
                :rules="[
                  { required: true, message: '请输入昵称' },
                  { min: 2, max: 20, message: '昵称长度为2-20个字符' },
                ]"
              >
                <a-input
                  v-model:value="profileForm.userName"
                  placeholder="请输入昵称"
                  :maxlength="20"
                />
              </a-form-item>

              <!-- 账号(只读) -->
              <a-form-item label="账号">
                <a-input :value="userStore.userInfo?.userAccount" disabled />
              </a-form-item>

              <!-- 角色(只读) -->
              <a-form-item label="角色">
                <a-tag :color="getRoleColor()">{{ getRoleText() }}</a-tag>
              </a-form-item>

              <!-- 个人简介 -->
              <a-form-item label="个人简介" name="userProfile">
                <a-textarea
                  v-model:value="profileForm.userProfile"
                  placeholder="介绍一下自己吧"
                  :rows="4"
                  :maxlength="200"
                  show-count
                />
              </a-form-item>

              <!-- 操作按钮 -->
              <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                <a-space>
                  <a-button type="primary" @click="handleUpdateProfile" :loading="profileLoading">
                    保存修改
                  </a-button>
                  <a-button @click="handleResetProfile">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-spin>
        </a-tab-pane>

        <!-- 修改密码标签页 -->
        <a-tab-pane key="password" tab="修改密码">
          <a-spin :spinning="passwordLoading">
            <a-form
              ref="passwordFormRef"
              :model="passwordForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
              class="password-form"
            >
              <!-- 旧密码 -->
              <a-form-item
                label="旧密码"
                name="oldPassword"
                :rules="[{ required: true, message: '请输入旧密码' }]"
              >
                <a-input-password
                  v-model:value="passwordForm.oldPassword"
                  placeholder="请输入旧密码"
                  autocomplete="off"
                />
              </a-form-item>

              <!-- 新密码 -->
              <a-form-item
                label="新密码"
                name="newPassword"
                :rules="[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message: '密码长度至少8位' },
                  { validator: validateNewPassword },
                ]"
              >
                <a-input-password
                  v-model:value="passwordForm.newPassword"
                  placeholder="请输入新密码(至少8位)"
                  autocomplete="new-password"
                />
              </a-form-item>

              <!-- 确认密码 -->
              <a-form-item
                label="确认密码"
                name="checkPassword"
                :rules="[
                  { required: true, message: '请再次输入新密码' },
                  { validator: validateCheckPassword },
                ]"
              >
                <a-input-password
                  v-model:value="passwordForm.checkPassword"
                  placeholder="请再次输入新密码"
                  autocomplete="new-password"
                />
              </a-form-item>

              <!-- 操作按钮 -->
              <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                <a-space>
                  <a-button type="primary" @click="handleUpdatePassword" :loading="passwordLoading">
                    修改密码
                  </a-button>
                  <a-button @click="handleResetPassword">重置</a-button>
                </a-space>
              </a-form-item>

              <!-- 密码安全提示 -->
              <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
                <a-alert
                  message="密码安全提示"
                  description="为了您的账号安全,建议密码包含大小写字母、数字和特殊字符,长度不少于8位"
                  type="info"
                  show-icon
                />
              </a-form-item>
            </a-form>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { updateProfileUsingPost, updatePasswordUsingPost } from '@/api/yonghujiekou'

const userStore = useUserStore()
const activeTab = ref('profile')

const profileLoading = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref<FormInstance>()

const profileForm = reactive({
  userName: '',
  userAvatar: '',
  userProfile: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  checkPassword: '',
})

onMounted(() => {
  initProfileForm()
})

const initProfileForm = () => {
  profileForm.userName = userStore.userInfo?.userName || ''
  profileForm.userAvatar = userStore.userInfo?.userAvatar || ''
  profileForm.userProfile = userStore.userInfo?.userProfile || ''
}

const getRoleText = () => {
  const role = userStore.userInfo?.userRole
  if (role === 'buyer') return '买家'
  if (role === 'seller') return '卖家'
  if (role === 'admin') return '管理员'
  return '未知'
}

const getRoleColor = () => {
  const role = userStore.userInfo?.userRole
  if (role === 'buyer') return 'blue'
  if (role === 'seller') return 'green'
  if (role === 'admin') return 'red'
  return 'default'
}

const validateNewPassword = (rule: any, value: any) => {
  if (value && value === passwordForm.oldPassword) {
    return Promise.reject('新密码不能与旧密码相同')
  }
  return Promise.resolve()
}

const validateCheckPassword = (rule: any, value: any) => {
  if (value && value !== passwordForm.newPassword) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const handleUpdateProfile = async () => {
  if (!profileForm.userName || profileForm.userName.trim().length < 2) {
    message.error('昵称长度至少2个字符')
    return
  }

  profileLoading.value = true
  try {
    const res = await updateProfileUsingPost({
      userName: profileForm.userName.trim(),
      userAvatar: profileForm.userAvatar?.trim() || undefined,
      userProfile: profileForm.userProfile?.trim() || undefined,
    })

    if (res.code === 0) {
      message.success('个人资料更新成功')
      await userStore.fetchLoginUser()
      initProfileForm()
    } else {
      message.error(res.message || '更新失败')
    }
  } catch (error: any) {
    console.error('更新个人资料失败', error)
    message.error(error.message || '更新失败')
  } finally {
    profileLoading.value = false
  }
}

const handleResetProfile = () => {
  initProfileForm()
  message.info('已重置为当前资料')
}

const handleUpdatePassword = async () => {
  try {
    await passwordFormRef.value?.validate()
  } catch (error) {
    console.log('密码表单验证失败', error)
    return
  }

  if (passwordForm.newPassword.length < 8) {
    message.error('新密码长度至少8位')
    return
  }

  if (passwordForm.newPassword !== passwordForm.checkPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  passwordLoading.value = true
  try {
    const res = await updatePasswordUsingPost({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
      checkPassword: passwordForm.checkPassword,
    })

    if (res.code === 0) {
      message.success('密码修改成功,请重新登录')
      handleResetPassword()
      setTimeout(() => {
        userStore.logout()
      }, 1500)
    } else {
      message.error(res.message || '密码修改失败')
    }
  } catch (error: any) {
    console.error('修改密码失败', error)
    message.error(error.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.checkPassword = ''
  passwordFormRef.value?.clearValidate()
}
</script>

<style scoped lang="less">
.user-profile {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  .profile-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.ant-card-head-title) {
      font-size: 18px;
      font-weight: 600;
    }
  }

  .profile-form,
  .password-form {
    max-width: 800px;
    margin: 24px auto;
  }

  .avatar-section {
    display: flex;
    align-items: flex-start;
    gap: 24px;

    .user-avatar {
      flex-shrink: 0;
      border: 2px solid #f0f0f0;
    }

    .avatar-input {
      flex: 1;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 24px;
  }

  :deep(.ant-tabs-card) {
    .ant-tabs-tab {
      padding: 12px 24px;
      font-size: 14px;
    }
  }
}
</style>