<template>
  <div class="user-member">
    <a-card title="会员中心" class="member-card">
      <a-spin :spinning="memberStore.loading">
        <a-tabs v-model:activeKey="activeTab" type="card">
          <!-- 会员信息标签页 -->
          <a-tab-pane key="info" tab="会员信息">
            <div v-if="memberStore.isMember" class="member-info-section">
              <a-row :gutter="[16, 16]">
                <a-col :span="24">
                  <a-card>
                    <div class="level-card">
                      <div class="level-icon">
                        <img
                          v-if="memberStore.currentLevel?.icon"
                          :src="memberStore.currentLevel.icon"
                          alt="会员图标"
                        />
                        <crown-outlined v-else style="font-size: 60px; color: #ffd700" />
                      </div>
                      <div class="level-info">
                        <h2>{{ memberStore.currentLevel?.levelName }}</h2>
                        <p class="discount-info">
                          享受
                          <span class="discount-rate">{{
                            ((memberStore.currentLevel?.discountRate || 1) * 10).toFixed(1)
                          }}</span>
                          折优惠
                        </p>
                        <a-descriptions :column="2" bordered size="small">
                          <a-descriptions-item label="成长值">
                            {{ memberStore.memberInfo?.growthValue || 0 }}
                          </a-descriptions-item>
                          <a-descriptions-item label="累计消费">
                            ¥{{ memberStore.memberInfo?.totalConsumeAmount || 0 }}
                          </a-descriptions-item>
                          <a-descriptions-item label="开通时间">
                            {{ formatDate(memberStore.memberInfo?.activateTime) || '-' }}
                          </a-descriptions-item>
                          <a-descriptions-item label="到期时间">
                            {{
                              memberStore.memberInfo?.expireTime
                                ? formatDate(memberStore.memberInfo.expireTime)
                                : '永久有效'
                            }}
                          </a-descriptions-item>
                          <a-descriptions-item label="会员状态">
                            <a-tag :color="getStatusColor(memberStore.memberInfo?.status)">
                              {{ memberStore.memberInfo?.statusText }}
                            </a-tag>
                          </a-descriptions-item>
                        </a-descriptions>
                      </div>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </div>

            <div v-else class="no-member-section">
              <a-empty description="您还不是会员">
                <template #image>
                  <crown-outlined style="font-size: 80px; color: #d9d9d9" />
                </template>
                <a-button type="primary" size="large" @click="activeTab = 'levels'">
                  立即开通会员
                </a-button>
              </a-empty>
            </div>
          </a-tab-pane>

          <!-- 会员等级标签页 -->
          <a-tab-pane key="levels" tab="会员等级">
            <a-row :gutter="[16, 16]">
              <a-col
                v-for="level in memberStore.allLevels"
                :key="level.id"
                :xs="24"
                :sm="12"
                :lg="8"
              >
                <a-card
                  :class="{
                    'level-item-card': true,
                    'current-level': level.id === memberStore.memberInfo?.levelId,
                  }"
                  hoverable
                >
                  <div class="level-item">
                    <div class="level-item-icon">
                      <img v-if="level.icon" :src="level.icon" alt="等级图标" />
                      <crown-outlined v-else style="font-size: 40px; color: #ffd700" />
                    </div>
                    <h3>{{ level.levelName }}</h3>
                    <p class="level-discount">
                      {{ (level.discountRate! * 10).toFixed(1) }}折优惠
                    </p>
                    <a-divider />
                    <div class="level-details">
                      <p>
                        <span class="label">所需成长值</span>
                        <span class="value">{{ level.requiredGrowth }}</span>
                      </p>
                      <p class="description">{{ level.description }}</p>
                    </div>
                    <a-button
                      v-if="!memberStore.isMember || level.id !== memberStore.memberInfo?.levelId"
                      type="primary"
                      block
                      @click="handleActivate(level)"
                    >
                      {{
                        memberStore.isMember &&
                        level.requiredGrowth! > memberStore.currentLevel!.requiredGrowth!
                          ? '升级会员'
                          : '开通会员'
                      }}
                    </a-button>
                    <a-tag v-else color="success" style="width: 100%; text-align: center">
                      当前等级
                    </a-tag>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>

          <!-- 我的优惠券标签页 -->
          <a-tab-pane key="coupons" tab="我的优惠券">
            <a-spin :spinning="couponsLoading">
              <a-empty v-if="!couponsLoading && myCoupons.length === 0" description="暂无优惠券">
                <template #image>
                  <gift-outlined style="font-size: 64px; color: #d9d9d9" />
                </template>
              </a-empty>
              <a-row v-else :gutter="[16, 16]">
                <a-col
                  v-for="coupon in myCoupons"
                  :key="coupon.id"
                  :xs="24"
                  :sm="12"
                  :lg="8"
                >
                  <a-card
                    :class="{
                      'coupon-card': true,
                      'coupon-used': coupon.status === 1,
                      'coupon-expired': coupon.status === 2,
                    }"
                    hoverable
                  >
                    <div class="coupon-content">
                      <div class="coupon-amount">
                        <template v-if="coupon.couponType === 1">
                          <div class="amount-value">¥{{ coupon.discountAmount }}</div>
                          <div class="amount-condition">满{{ coupon.minAmount }}可用</div>
                        </template>
                        <template v-else-if="coupon.couponType === 2">
                          <div class="amount-value">{{ (coupon.discountRate! * 10).toFixed(1) }}折</div>
                          <div class="amount-condition">
                            {{ coupon.minAmount ? `满${coupon.minAmount}可用` : '无门槛' }}
                          </div>
                        </template>
                      </div>
                      <a-divider />
                      <div class="coupon-info">
                        <h4>{{ coupon.couponName }}</h4>
                        <p class="coupon-time">
                          <calendar-outlined />
                          {{ formatDate(coupon.startTime) }} ~ {{ formatDate(coupon.endTime) }}
                        </p>
                        <p class="coupon-receive-time">领取时间: {{ formatDate(coupon.receiveTime) }}</p>
                        <a-tag :color="getCouponStatusColor(coupon.status)" class="coupon-status">
                          {{ coupon.statusText }}
                        </a-tag>
                        <div v-if="coupon.status === 1" class="use-time">
                          使用时间: {{ formatDate(coupon.useTime) }}
                        </div>
                        <div
                          v-if="!coupon.canUse && coupon.unavailableReason"
                          class="unavailable-reason"
                        >
                          {{ coupon.unavailableReason }}
                        </div>
                      </div>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </a-spin>
          </a-tab-pane>

          <!-- 权益记录标签页 -->
          <a-tab-pane key="benefits" tab="权益记录">
            <a-table
              :columns="benefitColumns"
              :data-source="memberStore.benefitLogs"
              :pagination="false"
              :loading="memberStore.loading"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'benefitType'">
                  <a-tag :color="getBenefitTypeColor(record.benefitType)">
                    {{ record.benefitTypeText }}
                  </a-tag>
                </template>
                <template v-if="column.key === 'triggerEvent'">
                  <a-tag>{{ record.triggerEventText }}</a-tag>
                </template>
                <template v-if="column.key === 'createTime'">
                  {{ formatDate(record.createTime) }}
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </a-card>

    <!-- 支付确认弹窗 -->
    <a-modal
      v-model:open="paymentModalVisible"
      title="开通会员"
      :confirm-loading="paymentLoading"
      @ok="handlePaymentConfirm"
    >
      <div class="payment-info">
        <a-result status="info" :title="`开通${selectedLevel?.levelName}`">
          <template #icon>
            <crown-outlined style="font-size: 72px; color: #1890ff" />
          </template>
          <template #subTitle>
            <div class="payment-details">
              <p>
                <span class="label">会员等级</span>
                <span class="value">{{ selectedLevel?.levelName }}</span>
              </p>
              <p>
                <span class="label">折扣优惠</span>
                <span class="value">
                  {{ ((selectedLevel?.discountRate || 1) * 10).toFixed(1) }}折
                </span>
              </p>
              <p>
                <span class="label">所需成长值</span>
                <span class="value">{{ selectedLevel?.requiredGrowth }}</span>
              </p>
            </div>
          </template>
        </a-result>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CrownOutlined, GiftOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import { useMemberStore } from '@/stores/member'
