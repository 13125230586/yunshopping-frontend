<template>
  <div class="user-manage">
    <a-card title="用户管理">
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="用户账号">
          <a-input
            v-model:value="searchForm.userAccount"
            placeholder="请输入用户账号"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input
            v-model:value="searchForm.userName"
            placeholder="请输入用户名"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input
            v-model:value="searchForm.phone"
            placeholder="请输入手机号"
            style="width: 200px"
            @pressEnter="handleSearch"
          />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-select
            v-model:value="searchForm.userRole"
            placeholder="请选择用户角色"
            style="width: 150px"
            allowClear
          >
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="seller">卖家</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :dataSource="users"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userAvatar'">
            <a-avatar v-if="record.userAvatar" :src="record.userAvatar" />
            <a-avatar v-else>{{ record.userName?.charAt(0) || 'U' }}</a-avatar>
          </template>
          <template v-else-if="column.key === 'userRole'">
            <a-tag v-if="record.userRole === 'admin'" color="red">管理员</a-tag>
            <a-tag v-else-if="record.userRole === 'seller'" color="blue">卖家</a-tag>
            <a-tag v-else color="green">普通用户</a-tag>
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ formatTime(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                v-if="record.userRole !== 'admin'"
                title="确定删除该用户吗?"
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
      v-model:open="editModalVisible"
      title="编辑用户"
      @ok="handleSubmit"
      @cancel="editModalVisible = false"
    >
      <a-form :model="editForm" :label-col="{ span: 5 }">
        <a-form-item label="用户名">
          <a-input v-model:value="editForm.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="用户角色">
          <a-select v-model:value="editForm.userRole" placeholder="请选择用户角色">
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="seller">卖家</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { listUserByPageUsingPost, deleteUserUsingPost, updateUserUsingPost } from '@/api/yonghujiekou'

const users = ref([])
const loading = ref(false)
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const searchForm = reactive({
  userAccount: '',
  userName: '',
  phone: '',
  userRole: undefined as string | undefined,
})

const columns = [
  { title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 80 },
  { title: '用户ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '用户名', dataIndex: 'userName', key: 'userName' },
  { title: '账号', dataIndex: 'userAccount', key: 'userAccount' },
  { title: '角色', dataIndex: 'userRole', key: 'userRole', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 160 },
]

const editModalVisible = ref(false)
const editForm = reactive({
  id: 0,
  userName: '',
  userRole: '',
})

onMounted(() => {
  fetchUserList()
})

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await listUserByPageUsingPost({
      current: pagination.value.current,
      pageSize: pagination.value.pageSize,
      userAccount: searchForm.userAccount || undefined,
      userName: searchForm.userName || undefined,
      phone: searchForm.phone || undefined,
      userRole: searchForm.userRole,
    })
    if (res.code === 0 && res.data) {
      users.value = res.data.records || []
      pagination.value.total = res.data.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败 userAccount:', searchForm.userAccount, 'userName:', searchForm.userName, 'phone:', searchForm.phone, 'userRole:', searchForm.userRole, error)
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchUserList()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchUserList()
}

const handleReset = () => {
  searchForm.userAccount = ''
  searchForm.userName = ''
  searchForm.phone = ''
  searchForm.userRole = undefined
  pagination.value.current = 1
  fetchUserList()
}

const handleEdit = (record: any) => {
  editForm.id = record.id
  editForm.userName = record.userName
  editForm.userRole = record.userRole
  editModalVisible.value = true
}

const handleSubmit = async () => {
  try {
    const res = await updateUserUsingPost({
      id: editForm.id,
      userName: editForm.userName,
      userRole: editForm.userRole,
    })
    if (res.code === 0) {
      message.success('更新成功')
      editModalVisible.value = false
      fetchUserList()
    } else {
      message.error(res.message || '更新失败')
    }
  } catch (error: any) {
    message.error(error.message || '更新失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    const res = await deleteUserUsingPost({ id })
    if (res.code === 0) {
      message.success('删除成功')
      fetchUserList()
    } else {
      message.error(res.message || '删除失败')
    }
  } catch (error: any) {
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
.user-manage {
  :deep(.ant-table-cell) {
    vertical-align: middle;
  }
}
</style>
