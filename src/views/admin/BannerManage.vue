<template>
  <div class="banner-manage">
    <a-card title="轮播图管理">
      <a-button type="primary" style="margin-bottom: 16px" @click="showAddModal">
        添加轮播图
      </a-button>

      <a-table
        :columns="columns"
        :data-source="bannerList"
        :loading="loading"
        row-key="id"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'imageUrl'">
            <img :src="record.imageUrl" alt="轮播图" style="width: 120px; height: 40px; object-fit: cover" />
          </template>
          <template v-else-if="column.key === 'linkType'">
            <a-tag v-if="record.linkType === 'category'" color="blue">分类</a-tag>
            <a-tag v-else-if="record.linkType === 'product'" color="green">商品</a-tag>
            <a-tag v-else-if="record.linkType === 'shop'" color="orange">店铺</a-tag>
            <a-tag v-else color="purple">外链</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 1"
              checked-children="启用"
              un-checked-children="禁用"
              @change="(checked) => handleStatusChange(record, checked)"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定删除该轮播图吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑轮播图' : '添加轮播图'"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
      width="600px"
    >
      <a-form :model="formData" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入轮播图标题" />
        </a-form-item>
        <a-form-item label="图片地址" required>
          <a-input v-model:value="formData.imageUrl" placeholder="请输入图片URL" />
          <div v-if="formData.imageUrl" style="margin-top: 8px">
            <img
              :src="formData.imageUrl"
              alt="预览"
              style="max-width: 100%; max-height: 200px; border: 1px solid #d9d9d9; border-radius: 4px"
            />
          </div>
        </a-form-item>
        <a-form-item label="链接类型" required>
          <a-select v-model:value="formData.linkType" placeholder="请选择链接类型">
            <a-select-option value="category">分类</a-select-option>
            <a-select-option value="product">商品</a-select-option>
            <a-select-option value="shop">店铺</a-select-option>
            <a-select-option value="url">外链</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="链接值" required>
          <a-input
            v-model:value="formData.linkValue"
            :placeholder="getLinkValuePlaceholder()"
          />
          <div style="margin-top: 4px; font-size: 12px; color: #999">
            {{ getLinkValueTip() }}
          </div>
        </a-form-item>
        <a-form-item label="排序" required>
          <a-input-number
            v-model:value="formData.sortOrder"
            :min="0"
            placeholder="数字越小越靠前"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="状态" required>
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  listBannerByPageUsingPost,
  addBannerUsingPost,
  updateBannerUsingPost,
  deleteBannerUsingPost,
  updateBannerStatusUsingPost,
} from '@/api/lunbotuguanlijiekou'
import type { Banner } from '@/types/models'

const loading = ref(false)
const bannerList = ref<Banner[]>([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '图片', dataIndex: 'imageUrl', key: 'imageUrl', width: 150 },
  { title: '链接类型', dataIndex: 'linkType', key: 'linkType', width: 100 },
  { title: '链接值', dataIndex: 'linkValue', key: 'linkValue' },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '操作', key: 'action', width: 160 },
]

const modalVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formData = reactive<Partial<Banner>>({
  title: '',
  imageUrl: '',
  linkType: 'category',
  linkValue: '',
  sortOrder: 0,
  status: 1,
})

onMounted(async () => {
  await fetchBannerList()
})

const fetchBannerList = async () => {
  loading.value = true
  try {
    const res = await listBannerByPageUsingPost({
      current: current.value,
      pageSize: pageSize.value,
    })
    if (res.code === 0 && res.data) {
      bannerList.value = (res.data.records || []) as Banner[]
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取轮播图列表失败', error)
    message.error('获取轮播图列表失败')
  } finally {
    loading.value = false
  }
}

const showAddModal = () => {
  isEdit.value = false
  resetForm()
  modalVisible.value = true
}

const handleEdit = (record: Banner) => {
  isEdit.value = true
  Object.assign(formData, record)
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!formData.title || !formData.imageUrl || !formData.linkType || !formData.linkValue) {
    message.error('请填写完整信息')
    return
  }

  submitLoading.value = true
  try {
    if (isEdit.value) {
      const res = await updateBannerUsingPost({
        id: formData.id!,
        title: formData.title,
        imageUrl: formData.imageUrl,
        linkType: formData.linkType as any,
        linkValue: formData.linkValue,
        sortOrder: formData.sortOrder || 0,
        status: formData.status || 1,
      })
      if (res.code === 0) {
        message.success('修改成功')
      } else {
        message.error(res.message || '修改失败')
        return
      }
    } else {
      const res = await addBannerUsingPost({
        title: formData.title,
        imageUrl: formData.imageUrl,
        linkType: formData.linkType as any,
        linkValue: formData.linkValue,
        sortOrder: formData.sortOrder || 0,
        status: formData.status || 1,
      })
      if (res.code === 0) {
        message.success('添加成功')
      } else {
        message.error(res.message || '添加失败')
        return
      }
    }
    modalVisible.value = false
    await fetchBannerList()
  } catch (error: any) {
    message.error(error.message || (isEdit.value ? '修改失败' : '添加失败'))
  } finally {
    submitLoading.value = false
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

const handleStatusChange = async (record: Banner, checked: boolean) => {
  try {
    const res = await updateBannerStatusUsingPost({
      id: record.id!,
      status: checked ? 1 : 0,
    })
    if (res.code === 0) {
      record.status = checked ? 1 : 0
      message.success('状态修改成功')
    } else {
      message.error(res.message || '状态修改失败')
    }
  } catch (error: any) {
    message.error(error.message || '状态修改失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    const res = await deleteBannerUsingPost({ id })
    if (res.code === 0) {
      message.success('删除成功')
      await fetchBannerList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.title = ''
  formData.imageUrl = ''
  formData.linkType = 'category'
  formData.linkValue = ''
  formData.sortOrder = 0
  formData.status = 1
}

const getLinkValuePlaceholder = () => {
  switch (formData.linkType) {
    case 'category':
      return '请输入分类ID'
    case 'product':
      return '请输入商品ID'
    case 'shop':
      return '请输入店铺ID'
    case 'url':
      return '请输入完整URL地址'
    default:
      return '请输入链接值'
  }
}

const getLinkValueTip = () => {
  switch (formData.linkType) {
    case 'category':
      return '点击轮播图将跳转到该分类的商品列表页'
    case 'product':
      return '点击轮播图将跳转到该商品详情页'
    case 'shop':
      return '点击轮播图将跳转到该店铺页面'
    case 'url':
      return '点击轮播图将在新窗口打开该链接'
    default:
      return ''
  }
}
</script>

<style scoped lang="less">
.banner-manage {
  :deep(.ant-table-cell) {
    vertical-align: middle;
  }
}
</style>