import { getMyCouponsUsingGet } from '@/api/youhuiquanjiekou'
import { formatDate } from '@/utils'

const memberStore = useMemberStore()
const activeTab = ref('info')
const paymentModalVisible = ref(false)
const paymentLoading = ref(false)
const selectedLevel = ref<API.MemberLevelVO | null>(null)

// 我的优惠券相关
const myCoupons = ref<API.UserCouponVO[]>([])
const couponsLoading = ref(false)

const benefitColumns = [
  {
    title: '权益类型',
    dataIndex: 'benefitTypeText',
    key: 'benefitType',
  },
  {
    title: '权益值',
    dataIndex: 'benefitValue',
    key: 'benefitValue',
  },
  {
    title: '触发事件',
    dataIndex: 'triggerEventText',
    key: 'triggerEvent',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '领取时间',
    key: 'createTime',
  },
]

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

function getBenefitTypeColor(type?: number) {
  switch (type) {
    case 1:
      return 'blue'
    case 2:
      return 'green'
    case 3:
      return 'orange'
    default:
      return 'default'
  }
}

function getCouponStatusColor(status?: number) {
  switch (status) {
    case 0:
      return 'success' // 未使用
    case 1:
      return 'default' // 已使用
    case 2:
      return 'error' // 已过期
    default:
      return 'default'
  }
}

