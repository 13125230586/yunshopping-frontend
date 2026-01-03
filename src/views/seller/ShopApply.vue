<template>
  <div class="shop-apply">
    <div class="page-container">
      <a-card title="店铺入驻申请">
        <a-form :model="form" layout="vertical">
          <a-form-item label="店铺名称" required>
            <a-input v-model:value="form.shopName" placeholder="请输入店铺名称" />
          </a-form-item>
          <a-form-item label="店铺Logo URL" required>
            <a-input v-model:value="form.shopLogo" placeholder="请输入店铺Logo图片URL" />
            <div v-if="form.shopLogo" style="margin-top: 8px">
              <img :src="form.shopLogo" alt="Logo预览" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px" />
            </div>
          </a-form-item>
          <a-form-item label="店铺描述">
            <a-textarea v-model:value="form.shopDescription" :rows="4" placeholder="请输入店铺描述" />
          </a-form-item>
          <a-form-item label="联系电话" required>
            <a-input v-model:value="form.contactPhone" placeholder="请输入联系电话" />
          </a-form-item>
          <a-form-item label="店铺地址">
            <a-input v-model:value="form.shopAddress" placeholder="请输入店铺地址" />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" :loading="loading" @click="handleSubmit">提交申请</a-button>
              <a-button @click="router.push('/')">取消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { addShopUsingPost } from '@/api/shopController'

const router = useRouter()
const loading = ref(false)

const form = reactive({
  shopName: '',
  shopLogo: '',
  shopDescription: '',
  contactPhone: '',
  shopAddress: '',
})

const handleSubmit = async () => {
  if (!form.shopName) {
    message.error('请输入店铺名称')
    return
  }
  if (!form.shopLogo) {
    message.error('请输入店铺Logo')
    return
  }
  if (!form.contactPhone) {
    message.error('请输入联系电话')
    return
  }

  loading.value = true
  try {
    const res = await addShopUsingPost({
      shopName: form.shopName,
      shopLogo: form.shopLogo,
      shopDescription: form.shopDescription,
      contactPhone: form.contactPhone,
      shopAddress: form.shopAddress,
    })
    if (res.code === 0) {
      message.success('店铺申请已提交,请等待管理员审核')
      router.push('/')
    } else {
      message.error(res.message || '申请提交失败')
    }
  } catch (error: any) {
    message.error(error.message || '申请提交失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="less">
.page-container {
  max-width: 800px;
  margin: 24px auto;
}
</style>
