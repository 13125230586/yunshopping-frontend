<template>
  <div class="seller-dashboard">
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in stats" :key="item.title">
        <a-card>
          <a-statistic :title="item.title" :value="item.value" :suffix="item.suffix" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: '今日订单', value: 0, suffix: '单' },
  { title: '今日销售额', value: 0, suffix: '元' },
  { title: '商品总数', value: 0, suffix: '件' },
  { title: '待发货订单', value: 0, suffix: '单' },
])
</script>