// 获取用户的所有优惠券
async function fetchMyCoupons() {
  try {
    couponsLoading.value = true
    const res = await getMyCouponsUsingGet()
    console.log('我的优惠券接口响应 res:', res)
    console.log('我的优惠券接口响应 res.data:', res.data)

    if (res.code === 0 && res.data) {
      myCoupons.value = res.data
      console.log('我的优惠券加载成功 count:', myCoupons.value.length)
    } else {
      console.warn('优惠券接口返回异常 code:', res.code, 'message:', res.message)
    }
  } catch (error) {
    console.error('获取优惠券列表失败 error:', error)
    message.error('获取优惠券列表失败')
  } finally {
    couponsLoading.value = false
  }
}

// 监听标签页切换，当切换到优惠券标签时加载数据
watch(activeTab, (newTab) => {
  if (newTab === 'coupons') {
    fetchMyCoupons()
  }
})

function handleActivate(level: API.MemberLevelVO) {
  selectedLevel.value = level
  paymentModalVisible.value = true
}

async function handlePaymentConfirm() {
  if (!selectedLevel.value?.id) return

  try {
    paymentLoading.value = true
    const res = await memberStore.activateMember(selectedLevel.value.id, 'alipay')
    if (res.code === 0) {
      message.success('支付成功 会员开通成功')
      paymentModalVisible.value = false
      activeTab.value = 'coupons' // 开通成功后跳转到优惠券标签页
      await Promise.all([
        memberStore.fetchMemberInfo(),
        memberStore.fetchBenefitLogs(),
        fetchMyCoupons(), // 刷新优惠券列表
      ])
    } else {
      message.error(res.message || '开通失败')
    }
  } finally {
    paymentLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    memberStore.fetchMemberInfo(),
    memberStore.fetchAllLevels(),
    memberStore.fetchBenefitLogs(),
  ])
})
</script>

<style scoped lang="scss">
.user-member {
  padding: 20px;

  .member-card {
    min-height: 600px;
  }

  .member-info-section {
    .level-card {
      display: flex;
      gap: 24px;
      align-items: center;

      .level-icon {
        img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }
      }

      .level-info {
        flex: 1;

        h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          color: #1890ff;
        }

        .discount-info {
          margin-bottom: 16px;
          font-size: 16px;

          .discount-rate {
            font-size: 28px;
            font-weight: bold;
            color: #ff4d4f;
            margin: 0 4px;
          }
        }
      }
    }
  }

  .no-member-section {
    padding: 80px 0;
    text-align: center;
  }

  .level-item-card {
    transition: all 0.3s;

    &.current-level {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
    }

    .level-item {
      text-align: center;

      .level-item-icon {
        margin-bottom: 16px;

        img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 20px;
        color: #1890ff;
      }

      .level-discount {
        font-size: 18px;
        font-weight: bold;
        color: #ff4d4f;
        margin-bottom: 12px;
      }

      .level-details {
        text-align: left;
        margin-bottom: 16px;

        p {
          margin: 8px 0;
          display: flex;
          justify-content: space-between;

          &.description {
            display: block;
            color: #666;
            font-size: 12px;
            margin-top: 12px;
          }

          .label {
            color: #666;
          }

          .value {
            font-weight: 500;
          }
        }
      }
    }
  }

  .payment-info {
    .payment-details {
      margin-top: 16px;

      p {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .label {
          color: #666;
        }

        .value {
          font-weight: 500;
          color: #1890ff;
        }
      }
    }
  }

  // 优惠券卡片样式
  .coupon-card {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.coupon-used {
      opacity: 0.6;
      background: #f5f5f5;
    }

    &.coupon-expired {
      opacity: 0.5;
      background: #fff1f0;
      border-color: #ffccc7;
    }

    .coupon-content {
      .coupon-amount {
        text-align: center;
        padding: 16px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin: -16px -16px 0 -16px;

        .amount-value {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .amount-condition {
          font-size: 14px;
          opacity: 0.9;
        }
      }

      .coupon-info {
        padding: 12px 0;

        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .coupon-time {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .coupon-receive-time {
          font-size: 12px;
          color: #999;
          margin-bottom: 8px;
        }

        .coupon-status {
          margin-bottom: 8px;
        }

        .use-time {
          font-size: 12px;
          color: #999;
          margin-top: 8px;
        }

        .unavailable-reason {
          font-size: 12px;
          color: #ff4d4f;
          background: #fff2f0;
          padding: 8px;
          border-radius: 4px;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>