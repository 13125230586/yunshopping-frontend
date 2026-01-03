<template>
  <div class="shop-manage">
    <a-card title="店铺管理">
      <a-spin :spinning="loading">
        <template v-if="shop">
          <a-descriptions bordered :column="2">
            <a-descriptions-item label="店铺名称">
              {{ shop.shopName }}
            </a-descriptions-item>
            <a-descriptions-item label="店铺状态">
              <a-tag v-if="shop.shopStatus === 0" color="orange">待审核</a-tag>
              <a-tag v-else-if="shop.shopStatus === 1" color="green">营业中</a-tag>
              <a-tag v-else-if="shop.shopStatus === 2" color="red">已关闭</a-tag>
              <a-tag v-else color="gray">已拒绝</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="店铺Logo" :span="2">
              <img v-if="shop.shopLogo" :src="shop.shopLogo" alt="店铺Logo" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px" />
            </a-descriptions-item>
            <a-descriptions-item label="店铺描述" :span="2">
              {{ shop.shopDescription || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="联系电话">
              {{ shop.contactPhone || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="店铺地址">
              {{ shop.shopAddress || '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间" :span="2">
              {{ formatTime(shop.createTime) }}
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />
        </template>
        <a-empty v-else description="暂无店铺信息" />
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listShopByPageUsingPost } from '@/api/shopController'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loading = ref(false)
const shop = ref<any>(null)

onMounted(() => {
  fetchShopInfo()
})

const fetchShopInfo = async () => {
  loading.value = true
  try {
    const res = await listShopByPageUsingPost({
      current: 1,
      pageSize: 1,
      userId: userStore.userInfo?.id,
    })
    if (res.code === 0 && res.data && res.data.records && res.data.records.length > 0) {
      shop.value = res.data.records[0]
    }
  } catch (error) {
    console.error('获取店铺信息失败 userId:', userStore.userInfo?.id, error)
  } finally {
    loading.value = false
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
.shop-manage {
  :deep(.ant-descriptions-item-label) {
    font-weight: 500;
  }
}
</style>
