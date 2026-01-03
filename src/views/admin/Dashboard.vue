<template>
  <div class="admin-dashboard">
    <a-spin :spinning="loading">
      <!-- 顶部统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card>
            <a-statistic title="总用户数" :value="statistics.totalUsers" suffix="人" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic title="总订单数" :value="statistics.totalOrders" suffix="单" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="待审核商品"
              :value="statistics.pendingProducts"
              suffix="件"
              :value-style="{ color: '#ff4d4f' }"
            />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="待审核店铺"
              :value="statistics.pendingShops"
              suffix="个"
              :value-style="{ color: '#ff4d4f' }"
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- 趋势图表行 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="12">
          <a-card title="订单趋势" :bordered="false">
            <template #extra>
              <a-radio-group v-model:value="orderTrendDays" button-style="solid" size="small">
                <a-radio-button :value="7">近7天</a-radio-button>
                <a-radio-button :value="30">近30天</a-radio-button>
              </a-radio-group>
            </template>
            <v-chart class="chart" :option="orderTrendOption" autoresize />
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="销售额趋势" :bordered="false">
            <template #extra>
              <a-radio-group v-model:value="salesTrendDays" button-style="solid" size="small">
                <a-radio-button :value="7">近7天</a-radio-button>
                <a-radio-button :value="30">近30天</a-radio-button>
              </a-radio-group>
            </template>
            <v-chart class="chart" :option="salesTrendOption" autoresize />
          </a-card>
        </a-col>
      </a-row>

      <!-- 分布图表行 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="8">
          <a-card title="订单状态分布" :bordered="false">
            <v-chart class="chart" :option="orderStatusOption" autoresize />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="用户角色分布" :bordered="false">
            <v-chart class="chart" :option="userRoleOption" autoresize />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card title="店铺等级分布" :bordered="false">
            <v-chart class="chart" :option="shopLevelOption" autoresize />
          </a-card>
        </a-col>
      </a-row>

      <!-- 商品分类统计 -->
      <a-row :gutter="16">
        <a-col :span="24">
          <a-card title="商品分类 TOP 10" :bordered="false">
            <v-chart class="chart-large" :option="categoryOption" autoresize />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import type { EChartsOption } from 'echarts'
import {
  getOverviewStatisticsUsingGet,
  getOrderTrendUsingGet,
  getSalesTrendUsingGet,
  getOrderStatusDistributionUsingGet,
  getUserRoleDistributionUsingGet,
  getShopLevelDistributionUsingGet,
  getProductCategoryDistributionUsingGet,
} from '@/api/guanlihoutaishujutongjijiekou'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const loading = ref(false)
const orderTrendDays = ref(7)
const salesTrendDays = ref(7)

// 监听天数变化，自动刷新图表
watch(orderTrendDays, (newVal, oldVal) => {
  console.log('订单趋势天数变化:', oldVal, '->', newVal)
  fetchOrderTrend()
})

watch(salesTrendDays, (newVal, oldVal) => {
  console.log('销售额趋势天数变化:', oldVal, '->', newVal)
  fetchSalesTrend()
})

const statistics = reactive({
  totalUsers: 0,
  totalOrders: 0,
  pendingProducts: 0,
  pendingShops: 0,
})

const orderTrendOption = ref<EChartsOption>({})
const salesTrendOption = ref<EChartsOption>({})
const orderStatusOption = ref<EChartsOption>({})
const userRoleOption = ref<EChartsOption>({})
const shopLevelOption = ref<EChartsOption>({})
const categoryOption = ref<EChartsOption>({})

onMounted(() => {
  fetchAllData()
})

const fetchAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchOverviewStatistics(),
      fetchOrderTrend(),
      fetchSalesTrend(),
      fetchOrderStatusDistribution(),
      fetchUserRoleDistribution(),
      fetchShopLevelDistribution(),
      fetchCategoryDistribution(),
    ])
  } catch (error) {
    console.error('获取统计数据失败', error)
    message.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

const fetchOverviewStatistics = async () => {
  const res = await getOverviewStatisticsUsingGet()
  if (res.code === 0 && res.data) {
    statistics.totalUsers = Number(res.data.totalUsers) || 0
    statistics.totalOrders = Number(res.data.totalOrders) || 0
    statistics.pendingProducts = Number(res.data.pendingProducts) || 0
    statistics.pendingShops = Number(res.data.pendingShops) || 0
  }
}

const fetchOrderTrend = async () => {
  try {
    const res = await getOrderTrendUsingGet({ days: orderTrendDays.value })
    if (res.code === 0 && res.data && Array.isArray(res.data)) {
      const dates = res.data.map((item) => item.date || '')
      const counts = res.data.map((item) => item.count || 0)

      orderTrendOption.value = {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          name: '订单数',
        },
        series: [
          {
            name: '订单数量',
            type: 'line',
            smooth: true,
            data: counts,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                  { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
                ],
              },
            },
            itemStyle: {
              color: '#1890ff',
            },
          },
        ],
      }
    }
  } catch (error) {
    console.error('获取订单趋势失败', error)
  }
}

const fetchSalesTrend = async () => {
  try {
    const res = await getSalesTrendUsingGet({ days: salesTrendDays.value })
    if (res.code === 0 && res.data && Array.isArray(res.data)) {
      const dates = res.data.map((item) => item.date || '')
      const amounts = res.data.map((item) => Number(item.amount) || 0)

      salesTrendOption.value = {
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const data = params[0]
            return `${data.name}<br/>${data.seriesName}: ¥${data.value.toFixed(2)}`
          },
        },
        xAxis: {
          type: 'category',
          data: dates,
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          name: '销售额(元)',
          axisLabel: {
            formatter: '¥{value}',
          },
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            smooth: true,
            data: amounts,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                  { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
                ],
              },
            },
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      }
    }
  } catch (error) {
    console.error('获取销售额趋势失败', error)
  }
}

const fetchOrderStatusDistribution = async () => {
  const res = await getOrderStatusDistributionUsingGet()
  if (res.code === 0 && res.data) {
    const statusNames: Record<number, string> = {
      0: '待支付',
      1: '待发货',
      2: '待收货',
      3: '已完成',
      4: '已取消',
    }

    const data = res.data.map((item) => ({
      name: statusNames[item.status || 0] || '未知',
      value: item.count || 0,
    }))

    orderStatusOption.value = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }
}

const fetchUserRoleDistribution = async () => {
  const res = await getUserRoleDistributionUsingGet()
  if (res.code === 0 && res.data) {
    const roleNames: Record<string, string> = {
      user: '普通用户',
      seller: '卖家',
      admin: '管理员',
    }

    const data = res.data.map((item) => ({
      name: roleNames[item.name || ''] || item.name || '未知',
      value: item.count || 0,
    }))

    userRoleOption.value = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }
}

const fetchShopLevelDistribution = async () => {
  const res = await getShopLevelDistributionUsingGet()
  if (res.code === 0 && res.data) {
    const levelNames: Record<number, string> = {
      0: '普通店铺',
      1: '品牌店铺',
      2: '旗舰店铺',
    }

    const data = res.data.map((item) => ({
      name: levelNames[item.status || 0] || '未知',
      value: item.count || 0,
    }))

    shopLevelOption.value = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }
}

const fetchCategoryDistribution = async () => {
  const res = await getProductCategoryDistributionUsingGet()
  if (res.code === 0 && res.data) {
    const categories = res.data.map((item) => item.name || '未知')
    const counts = res.data.map((item) => item.count || 0)

    categoryOption.value = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
        name: '商品数量',
      },
      series: [
        {
          name: '商品数量',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#69c0ff' },
              ],
            },
          },
          barWidth: '60%',
        },
      ],
    }
  }
}
</script>

<style scoped lang="less">
.admin-dashboard {
  .chart {
    height: 300px;
  }

  .chart-large {
    height: 400px;
  }
}
</style>