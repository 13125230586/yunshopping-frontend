<template>
  <div class="product-manage">
    <a-card title="商品管理">
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="商品名称">
          <a-input
            v-model:value="searchForm.productName"
            placeholder="请输入商品名称"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="商品状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择商品状态"
            style="width: 150px"
            allowClear
          >
            <a-select-option :value="0">已下架</a-select-option>
            <a-select-option :value="1">已上架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审核状态">
          <a-select
            v-model:value="searchForm.reviewStatus"
            placeholder="请选择审核状态"
            style="width: 150px"
            allowClear
          >
            <a-select-option :value="0">待审核</a-select-option>
            <a-select-option :value="1">已通过</a-select-option>
            <a-select-option :value="2">已拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :dataSource="products"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'mainImageUrl'">
            <img :src="record.mainImageUrl" alt="商品图片" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px" />
          </template>
          <template v-else-if="column.key === 'price'">
            ¥{{ record.price?.toFixed(2) }}
          </template>
          <template v-else-if="column.key === 'stock'">
            <a-tag v-if="record.stock <= 0" color="red">缺货</a-tag>
            <a-tag v-else-if="record.stock < 10" color="orange">{{ record.stock }}</a-tag>
            <span v-else>{{ record.stock }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag v-if="record.status === 1" color="green">已上架</a-tag>
            <a-tag v-else color="red">已下架</a-tag>
          </template>
          <template v-else-if="column.key === 'reviewStatus'">
            <a-tag v-if="record.reviewStatus === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.reviewStatus === 1" color="green">已通过</a-tag>
            <a-tag v-else-if="record.reviewStatus === 2" color="red">已拒绝</a-tag>
            <a-tag v-else color="gray">未知</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-button
                type="link"
                size="small"
                :style="{ color: record.status === 1 ? '#ff4d4f' : '#52c41a' }"
                @click="handleStatusChange(record)"
              >
                {{ record.status === 1 ? '下架' : '上架' }}
              </a-button>
              <a-popconfirm
                title="确定要删除该商品吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="editModalVisible"
      title="编辑商品"
      width="800px"
      @ok="handleUpdate"
      @cancel="editModalVisible = false"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="商品名称" required>
              <a-input v-model:value="editForm.productName" placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="品牌名称">
              <a-input v-model:value="editForm.brandName" placeholder="请输入品牌名称" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="商品标题">
          <a-input v-model:value="editForm.productTitle" placeholder="请输入商品标题" />
        </a-form-item>

        <a-form-item label="商品主图URL" required>
          <a-input v-model:value="editForm.mainImageUrl" placeholder="请输入商品主图URL" />
          <div v-if="editForm.mainImageUrl" style="margin-top: 8px">
            <img :src="editForm.mainImageUrl" alt="主图预览" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px" />
          </div>
        </a-form-item>

        <a-form-item label="商品描述">
          <a-textarea v-model:value="editForm.productDescription" :rows="4" placeholder="请输入商品描述" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="商品价格" required>
              <a-input-number v-model:value="editForm.price" :min="0" :precision="2" placeholder="请输入价格" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="原价">
              <a-input-number v-model:value="editForm.originalPrice" :min="0" :precision="2" placeholder="请输入原价" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="库存数量" required>
              <a-input-number v-model:value="editForm.stock" :min="0" placeholder="请输入库存" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位">
              <a-input v-model:value="editForm.unit" placeholder="件/个/盒" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="重量(kg)">
              <a-input-number v-model:value="editForm.weight" :min="0" :precision="2" placeholder="请输入重量" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  listProductByPageUsingPost,
  updateProductUsingPost,
  updateProductStatusUsingPost,
  deleteProductUsingPost,
} from '@/api/productController'

const products = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const searchForm = reactive({
  productName: '',
  status: undefined as number | undefined,
  reviewStatus: undefined as number | undefined,
})

