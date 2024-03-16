<script setup>
import { ref } from 'vue'

const passwordInfo = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

//校驗密碼的函數
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('請再次確認密碼'))
    } else if (value !== passwordInfo.value.new_pwd) {
        callback(new Error('請確保兩次輸入的密碼一致'))
    } else {
        callback()
    }
}
const rules = {
    old_pwd: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 5, max: 16, message: '長度為5~16位非空字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { min: 5, max: 16, message: '長度為5~16位非空字符', trigger: 'blur' }
    ],
    re_pwd: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//修改個人信息
import { useRouter } from 'vue-router'
const router = useRouter();
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
import { userPasswordUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updatePassword = async () => {
    //調用接口
    let result = await userPasswordUpdateService(passwordInfo.value);
    //退出登錄
    //1.清空pinia中存儲的token以及個人資訊
    tokenStore.removeToken()
    userInfoStore.removeInfo()

    //2.跳轉到登錄頁面
    router.push('/login')
    ElMessage.success(result.message ? result.message : '修改成功請重新登入');
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本資料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="passwordInfo" :rules="rules" label-width="150px" size="large">
                    <el-form-item label="舊密碼" prop="old_pwd">
                        <el-input v-model="passwordInfo.old_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="新密碼" prop="new_pwd">
                        <el-input v-model="passwordInfo.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="再次確認新密碼" prop="re_pwd">
                        <el-input v-model="passwordInfo.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatePassword">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>