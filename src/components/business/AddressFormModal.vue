<template>
  <a-modal
    :open="visible"
    :title="isEdit ? '编辑地址' : '添加地址'"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :confirmLoading="loading"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item
        label="收货人"
        name="receiverName"
        :rules="[{ required: true, message: '请输入收货人姓名' }]"
      >
        <a-input v-model:value="formData.receiverName" placeholder="请输入收货人姓名" />
      </a-form-item>

      <a-form-item
        label="联系电话"
        name="receiverPhone"
        :rules="[
          { required: true, message: '请输入联系电话' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
        ]"
      >
        <a-input v-model:value="formData.receiverPhone" placeholder="请输入11位手机号" />
      </a-form-item>

      <a-form-item
        label="所在地区"
        :rules="[{ required: true, message: '请选择所在地区', validator: validateRegion }]"
      >
        <a-cascader
          v-model:value="regionValue"
          :options="regionOptions"
          placeholder="请选择省/市/区"
          @change="handleRegionChange"
        />
      </a-form-item>

      <a-form-item
        label="详细地址"
        name="detailAddress"
        :rules="[
          { required: true, message: '请输入详细地址' },
          { min: 5, message: '详细地址至少5个字符' },
        ]"
      >
        <a-textarea
          v-model:value="formData.detailAddress"
          placeholder="请输入街道、楼栋号、单元室等详细地址"
          :rows="3"
        />
      </a-form-item>

      <a-form-item label="邮政编码" name="postalCode">
        <a-input
          v-model:value="formData.postalCode"
          placeholder="请输入邮政编码(可选)"
          :maxlength="6"
        />
      </a-form-item>

      <a-form-item label="设为默认" name="isDefault">
        <a-switch
          v-model:checked="isDefaultChecked"
          checked-children="是"
          un-checked-children="否"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useAddressStore } from '@/stores/address'
import type { Address } from '@/types/models'

const props = defineProps<{
  visible: boolean
  address?: Address | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const addressStore = useAddressStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const isEdit = computed(() => !!props.address?.id)

const formData = reactive({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  postalCode: '',
  isDefault: 0,
})

const regionValue = ref<string[]>([])
const isDefaultChecked = computed({
  get: () => formData.isDefault === 1,
  set: (value) => {
    formData.isDefault = value ? 1 : 0
  },
})

const regionOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '丰台区', label: '丰台区' },
          { value: '石景山区', label: '石景山区' },
        ],
      },
    ],
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' },
          { value: '普陀区', label: '普陀区' },
          { value: '虹口区', label: '虹口区' },
          { value: '杨浦区', label: '杨浦区' },
        ],
      },
    ],
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '天河区', label: '天河区' },
          { value: '越秀区', label: '越秀区' },
          { value: '海珠区', label: '海珠区' },
          { value: '荔湾区', label: '荔湾区' },
          { value: '白云区', label: '白云区' },
        ],
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '南山区', label: '南山区' },
          { value: '宝安区', label: '宝安区' },
          { value: '龙岗区', label: '龙岗区' },
        ],
      },
    ],
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '上城区', label: '上城区' },
          { value: '下城区', label: '下城区' },
          { value: '江干区', label: '江干区' },
          { value: '拱墅区', label: '拱墅区' },
        ],
      },
    ],
  },
]

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      if (props.address) {
        Object.assign(formData, {
          receiverName: props.address.receiverName || '',
          receiverPhone: props.address.receiverPhone || '',
          province: props.address.province || '',
          city: props.address.city || '',
          district: props.address.district || '',
          detailAddress: props.address.detailAddress || '',
          postalCode: props.address.postalCode || '',
          isDefault: props.address.isDefault || 0,
        })
        regionValue.value = [
          props.address.province || '',
          props.address.city || '',
          props.address.district || '',
        ]
      } else {
        resetForm()
      }
    }
  }
)

const validateRegion = () => {
  if (!regionValue.value || regionValue.value.length !== 3) {
    return Promise.reject('请选择所在地区')
  }
  return Promise.resolve()
}

const handleRegionChange = (value: string[]) => {
  if (value && value.length === 3) {
    formData.province = value[0]
    formData.city = value[1]
    formData.district = value[2]
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch (error) {
    console.log('表单验证失败', error)
    return
  }

  loading.value = true
  try {
    if (isEdit.value && props.address?.id) {
      await addressStore.updateAddress({
        id: props.address.id,
        ...formData,
      })
      message.success('地址更新成功')
    } else {
      await addressStore.addAddress(formData)
      message.success('地址添加成功')
    }
    emit('success')
    handleCancel()
  } catch (error: any) {
    console.error('地址保存失败', error)
    message.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  setTimeout(() => {
    resetForm()
  }, 300)
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    postalCode: '',
    isDefault: 0,
  })
  regionValue.value = []
}
</script>

<style scoped lang="less">
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>