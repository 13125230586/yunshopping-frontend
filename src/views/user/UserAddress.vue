<template>
  <div class="user-address">
    <a-card title="收货地址">
      <a-button type="primary" @click="handleAdd" style="margin-bottom: 16px">
        添加地址
      </a-button>
      <a-list :dataSource="addressStore.addressList" :loading="addressStore.loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                {{ item.receiverName }} {{ item.receiverPhone }}
                <a-tag v-if="item.isDefault === 1" color="red">默认</a-tag>
              </template>
              <template #description>
                {{ formatAddress(item.province, item.city, item.district, item.detailAddress) }}
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button
                type="link"
                size="small"
                @click="handleSetDefault(item.id)"
                v-if="item.isDefault === 0"
              >
                设为默认
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(item)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除该地址吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(item.id)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <address-form-modal
      v-model:visible="showModal"
      :address="currentAddress"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useAddressStore } from '@/stores/address'
import { formatAddress } from '@/utils'
import type { Address } from '@/types/models'
import AddressFormModal from '@/components/business/AddressFormModal.vue'

const addressStore = useAddressStore()
const showModal = ref(false)
const currentAddress = ref<Address | null>(null)

onMounted(() => {
  addressStore.fetchAddressList()
})

const handleAdd = () => {
  currentAddress.value = null
  showModal.value = true
}

const handleEdit = (address: Address) => {
  currentAddress.value = address
  showModal.value = true
}

const handleSuccess = () => {
  addressStore.fetchAddressList()
}

const handleSetDefault = async (id: number) => {
  try {
    await addressStore.setDefaultAddress(id)
    message.success('设置成功')
  } catch (error: any) {
    message.error(error.message || '操作失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await addressStore.deleteAddress(id)
    message.success('删除成功')
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}
</script>
