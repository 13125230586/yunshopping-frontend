<template>
  <div class="order-manage">
    <a-card title="订单管理">
      <a-table :dataSource="orders" :columns="columns" rowKey="id" />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const orders = ref([])
const columns = [
  { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
  { title: '买家', dataIndex: 'buyerName', key: 'buyerName' },
  { title: '金额', dataIndex: 'payAmount', key: 'payAmount' },
  { title: '状态', dataIndex: 'orderStatus', key: 'orderStatus' },
  { title: '操作', key: 'action' },
]
</script>
