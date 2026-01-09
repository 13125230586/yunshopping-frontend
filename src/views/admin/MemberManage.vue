<template>
  <div class="member-manage">
    <a-card title="会员列表">
      <template #extra>
        <a-button type="primary" @click="handleGrantMember">
          <gift-outlined />
          赠送会员
        </a-button>
      </template>

      <!-- 搜索表单 -->
      <a-form layout="inline" :model="searchForm" class="search-form">
        <a-form-item label="用户ID">
          <a-input-number
            v-model:value="searchForm.userId"
            placeholder="请输入用户ID"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="会员等级">
          <a-select
            v-model:value="searchForm.levelId"
            placeholder="请选择等级"
            allow-clear
            style="width: 200px"
          >
            <a-select-option v-for="level in memberStore.allLevels" :key="level.id" :value="level.id">
              {{ level.levelName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option :value="0">正常</a-select-option>
            <a-select-option :value="1">已过期</a-select-option>
            <a-select-option :value="2">已冻结</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>

      <!-- 会员列表表格 -->
      <a-table
        :columns="columns"
        :data-source="memberStore.memberList"
        :loading="memberStore.loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userName'">
            <div class="user-info-cell">
              <a-avatar :src="record.userAvatar" :size="32">
                {{ record.userName?.charAt(0) || 'U' }}
              </a-avatar>
              <span class="user-name">{{ record.userName || '-' }}</span>
            </div>
          </template>
          <template v-if="column.key === 'levelInfo'">
            <a-tag color="blue">{{ record.levelInfo?.levelName }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.statusText }}
            </a-tag>
          </template>
          <template v-if="column.key === 'expireTime'">
            {{ record.expireTime || '永久有效' }}
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 赠送会员弹窗 -->
    <a-modal
      v-model:open="grantModalVisible"
      title="赠送会员"
      :confirm-loading="grantLoading"
      @ok="handleGrantSubmit"
    >
      <a-form
        ref="grantFormRef"
        :model="grantForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="用户ID"
          name="userId"
          :rules="[{ required: true, message: '请输入用户ID' }]"
        >
          <a-input-number
            v-model:value="grantForm.userId"
            :min="1"
            placeholder="请输入用户ID"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          label="会员等级"
          name="levelId"
          :rules="[{ required: true, message: '请选择会员等级' }]"
        >
          <a-select v-model:value="grantForm.levelId" placeholder="请选择等级">
            <a-select-option v-for="level in memberStore.allLevels" :key="level.id" :value="level.id">
              {{ level.levelName }} ({{ (level.discountRate! * 10).toFixed(1) }}折)
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="有效天数" name="validDays">
          <a-input-number
            v-model:value="grantForm.validDays"
            :min="1"
            placeholder="不填则永久有效"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 4px">留空表示永久有效</div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { GiftOutlined } from '@ant-design/icons-vue'
import { useMemberStore } from '@/stores/member'
import type { FormInstance, TableProps } from 'ant-design-vue'

const memberStore = useMemberStore()
const grantModalVisible = ref(false)
const grantLoading = ref(false)
const grantFormRef = ref<FormInstance>()

const searchForm = reactive({
  userId: undefined,
  levelId: undefined,
  status: undefined,
  current: 1,
  pageSize: 10,
})

const grantForm = reactive<API.MemberGrantRequest>({
  userId: undefined,
  levelId: undefined,
  validDays: undefined,
})

const columns = [
  {
    title: '会员ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    width: 100,
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
    width: 150,
  },
  {
    title: '会员等级',
    dataIndex: 'levelInfo',
    key: 'levelInfo',
  },
  {
    title: '成长值',
    dataIndex: 'growthValue',
    key: 'growthValue',
    width: 100,
  },
  {
    title: '累计消费',
    dataIndex: 'totalConsumeAmount',
    key: 'totalConsumeAmount',
    width: 120,
    customRender: ({ text }: { text: number }) => `¥${text || 0}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '开通时间',
    dataIndex: 'activateTime',
    key: 'activateTime',
    width: 180,
  },
  {
    title: '到期时间',
    dataIndex: 'expireTime',
    key: 'expireTime',
    width: 180,
  },
]

const pagination = computed(() => ({
  current: searchForm.current,
  pageSize: searchForm.pageSize,
  total: memberStore.memberTotal,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}))

function getStatusColor(status?: number) {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'error'
    default:
      return 'default'
  }
}

function handleSearch() {
  searchForm.current = 1
  fetchData()
}

function handleReset() {
  searchForm.userId = undefined
  searchForm.levelId = undefined
  searchForm.status = undefined
  searchForm.current = 1
  fetchData()
}

function handleTableChange(pag: TableProps['pagination']) {
  searchForm.current = pag?.current || 1
  searchForm.pageSize = pag?.pageSize || 10
  fetchData()
}

function handleGrantMember() {
  grantFormRef.value?.resetFields()
  Object.assign(grantForm, {
    userId: undefined,
    levelId: undefined,
    validDays: undefined,
  })
  grantModalVisible.value = true
}

async function handleGrantSubmit() {
  try {
    await grantFormRef.value?.validate()
    grantLoading.value = true

    const res = await memberStore.grantMember(grantForm)
    if (res.code === 0) {
      message.success('赠送成功')
      grantModalVisible.value = false
      fetchData()
    } else {
      message.error(res.message || '赠送失败')
    }
  } catch (error) {
    console.error('表单验证失败', error)
  } finally {
    grantLoading.value = false
  }
}

async function fetchData() {
  await memberStore.fetchMemberList(searchForm)
}

onMounted(async () => {
  await memberStore.fetchAdminLevels()
  await fetchData()
})
</script>

<style scoped lang="scss">
.member-manage {
  padding: 20px;

  .search-form {
    margin-bottom: 16px;
    padding: 16px;
    background: #fafafa;
    border-radius: 4px;
  }

  .user-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-name {
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
