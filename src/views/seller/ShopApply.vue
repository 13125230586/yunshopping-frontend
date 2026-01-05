<template>
  <div class="shop-apply">
    <div class="page-container">
      <a-card title="店铺入驻申请">
        <a-form :model="form" layout="vertical">
          <a-form-item label="店铺名称" required>
            <a-input v-model:value="form.shopName" placeholder="请输入店铺名称" />
          </a-form-item>
          <a-form-item label="店铺Logo" required>
            <a-upload
              :show-upload-list="false"
              :before-upload="beforeLogoUpload"
              :custom-request="handleLogoUpload"
              accept="image/*"
            >
              <a-button type="primary" :loading="logoUploading">
                <upload-outlined />
                {{ logoUploading ? '上传中...' : '上传Logo' }}
              </a-button>
            </a-upload>
            <a-button
              v-if="form.shopLogo"
              danger
              style="margin-left: 8px"
              @click="handleDeleteLogo"
            >
              <delete-outlined />
              删除Logo
            </a-button>
            <div v-if="form.shopLogo" style="margin-top: 8px">
              <img :src="form.shopLogo" alt="Logo预览" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 1px solid #d9d9d9" />
            </div>
            <div style="margin-top: 8px">
              <a-typography-text type="secondary" style="font-size: 12px">
                支持常见图片格式，大小不超过 5MB
              </a-typography-text>
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
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { addShopUsingPost } from '@/api/shopController'
import { uploadShopPictureOssUsingPost, deleteFileByUrlOssUsingPost } from '@/api/fileController'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const logoUploading = ref(false)

const form = reactive({
  shopName: '',
  shopLogo: '',
  shopDescription: '',
  contactPhone: '',
  shopAddress: '',
})

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml'
]

const handleSubmit = async () => {
  if (!form.shopName) {
    message.error('请输入店铺名称')
    return
  }
  if (!form.shopLogo) {
    message.error('请上传店铺Logo')
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

const beforeLogoUpload = (file: File) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    message.error('只支持常见图片格式(JPG/PNG/GIF/WEBP/BMP/SVG)')
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    message.error('图片大小不能超过 5MB')
    return false
  }
  return true
}

const handleLogoUpload = async (options: any) => {
  const { file } = options

  if (!beforeLogoUpload(file)) {
    return
  }

  logoUploading.value = true
  try {
    const res = await uploadShopPictureOssUsingPost({}, file)

    if (res.code === 0 && res.data) {
      form.shopLogo = res.data.url || ''
      message.success('店铺Logo上传成功')
    } else {
      message.error(res.message || '上传失败')
    }
  } catch (error: any) {
    console.error('店铺Logo上传失败 uid:', userStore.userInfo?.id, error)
    message.error(error.message || '上传失败')
  } finally {
    logoUploading.value = false
  }
}

const handleDeleteLogo = async () => {
  if (!form.shopLogo) {
    return
  }

  try {
    const res = await deleteFileByUrlOssUsingPost({ fileUrl: form.shopLogo })

    if (res.code === 0) {
      form.shopLogo = ''
      message.success('店铺Logo删除成功')
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    console.error('删除店铺Logo失败 uid:', userStore.userInfo?.id, 'fileUrl:', form.shopLogo, error)
    message.error(error.message || '删除失败')
  }
}
</script>

<style scoped lang="less">
.page-container {
  max-width: 800px;
  margin: 24px auto;
}
</style>
