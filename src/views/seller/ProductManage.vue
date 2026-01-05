<template>
  <div class="product-manage">
    <div class="page-header">
      <a-button type="primary" @click="$router.push('/seller/product/add')">
        <plus-outlined />
        添加商品
      </a-button>
    </div>

    <a-table
      :dataSource="productList"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      rowKey="id"
      @change="handleTableChange"
    >
      <!-- 商品信息列 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'product'">
          <div class="product-info">
            <a-image :src="record.mainImageUrl" :width="60" :height="60" class="product-image" />
            <div class="product-detail">
              <div class="product-name">{{ record.productName }}</div>
              <div class="product-desc">{{ record.productDescription || record.productTitle }}</div>
            </div>
          </div>
        </template>

        <!-- 价格列 -->
        <template v-else-if="column.key === 'price'">
          <div class="price-info">
            <div class="current-price">¥{{ record.price }}</div>
            <div v-if="record.originalPrice && record.originalPrice > record.price" class="original-price">
              ¥{{ record.originalPrice }}
            </div>
          </div>
        </template>

        <!-- 库存列 -->
        <template v-else-if="column.key === 'stock'">
          <a-tag :color="record.stock > 10 ? 'success' : record.stock > 0 ? 'warning' : 'error'">
            {{ record.stock }}
          </a-tag>
        </template>

        <!-- 销量列 -->
        <template v-else-if="column.key === 'sales'">
          {{ record.sales || 0 }}
        </template>

        <!-- 审核状态列 -->
        <template v-else-if="column.key === 'reviewStatus'">
          <a-tag :color="getReviewStatusColor(record.reviewStatus)">
            {{ getReviewStatusText(record.reviewStatus) }}
          </a-tag>
        </template>

        <!-- 商品状态列 -->
        <template v-else-if="column.key === 'status'">
          <a-switch
            :checked="record.status === 1"
            :loading="statusLoading[record.id]"
            :disabled="!canOperate(record) || record.reviewStatus !== 1"
            @change="(checked) => handleStatusChange(record, checked)"
          >
            <template #checkedChildren>上架</template>
            <template #unCheckedChildren>下架</template>
          </a-switch>
          <div v-if="record.reviewStatus !== 1" style="margin-top: 4px">
            <a-typography-text type="secondary" style="font-size: 12px">
              需审核通过
            </a-typography-text>
          </div>
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <a-space v-if="canOperate(record)">
            <a-button type="link" size="small" @click="handleEdit(record)">
              <edit-outlined />
              编辑
            </a-button>
            <a-button type="link" danger size="small" @click="handleDelete(record)">
              <delete-outlined />
              删除
            </a-button>
          </a-space>
          <a-typography-text v-else type="secondary" style="font-size: 12px">
            无权限
          </a-typography-text>
        </template>
      </template>
    </a-table>

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:open="deleteModalVisible"
      title="确认删除"
      @ok="confirmDelete"
      @cancel="cancelDelete"
    >
      <p>确定要删除商品 "{{ currentProduct?.productName }}" 吗？</p>
      <p style="color: #ff4d4f">此操作不可恢复！</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  listMyProductByPageUsingPost,
  deleteProductUsingPost,
  updateProductStatusUsingPost,
} from '@/api/productController'
import type { Product } from '@/types/models'

const router = useRouter()
const userStore = useUserStore()
const productList = ref<Product[]>([])
const loading = ref(false)
const statusLoading = reactive<Record<number, boolean>>({})
const deleteModalVisible = ref(false)
const currentProduct = ref<Product | null>(null)

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

const columns = [
  {
    title: '商品信息',
    key: 'product',
    width: 350,
  },
  {
    title: '价格',
    key: 'price',
    dataIndex: 'price',
    width: 120,
  },
  {
    title: '库存',
    key: 'stock',
    dataIndex: 'stock',
    width: 100,
  },
  {
    title: '销量',
    key: 'sales',
    dataIndex: 'sales',
    width: 100,
  },
  {
    title: '审核状态',
    key: 'reviewStatus',
    dataIndex: 'reviewStatus',
    width: 120,
  },
  {
    title: '商品状态',
    key: 'status',
    dataIndex: 'status',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
  },
]

onMounted(() => {
  fetchProductList()
})

const fetchProductList = async () => {
  loading.value = true
  try {
    const requestParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    }
    console.log('查询我的商品列表 请求参数:', JSON.stringify(requestParams))
    const res = await listMyProductByPageUsingPost(requestParams)

    console.log('后端返回数据:', JSON.stringify(res))
    if (res.code === 0 && res.data) {
      productList.value = res.data.records || []
      pagination.total = typeof res.data.total === 'string' ? parseInt(res.data.total) : (res.data.total || 0)
      console.log('获取到我的商品数量:', productList.value.length)
    } else {
      message.error(res.message || '获取商品列表失败')
    }
  } catch (error: any) {
    console.error('获取商品列表失败', error)
    message.error(error.message || '获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchProductList()
}

const canOperate = (product: Product) => {
  const currentUser = userStore.userInfo
  if (!currentUser) return false
  return currentUser.userRole === 'admin' || product.userId === currentUser.id
}

const getReviewStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'error'
    default:
      return 'default'
  }
}

const getReviewStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '待审核'
    case 1:
      return '已通过'
    case 2:
      return '已拒绝'
    default:
      return '未知'
  }
}

const handleStatusChange = async (record: Product, checked: boolean) => {
  if (record.reviewStatus !== 1) {
    message.warning('只有审核通过的商品才能上架')
    return
  }

  if (!canOperate(record)) {
    message.warning('您没有权限操作此商品')
    return
  }

  statusLoading[record.id] = true
  try {
    const res = await updateProductStatusUsingPost({
      id: record.id,
      status: checked ? 1 : 2,
    })

    if (res.code === 0) {
      message.success(checked ? '商品已上架' : '商品已下架')
      record.status = checked ? 1 : 2
    } else {
      message.error(res.message || '状态更新失败')
    }
  } catch (error: any) {
    console.error('更新商品状态失败 productId:', record.id, error)
    message.error(error.message || '状态更新失败')
  } finally {
    statusLoading[record.id] = false
  }
}

const handleEdit = (record: Product) => {
  router.push(`/seller/product/edit/${record.id}`)
}

const handleDelete = (record: Product) => {
  if (!canOperate(record)) {
    message.warning('您没有权限删除此商品')
    return
  }
  currentProduct.value = record
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  if (!currentProduct.value) return

  try {
    const res = await deleteProductUsingPost({ id: currentProduct.value.id })

    if (res.code === 0) {
      message.success('商品删除成功')
      deleteModalVisible.value = false
      currentProduct.value = null
      fetchProductList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    console.error('删除商品失败 productId:', currentProduct.value.id, error)
    message.error(error.message || '删除失败')
  }
}

const cancelDelete = () => {
  deleteModalVisible.value = false
  currentProduct.value = null
}
</script>

<style scoped lang="less">
.product-manage {
  padding: 24px;

  .page-header {
    margin-bottom: 16px;
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .product-image {
      flex-shrink: 0;
      border-radius: 4px;
      object-fit: cover;
    }

    .product-detail {
      flex: 1;
      min-width: 0;

      .product-name {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-desc {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .price-info {
    .current-price {
      font-weight: 600;
      font-size: 16px;
      color: #ff4d4f;
    }

    .original-price {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
      margin-top: 2px;
    }
  }
}
</style>
