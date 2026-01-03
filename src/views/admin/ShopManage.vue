<template>
  <div class="shop-manage">
    <a-card title="店铺管理">
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="店铺名称">
          <a-input
            v-model:value="searchForm.shopName"
            placeholder="请输入店铺名称"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="店铺状态">
          <a-select
            v-model:value="searchForm.shopStatus"
            placeholder="请选择店铺状态"
            style="width: 150px"
            allowClear
          >
            <a-select-option :value="0">待审核</a-select-option>
            <a-select-option :value="1">营业中</a-select-option>
            <a-select-option :value="2">已关闭</a-select-option>
            <a-select-option :value="3">审核拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="店铺等级">
          <a-select
            v-model:value="searchForm.shopLevel"
            placeholder="请选择店铺等级"
            style="width: 150px"
            allowClear
          >
            <a-select-option :value="0">普通店铺</a-select-option>
            <a-select-option :value="1">品牌店铺</a-select-option>
            <a-select-option :value="2">旗舰店铺</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :dataSource="shops"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'shopLogo'">
            <img :src="record.shopLogo" alt="店铺Logo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px" />
          </template>
          <template v-else-if="column.key === 'shopLevel'">
            <a-tag v-if="record.shopLevel === 0" color="default">普通店铺</a-tag>
            <a-tag v-else-if="record.shopLevel === 1" color="blue">品牌店铺</a-tag>
            <a-tag v-else-if="record.shopLevel === 2" color="gold">旗舰店铺</a-tag>
          </template>
          <template v-else-if="column.key === 'shopStatus'">
            <a-tag v-if="record.shopStatus === 0" color="orange">待审核</a-tag>
            <a-tag v-else-if="record.shopStatus === 1" color="green">营业中</a-tag>
            <a-tag v-else-if="record.shopStatus === 2" color="red">已关闭</a-tag>
            <a-tag v-else color="gray">审核拒绝</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-button
                type="link"
                size="small"
                :style="{ color: record.shopStatus === 1 ? '#ff4d4f' : '#52c41a' }"
                @click="handleStatusChange(record)"
              >
                {{ record.shopStatus === 1 ? '关闭' : '开启' }}
              </a-button>
              <a-popconfirm
                title="确定要删除该店铺吗？"
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
      title="编辑店铺"
      width="800px"
      @ok="handleUpdate"
      @cancel="editModalVisible = false"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="店铺名称" required>
              <a-input v-model:value="editForm.shopName" placeholder="请输入店铺名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="店铺等级">
              <a-select v-model:value="editForm.shopLevel" placeholder="请选择店铺等级">
                <a-select-option :value="0">普通店铺</a-select-option>
                <a-select-option :value="1">品牌店铺</a-select-option>
                <a-select-option :value="2">旗舰店铺</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="店铺Logo URL" required>
          <a-input v-model:value="editForm.shopLogo" placeholder="请输入店铺Logo URL" />
          <div v-if="editForm.shopLogo" style="margin-top: 8px">
            <img :src="editForm.shopLogo" alt="Logo预览" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px" />
          </div>
        </a-form-item>

        <a-form-item label="店铺横幅 URL">
          <a-input v-model:value="editForm.shopBanner" placeholder="请输入店铺横幅URL" />
          <div v-if="editForm.shopBanner" style="margin-top: 8px">
            <img :src="editForm.shopBanner" alt="横幅预览" style="width: 200px; height: 60px; object-fit: cover; border-radius: 4px" />
          </div>
        </a-form-item>

        <a-form-item label="店铺描述">
          <a-textarea v-model:value="editForm.shopDescription" :rows="4" placeholder="请输入店铺描述" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="省份">
              <a-input v-model:value="editForm.province" placeholder="请输入省份" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="城市">
              <a-input v-model:value="editForm.city" placeholder="请输入城市" />
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
  listShopByPageUsingPost,
  updateShopUsingPost,
  updateShopStatusUsingPost,
  deleteShopUsingPost,
} from '@/api/shopController'

const shops = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const searchForm = reactive({
  shopName: '',
  shopStatus: undefined as number | undefined,
  shopLevel: undefined as number | undefined,
})

