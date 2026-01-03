<template>
  <div class="category-manage">
    <a-card title="分类管理">
      <a-button type="primary" style="margin-bottom: 16px" @click="showAddModal(null)">
        添加一级分类
      </a-button>

      <a-table
        :dataSource="categories"
        :columns="columns"
        :loading="loading"
        rowKey="id"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'categoryIcon'">
            <img
              v-if="record.categoryIcon"
              :src="record.categoryIcon"
              alt="分类图标"
              style="width: 40px; height: 40px; object-fit: cover"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showAddModal(record)">添加子分类</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定删除该分类吗?"
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
      :title="isEdit ? '编辑分类' : '添加分类'"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form :model="formData" :label-col="{ span: 6 }">
        <a-form-item label="分类名称" required>
          <a-input v-model:value="formData.categoryName" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item label="分类图标URL">
          <a-input v-model:value="formData.categoryIcon" placeholder="请输入分类图标URL" />
          <div v-if="formData.categoryIcon" style="margin-top: 8px">
            <img
              :src="formData.categoryIcon"
              alt="预览"
              style="width: 60px; height: 60px; object-fit: cover"
            />
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
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  getCategoryTreeUsingGet,
  addCategoryUsingPost,
  updateCategoryUsingPost,
  deleteCategoryUsingPost,
} from '@/api/categoryController'

const categories = ref([])
const loading = ref(false)

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
  { title: '分类图标', dataIndex: 'categoryIcon', key: 'categoryIcon', width: 100 },
  { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
  { title: '操作', key: 'action', width: 280 },
]

const modalVisible = ref(false)
const isEdit = ref(false)
const formData = reactive({
  id: undefined,
  categoryName: '',
  categoryIcon: '',
  parentId: undefined,
  sortOrder: 0,
})

onMounted(() => {
  fetchCategoryTree()
})

const fetchCategoryTree = async () => {
  loading.value = true
  try {
    const res = await getCategoryTreeUsingGet()
    if (res.code === 0 && res.data) {
      categories.value = res.data || []
    }
  } catch (error) {
    console.error('获取分类列表失败', error)
  } finally {
    loading.value = false
  }
}

const showAddModal = (parent: any) => {
  isEdit.value = false
  resetForm()
  if (parent) {
    formData.parentId = parent.id
  }
  modalVisible.value = true
}

const handleEdit = (record: any) => {
  isEdit.value = true
  formData.id = record.id
  formData.categoryName = record.categoryName
  formData.categoryIcon = record.categoryIcon
  formData.parentId = record.parentId
  formData.sortOrder = record.sortOrder || 0
  modalVisible.value = true
}

const handleSubmit = async () => {
  if (!formData.categoryName) {
    message.error('请输入分类名称')
    return
  }

  try {
    if (isEdit.value) {
      const res = await updateCategoryUsingPost({
        id: formData.id,
        categoryName: formData.categoryName,
        categoryIcon: formData.categoryIcon,
        parentId: formData.parentId,
        sortOrder: formData.sortOrder,
      })
      if (res.code === 0) {
        message.success('修改成功')
      } else {
        message.error(res.message || '修改失败')
        return
      }
    } else {
      const res = await addCategoryUsingPost({
        categoryName: formData.categoryName,
        categoryIcon: formData.categoryIcon,
        parentId: formData.parentId,
        sortOrder: formData.sortOrder,
      })
      if (res.code === 0) {
        message.success('添加成功')
      } else {
        message.error(res.message || '添加失败')
        return
      }
    }
    modalVisible.value = false
    fetchCategoryTree()
  } catch (error: any) {
    message.error(error.message || (isEdit.value ? '修改失败' : '添加失败'))
  }
}

const handleCancel = () => {
  modalVisible.value = false
  resetForm()
}

const handleDelete = async (id: number) => {
  try {
    const res = await deleteCategoryUsingPost({ id })
    if (res.code === 0) {
      message.success('删除成功')
      fetchCategoryTree()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

const resetForm = () => {
  formData.id = undefined
  formData.categoryName = ''
  formData.categoryIcon = ''
  formData.parentId = undefined
  formData.sortOrder = 0
}
</script>

<style scoped lang="less">
.category-manage {
  :deep(.ant-table-cell) {
    vertical-align: middle;
  }
}
</style>
