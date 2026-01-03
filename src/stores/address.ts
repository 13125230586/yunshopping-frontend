import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAddressListUsingGet,
  addAddressUsingPost,
  updateAddressUsingPost,
  deleteAddressUsingPost,
  setDefaultAddressUsingPost,
} from '@/api/addressController'
import type { Address } from '@/types/models'

export const useAddressStore = defineStore('address', () => {
  const addressList = ref<Address[]>([])
  const loading = ref(false)

  const defaultAddress = computed(() => {
    return addressList.value.find((item) => item.isDefault === 1)
  })

  async function fetchAddressList() {
    loading.value = true
    try {
      const res = await getAddressListUsingGet()
      if (res.code === 0 && res.data) {
        addressList.value = res.data
      }
    } finally {
      loading.value = false
    }
  }

  async function addAddress(address: Omit<Address, 'id' | 'userId'>) {
    const res = await addAddressUsingPost(address)
    if (res.code === 0) {
      await fetchAddressList()
    }
    return res
  }

  async function updateAddress(address: Address) {
    const res = await updateAddressUsingPost(address)
    if (res.code === 0) {
      await fetchAddressList()
    }
    return res
  }

  async function deleteAddress(id: number) {
    const res = await deleteAddressUsingPost({ id })
    if (res.code === 0) {
      await fetchAddressList()
    }
    return res
  }

  async function setDefaultAddress(addressId: number) {
    const res = await setDefaultAddressUsingPost({ addressId })
    if (res.code === 0) {
      await fetchAddressList()
    }
    return res
  }

  return {
    addressList,
    defaultAddress,
    loading,
    fetchAddressList,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  }
})