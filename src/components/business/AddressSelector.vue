<template>
  <div class="address-selector">
    <a-spin :spinning="addressStore.loading">
      <div v-if="addressStore.addressList.length === 0" class="empty-address">
        <a-empty description="暂无收货地址" />
        <div style="text-align: center; margin-top: 16px">
          <a-button type="primary" @click="showAddressModal = true">
            添加收货地址
          </a-button>
        </div>
      </div>
      <a-radio-group v-else v-model:value="selectedAddressId" @change="handleChange">
        <div v-for="address in addressStore.addressList" :key="address.id" class="address-item">
          <a-radio :value="address.id">
            <div class="address-content">
              <div class="address-header">
                <span class="receiver">{{ address.receiverName }}</span>
                <span class="phone">{{ address.receiverPhone }}</span>
                <a-tag v-if="address.isDefault === 1" color="red">默认</a-tag>
              </div>
              <div class="address-detail">
                {{ formatAddress(address.province, address.city, address.district, address.detailAddress) }}
              </div>
            </div>
          </a-radio>
        </div>
      </a-radio-group>
      <div v-if="addressStore.addressList.length > 0" style="margin-top: 16px">
        <a-button type="dashed" block @click="showAddressModal = true">
          + 添加新地址
        </a-button>
      </div>
    </a-spin>

    <address-form-modal
      v-model:visible="showAddressModal"
      @success="handleAddressSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAddressStore } from '@/stores/address'
import { formatAddress } from '@/utils'
import AddressFormModal from './AddressFormModal.vue'

const props = defineProps<{
  value?: number
}>()

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const addressStore = useAddressStore()
const showAddressModal = ref(false)

const selectedAddressId = computed({
  get: () => props.value || addressStore.defaultAddress?.id || 0,
  set: (value) => emit('update:value', value),
})

onMounted(() => {
  addressStore.fetchAddressList()
})

watch(() => addressStore.defaultAddress, (newVal) => {
  if (newVal && !props.value) {
    emit('update:value', newVal.id)
  }
})

const handleChange = () => {
  if (selectedAddressId.value) {
    emit('update:value', selectedAddressId.value)
  }
}

const handleAddressSuccess = async () => {
  await addressStore.fetchAddressList()
  if (addressStore.defaultAddress) {
    emit('update:value', addressStore.defaultAddress.id)
  }
}
</script>

<style scoped lang="less">
.address-selector {
  .address-item {
    padding: 16px;
    border: 1px solid #f0f0f0;
    margin-bottom: 8px;
    border-radius: 4px;

    &:hover {
      border-color: #1890ff;
    }

    .address-content {
      padding-left: 24px;

      .address-header {
        margin-bottom: 8px;

        .receiver {
          font-weight: bold;
          margin-right: 16px;
        }

        .phone {
          color: #666;
        }
      }

      .address-detail {
        color: #666;
      }
    }
  }
}
</style>
