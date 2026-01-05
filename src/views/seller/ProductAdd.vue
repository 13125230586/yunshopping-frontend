<template>
  <div class="product-add">
    <a-card title="添加商品">
      <a-form :model="form" layout="vertical" :label-col="{ span: 24 }">
        <a-form-item label="商品名称" required>
          <a-input v-model:value="form.productName" placeholder="请输入商品名称" />
        </a-form-item>
        <a-form-item label="商品主图" required>
          <a-upload
            :show-upload-list="false"
            :before-upload="beforeImageUpload"
            :custom-request="handleImageUpload"
            accept="image/*"
          >
            <a-button type="primary" :loading="imageUploading">
              <upload-outlined />
              {{ imageUploading ? '上传中...' : '上传图片' }}
            </a-button>
          </a-upload>
          <a-button
            v-if="form.mainImageUrl"
            danger
            style="margin-left: 8px"
            @click="handleDeleteImage"
          >
            <delete-outlined />
            删除图片
          </a-button>
          <div v-if="form.mainImageUrl" style="margin-top: 8px">
            <img :src="form.mainImageUrl" alt="商品主图预览" style="width: 120px; height: 120px; object-fit: cover; border: 1px solid #d9d9d9; border-radius: 4px" />
          </div>
          <div style="margin-top: 8px">
            <a-typography-text type="secondary" style="font-size: 12px">
              支持常见图片格式，大小不超过 5MB
            </a-typography-text>
          </div>
        </a-form-item>
        <a-form-item label="商品描述">
          <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入商品描述" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="商品价格" required>
              <a-input-number v-model:value="form.price" :min="0" :precision="2" placeholder="请输入价格" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="库存数量" required>
              <a-input-number v-model:value="form.stock" :min="0" placeholder="请输入库存" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="商品分类" required>
              <a-cascader
                v-model:value="selectedCategory"
                :options="categoryStore.categoryTree"
                :field-names="{ label: 'categoryName', value: 'id', children: 'children' }"
                placeholder="请选择商品分类"
                change-on-select
                style="width: 100%"
                @change="handleCategoryChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="loading" @click="handleSubmit">提交商品</a-button>
            <a-button @click="router.push('/seller/products')">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { addProductUsingPost } from '@/api/productController'
import { listShopByPageUsingPost } from '@/api/shopController'
import { uploadProductPictureOssUsingPost, deleteFileByUrlOssUsingPost } from '@/api/fileController'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const categoryStore = useCategoryStore()
const userStore = useUserStore()
const loading = ref(false)
const imageUploading = ref(false)
const selectedCategory = ref<number[]>([])

const form = reactive({
  productName: '',
  mainImageUrl: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: undefined as number | undefined,
  shopId: undefined as number | undefined,
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

onMounted(async () => {
  await categoryStore.fetchCategoryTree()
  await fetchShopId()
})

const fetchShopId = async () => {
  try {
    const res = await listShopByPageUsingPost({
      current: 1,
      pageSize: 1,
      userId: userStore.userInfo?.id,
    })
    if (res.code === 0 && res.data && res.data.records && res.data.records.length > 0) {
      form.shopId = res.data.records[0].id
    } else {
      message.error('您还没有店铺,请先申请开店')
      router.push('/seller/apply')
    }
  } catch (error) {
    console.error('获取店铺信息失败 userId:', userStore.userInfo?.id, error)
    message.error('获取店铺信息失败')
    router.push('/seller/apply')
  }
}

const handleCategoryChange = (value: number[]) => {
  if (value && value.length > 0) {
    form.categoryId = value[value.length - 1]
  } else {
    form.categoryId = undefined
  }
}

const handleSubmit = async () => {
  if (!form.productName) {
    message.error('请输入商品名称')
    return
  }
  if (!form.mainImageUrl) {
    message.error('请上传商品主图')
    return
  }
  if (!form.price || form.price <= 0) {
    message.error('请输入正确的商品价格')
    return
  }
  if (!form.stock || form.stock < 0) {
    message.error('请输入正确的库存数量')
    return
  }
  if (!form.categoryId) {
    message.error('请选择商品分类')
    return
  }

  if (!form.shopId) {
    message.error('店铺信息缺失,请重新进入页面')
    return
  }

  loading.value = true
  try {
    const res = await addProductUsingPost({
      productName: form.productName,
      mainImageUrl: form.mainImageUrl,
      description: form.description,
      price: form.price,
      stock: form.stock,
      categoryId: form.categoryId,
      shopId: form.shopId,
    })
    if (res.code === 0) {
      message.success('商品已提交,请等待管理员审核')
      router.push('/seller/products')
    } else {
      message.error(res.message || '商品添加失败')
    }
  } catch (error: any) {
    message.error(error.message || '商品添加失败')
  } finally {
    loading.value = false
  }
}

const beforeImageUpload = (file: File) => {
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

const handleImageUpload = async (options: any) => {
  const { file } = options

  if (!beforeImageUpload(file)) {
    return
  }

  imageUploading.value = true
  try {
    const res = await uploadProductPictureOssUsingPost({}, file)

    if (res.code === 0 && res.data) {
      form.mainImageUrl = res.data.url || ''
      message.success('商品图片上传成功')
    } else {
      message.error(res.message || '上传失败')
    }
  } catch (error: any) {
    console.error('商品图片上传失败 uid:', userStore.userInfo?.id, error)
    message.error(error.message || '上传失败')
  } finally {
    imageUploading.value = false
  }
}

const handleDeleteImage = async () => {
  if (!form.mainImageUrl) {
    return
  }

  try {
    const res = await deleteFileByUrlOssUsingPost({ fileUrl: form.mainImageUrl })

    if (res.code === 0) {
      form.mainImageUrl = ''
      message.success('商品图片删除成功')
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    console.error('删除商品图片失败 uid:', userStore.userInfo?.id, 'fileUrl:', form.mainImageUrl, error)
    message.error(error.message || '删除失败')
  }
}
</script>

<style scoped lang="less">
.product-add {
  :deep(.ant-form-item-label) {
    font-weight: 500;
  }
}
</style>
