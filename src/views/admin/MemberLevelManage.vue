<template>
  <div class="member-level-manage">
    <a-card title="会员等级配置">
      <template #extra>
        <a-button type="primary" @click="handleAdd">
          <plus-outlined />
          新增等级
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="memberStore.allLevels"
        :loading="memberStore.loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'icon'">
            <img
              v-if="record.icon"
              :src="record.icon"
              alt="等级图标"
              style="width: 40px; height: 40px; object-fit: contain"
            />
            <crown-outlined v-else style="font-size: 24px; color: #ffd700" />
          </template>
          <template v-if="column.key === 'discountRate'">
            <a-tag color="red">{{ (record.discountRate * 10).toFixed(1) }}折</a-tag>
          </template>
          <template v-if="column.key === 'levelCode'">
            <a-tag>{{ record.levelCode }}</a-tag>
          </template>
          <template v-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除该等级吗"
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

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑会员等级' : '新增会员等级'"
      :confirm-loading="submitLoading"
      width="600px"
      @ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item
          label="等级名称"
          name="levelName"
          :rules="[{ required: true, message: '请输入等级名称' }]"
        >
          <a-input v-model:value="formData.levelName" placeholder="例如普通会员银卡会员" />
        </a-form-item>

        <a-form-item
          label="等级代码"
          name="levelCode"
          :rules="[{ required: true, message: '请输入等级代码' }]"
        >
          <a-input v-model:value="formData.levelCode" placeholder="例如NORMAL SILVER" />
        </a-form-item>

        <a-form-item
          label="折扣率"
          name="discountRate"
          :rules="[{ required: true, message: '请输入折扣率' }]"
        >
          <a-input-number
            v-model:value="formData.discountRate"
            :min="0"
            :max="1"
            :step="0.01"
            :precision="2"
            placeholder="0.95表示95折"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 4px">
            当前折扣 {{ formData.discountRate ? (formData.discountRate * 10).toFixed(1) : '-' }}折
          </div>
        </a-form-item>

        <a-form-item
          label="所需成长值"
          name="requiredGrowth"
          :rules="[{ required: true, message: '请输入所需成长值' }]"
        >
          <a-input-number
            v-model:value="formData.requiredGrowth"
            :min="0"
            placeholder="升级所需成长值"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="欢迎优惠券" name="welcomeCouponId">
          <a-select
            v-model:value="formData.welcomeCouponId"
            placeholder="开通时赠送的优惠券"
            allow-clear
            style="width: 100%"
            :loading="allCoupons.length === 0"
          >
            <a-select-option :value="undefined">不赠送</a-select-option>
            <a-select-option
              v-for="coupon in allCoupons"
              :key="coupon.id"
              :value="coupon.id"
            >
              {{ coupon.couponName }} - {{ getCouponDesc(coupon) }}
            </a-select-option>
          </a-select>
          <div style="color: #999; font-size: 12px; margin-top: 4px">
            选择开通此会员等级时自动发放的优惠券
          </div>
        </a-form-item>

        <a-form-item label="生日优惠券" name="birthdayCouponId">
          <a-select
            v-model:value="formData.birthdayCouponId"
            placeholder="生日月赠送的优惠券"
            allow-clear
            style="width: 100%"
            :loading="allCoupons.length === 0"
          >
            <a-select-option :value="undefined">不赠送</a-select-option>
            <a-select-option
              v-for="coupon in allCoupons"
              :key="coupon.id"
              :value="coupon.id"
            >
              {{ coupon.couponName }} - {{ getCouponDesc(coupon) }}
            </a-select-option>
          </a-select>
          <div style="color: #999; font-size: 12px; margin-top: 4px">
            选择在生日月自动发放的优惠券（需定时任务支持）
          </div>
        </a-form-item>

        <a-form-item label="等级图标URL" name="icon">
          <a-input v-model:value="formData.icon" placeholder="图标URL地址" />
        </a-form-item>

        <a-form-item
          label="排序序号"
          name="sortOrder"
          :rules="[{ required: true, message: '请输入排序序号' }]"
        >
          <a-input-number
            v-model:value="formData.sortOrder"
            :min="0"
            placeholder="数字越小越靠前"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="等级描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            :rows="3"
            placeholder="等级权益描述"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, CrownOutlined } from '@ant-design/icons-vue'