const columns = [
  { title: '店铺Logo', dataIndex: 'shopLogo', key: 'shopLogo', width: 100 },
  { title: '店铺名称', dataIndex: 'shopName', key: 'shopName', width: 200 },
  { title: '店铺描述', dataIndex: 'shopDescription', key: 'shopDescription', ellipsis: true },
  { title: '店铺等级', dataIndex: 'shopLevel', key: 'shopLevel', width: 120 },
  { title: '店铺状态', dataIndex: 'shopStatus', key: 'shopStatus', width: 100 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' },
]

const editModalVisible = ref(false)
const editForm = reactive({
  id: 0,
  shopName: '',
  shopLogo: '',
  shopBanner: '',
  shopDescription: '',
  shopLevel: 0,
  province: '',
  city: '',
})

onMounted(() => {
  fetchShopList()
})

const fetchShopList = async () => {
  loading.value = true
  try {
    const params: any = {
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
    }
    if (searchForm.shopName) params.shopName = searchForm.shopName
    if (searchForm.shopStatus !== undefined) params.shopStatus = searchForm.shopStatus
    if (searchForm.shopLevel !== undefined) params.shopLevel = searchForm.shopLevel

    const res = await listShopByPageUsingPost(params)
    if (res.code === 0 && res.data) {
      shops.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取店铺列表失败 shopName:', searchForm.shopName, 'shopStatus:', searchForm.shopStatus, 'shopLevel:', searchForm.shopLevel, error)
    message.error('获取店铺列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchShopList()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchShopList()
}

const handleReset = () => {
  searchForm.shopName = ''
  searchForm.shopStatus = undefined
  searchForm.shopLevel = undefined
  pagination.value.current = 1
  fetchShopList()
}

const showEditModal = (record: any) => {
  editForm.id = record.id
  editForm.shopName = record.shopName
  editForm.shopLogo = record.shopLogo
  editForm.shopBanner = record.shopBanner || ''
  editForm.shopDescription = record.shopDescription || ''
  editForm.shopLevel = record.shopLevel || 0
  editForm.province = record.province || ''
  editForm.city = record.city || ''
  editModalVisible.value = true
}

const handleUpdate = async () => {
  if (!editForm.shopName) {
    message.error('请输入店铺名称')
    return
  }
  if (!editForm.shopLogo) {
    message.error('请输入店铺Logo')
    return
  }

  try {
    const res = await updateShopUsingPost({
      id: editForm.id,
      shopName: editForm.shopName,
      shopLogo: editForm.shopLogo,
      shopBanner: editForm.shopBanner,
      shopDescription: editForm.shopDescription,
      shopLevel: editForm.shopLevel,
      province: editForm.province,
      city: editForm.city,
    })
    if (res.code === 0) {
      message.success('更新成功')
      editModalVisible.value = false
      fetchShopList()
    } else {
      message.error(res.message || '更新失败')
    }
  } catch (error: any) {
    console.error('店铺更新失败 shopId:', editForm.id, error)
    message.error(error.message || '更新失败')
  }
}

const handleStatusChange = async (record: any) => {
  const newStatus = record.shopStatus === 1 ? 2 : 1
  const statusText = newStatus === 1 ? '开启' : '关闭'

  try {
    const res = await updateShopStatusUsingPost({
      id: record.id,
      shopStatus: newStatus,
    })
    if (res.code === 0) {
      message.success(`${statusText}成功`)
      fetchShopList()
    } else {
      message.error(res.message || `${statusText}失败`)
    }
  } catch (error: any) {
    console.error(`店铺${statusText}失败 shopId:`, record.id, `shopStatus:`, newStatus, error)
    message.error(error.message || `${statusText}失败`)
  }
}

const handleDelete = async (record: any) => {
  try {
    const res = await deleteShopUsingPost({
      id: record.id,
    })
    if (res.code === 0) {
      message.success('删除成功')
      fetchShopList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    console.error('店铺删除失败 shopId:', record.id, error)
    message.error(error.message || '删除失败')
  }
}
</script>

<style scoped lang="less">
.shop-manage {
  :deep(.ant-table) {
    .ant-table-cell {
      vertical-align: middle;
    }
  }
}
</style>