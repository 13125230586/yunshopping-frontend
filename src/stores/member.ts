import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getMemberInfoUsingGet,
  getAllLevelsUsingGet,
  activateMemberUsingPost,
  getBenefitLogsUsingGet,
} from '@/api/memberController'
import {
  listAllLevelsUsingGet,
  listMemberByPageUsingPost,
  addMemberLevelUsingPost,
  updateMemberLevelUsingPost,
  deleteMemberLevelUsingPost,
  grantMemberUsingPost,
} from '@/api/memberAdminController'
import type { Page } from '@/types/global'

export const useMemberStore = defineStore('member', () => {
  const memberInfo = ref<API.MemberVO | null>(null)
  const allLevels = ref<API.MemberLevelVO[]>([])
  const benefitLogs = ref<API.MemberBenefitLogVO[]>([])
  const memberList = ref<API.MemberVO[]>([])
  const memberTotal = ref(0)
  const loading = ref(false)

  const isMember = computed(() => !!memberInfo.value && memberInfo.value.status === 0)
  const currentLevel = computed(() => memberInfo.value?.levelInfo)
  const isExpired = computed(() => memberInfo.value?.status === 1)

  async function fetchMemberInfo() {
    try {
      loading.value = true
      const res = await getMemberInfoUsingGet()
      if (res.code === 0) {
        memberInfo.value = res.data || null
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchAllLevels() {
    try {
      loading.value = true
      const res = await getAllLevelsUsingGet()
      if (res.code === 0 && res.data) {
        allLevels.value = res.data
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function activateMember(levelId: number, paymentMethod?: string) {
    try {
      loading.value = true
      const res = await activateMemberUsingPost({ levelId, paymentMethod })
      if (res.code === 0) {
        await fetchMemberInfo()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchBenefitLogs() {
    try {
      loading.value = true
      const res = await getBenefitLogsUsingGet()
      if (res.code === 0 && res.data) {
        benefitLogs.value = res.data
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminLevels() {
    try {
      loading.value = true
      const res = await listAllLevelsUsingGet()
      if (res.code === 0 && res.data) {
        allLevels.value = res.data
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function fetchMemberList(params: API.MemberQueryRequest) {
    try {
      loading.value = true
      const res = await listMemberByPageUsingPost(params)
      if (res.code === 0 && res.data) {
        const pageData = res.data as Page<API.MemberVO>
        memberList.value = pageData.records || []
        memberTotal.value = Number(pageData.total) || 0
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function addLevel(data: API.MemberLevelAddRequest) {
    try {
      loading.value = true
      const res = await addMemberLevelUsingPost(data)
      if (res.code === 0) {
        await fetchAdminLevels()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function updateLevel(data: API.MemberLevelUpdateRequest) {
    try {
      loading.value = true
      const res = await updateMemberLevelUsingPost(data)
      if (res.code === 0) {
        await fetchAdminLevels()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function deleteLevel(id: number) {
    try {
      loading.value = true
      const res = await deleteMemberLevelUsingPost({ id })
      if (res.code === 0) {
        await fetchAdminLevels()
      }
      return res
    } finally {
      loading.value = false
    }
  }

  async function grantMember(data: API.MemberGrantRequest) {
    try {
      loading.value = true
      const res = await grantMemberUsingPost(data)
      return res
    } finally {
      loading.value = false
    }
  }

  function resetMemberInfo() {
    memberInfo.value = null
    allLevels.value = []
    benefitLogs.value = []
  }

  return {
    memberInfo,
    allLevels,
    benefitLogs,
    memberList,
    memberTotal,
    loading,
    isMember,
    currentLevel,
    isExpired,
    fetchMemberInfo,
    fetchAllLevels,
    activateMember,
    fetchBenefitLogs,
    fetchAdminLevels,
    fetchMemberList,
    addLevel,
    updateLevel,
    deleteLevel,
    grantMember,
    resetMemberInfo,
  }
})