import { useMemberStore } from '@/stores/member'
import { listAllCouponsUsingGet } from '@/api/youhuiquanguanlijiekou'
import { formatDate } from '@/utils'
import type { FormInstance } from 'ant-design-vue'

const memberStore = useMemberStore()
const modalVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const allCoupons = ref<API.CouponVO[]>([])

const columns = [
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    width: 80,
  },
  {
    title: '等级名称',
    dataIndex: 'levelName',
    key: 'levelName',
  },
  {
    title: '等级代码',
    dataIndex: 'levelCode',
    key: 'levelCode',
  },
  {
    title: '折扣率',
    dataIndex: 'discountRate',
    key: 'discountRate',
  },
  {
    title: '所需成长值',
    dataIndex: 'requiredGrowth',
    key: 'requiredGrowth',
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 80,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
]

const formData = reactive<API.MemberLevelAddRequest>({
  levelName: '',
  levelCode: '',
  discountRate: 1,
  requiredGrowth: 0,
  welcomeCouponId: undefined,
  birthdayCouponId: undefined,
  icon: '',
  sortOrder: 0,
  description: '',
})

function handleAdd() {
  isEdit.value = false
  resetForm()
  modalVisible.value = true
}

function handleEdit(record: API.MemberLevelVO) {
  isEdit.value = true
  Object.assign(formData, {
    id: record.id,
    levelName: record.levelName,
    levelCode: record.levelCode,
    discountRate: record.discountRate,
    requiredGrowth: record.requiredGrowth,
    welcomeCouponId: record.welcomeCouponId,
    birthdayCouponId: record.birthdayCouponId,
    icon: record.icon,
    sortOrder: record.sortOrder,
    description: record.description,
  })
  modalVisible.value = true
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    const res = isEdit.value
      ? await memberStore.updateLevel(formData as API.MemberLevelUpdateRequest)
      : await memberStore.addLevel(formData)

    if (res.code === 0) {
      message.success(isEdit.value ? '修改成功' : '添加成功')
      modalVisible.value = false
      resetForm()
    } else {
      message.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('表单验证失败', error)
  } finally {
    submitLoading.value = false
  }
}

async function handleDelete(id?: number) {
  if (!id) return

  const res = await memberStore.deleteLevel(id)
  if (res.code === 0) {
    message.success('删除成功')
  } else {
    message.error(res.message || '删除失败')
  }
}

function resetForm() {
  formRef.value?.resetFields()
  Object.assign(formData, {
    levelName: '',
    levelCode: '',
    discountRate: 1,
    requiredGrowth: 0,
    welcomeCouponId: undefined,
    birthdayCouponId: undefined,
    icon: '',
    sortOrder: 0,
    description: '',
  })
}

// 获取所有优惠券列表
async function fetchAllCoupons() {
  try {
    const res = await listAllCouponsUsingGet()

    // 后端直接返回数组，不是标准的 BaseResponse 格式
    if (Array.isArray(res.data)) {
      allCoupons.value = res.data
      console.log('优惠券列表加载成功 数量:', allCoupons.value.length)
    } else if (res.data?.code === 0 && res.data.data) {
      // 兼容标准格式
      allCoupons.value = res.data.data
      console.log('优惠券列表加载成功 数量:', allCoupons.value.length)
    } else {
      console.warn('优惠券接口返回异常')
      message.warning('未获取到优惠券数据')
    }
  } catch (error) {
    console.error('获取优惠券列表失败', error)
    message.error('获取优惠券列表失败')
  }
}

// 生成优惠券描述
function getCouponDesc(coupon: API.CouponVO) {
  if (coupon.couponType === 1 && coupon.discountAmount && coupon.minAmount) {
    return `满${coupon.minAmount}减${coupon.discountAmount}`
  }
  if (coupon.couponType === 2 && coupon.discountRate) {
    return `${(coupon.discountRate * 10).toFixed(1)}折`
  }
  return coupon.couponTypeText || ''
}

onMounted(async () => {
  await memberStore.fetchAdminLevels()
  await fetchAllCoupons()
})
</script>

<style scoped lang="scss">
.member-level-manage {
  padding: 20px;
}
</style>