const columns = [
  { title: '商品图片', dataIndex: 'mainImageUrl', key: 'mainImageUrl', width: 100 },
  { title: '商品名称', dataIndex: 'productName', key: 'productName', width: 200 },
  { title: '价格', dataIndex: 'price', key: 'price', width: 100 },
  { title: '库存', dataIndex: 'stock', key: 'stock', width: 100 },
  { title: '店铺', dataIndex: 'shopName', key: 'shopName', width: 150 },
  { title: '商品状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '审核状态', dataIndex: 'reviewStatus', key: 'reviewStatus', width: 100 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

const editModalVisible = ref(false)
const editForm = reactive({
  id: 0,
  productName: '',
  productTitle: '',
  productDescription: '',
  brandName: '',
  mainImageUrl: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  unit: '',
  weight: 0,
})

onMounted(() => {
  fetchProductList()
})

const fetchProductList = async () => {
  loading.value = true
  try {
    const params: any = {
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    }
    if (searchForm.productName) params.productName = searchForm.productName
    if (searchForm.status !== undefined) params.status = searchForm.status
    if (searchForm.reviewStatus !== undefined) params.reviewStatus = searchForm.reviewStatus

    const res = await listProductByPageUsingPost(params)
    if (res.code === 0 && res.data) {
      products.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取商品列表失败', error)
    message.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchProductList()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchProductList()
}

const handleReset = () => {
  searchForm.productName = ''
  searchForm.status = undefined
  searchForm.reviewStatus = undefined
  pagination.value.current = 1
  fetchProductList()
}

const showEditModal = (record: any) => {
  editForm.id = record.id
  editForm.productName = record.productName
  editForm.productTitle = record.productTitle || ''
  editForm.productDescription = record.productDescription || ''
  editForm.brandName = record.brandName || ''
  editForm.mainImageUrl = record.mainImageUrl
  editForm.price = record.price
  editForm.originalPrice = record.originalPrice || 0
  editForm.stock = record.stock
  editForm.unit = record.unit || ''
  editForm.weight = record.weight || 0
  editModalVisible.value = true
}

const handleUpdate = async () => {
  if (!editForm.productName) {
    message.error('请输入商品名称')
    return
  }
  if (!editForm.mainImageUrl) {
    message.error('请输入商品主图URL')
    return
  }
  if (!editForm.price || editForm.price <= 0) {
    message.error('请输入正确的商品价格')
    return
  }
  if (editForm.stock < 0) {
    message.error('请输入正确的库存数量')
    return
  }

  try {
    const res = await updateProductUsingPost({
      id: editForm.id,
      productName: editForm.productName,
      productTitle: editForm.productTitle,
      productDescription: editForm.productDescription,
      brandName: editForm.brandName,
      mainImageUrl: editForm.mainImageUrl,
      price: editForm.price,
      originalPrice: editForm.originalPrice,
      stock: editForm.stock,
      unit: editForm.unit,
      weight: editForm.weight,
    })
    if (res.code === 0) {
      message.success('更新成功')
      editModalVisible.value = false
      fetchProductList()
    } else {
      message.error(res.message || '更新失败')
    }
  } catch (error: any) {
    console.error('商品更新失败 productId:', editForm.id, error)
    message.error(error.message || '更新失败')
  }
}

const handleStatusChange = async (record: any) => {
  const newStatus = record.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '上架' : '下架'

  try {
    const res = await updateProductStatusUsingPost({
      id: record.id,
      status: newStatus,
    })
    if (res.code === 0) {
      message.success(`${statusText}成功`)
      fetchProductList()
    } else {
      message.error(res.message || `${statusText}失败`)
    }
  } catch (error: any) {
    console.error(`商品${statusText}失败 productId:`, record.id, `status:`, newStatus, error)
    message.error(error.message || `${statusText}失败`)
  }
}

const handleDelete = async (record: any) => {
  try {
    const res = await deleteProductUsingPost({
      id: record.id,
    })
    if (res.code === 0) {
      message.success('删除成功')
      fetchProductList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    console.error('商品删除失败 productId:', record.id, error)
    message.error(error.message || '删除失败')
  }
}

const formatTime = (time: string | undefined) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<style scoped lang="less">
.product-manage {
  :deep(.ant-table) {
    .ant-table-cell {
      vertical-align: middle;
    }
  }
}
</style>