<script setup>
import { ref } from 'vue'

const passwordInfo = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

//校验密码的函数
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== passwordInfo.value.new_pwd) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}
const rules = {
    old_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度为5~16位非空字符', trigger: 'blur' }
    ],
    re_pwd: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

//修改个人信息
import { useRouter } from 'vue-router'
const router = useRouter();
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
import { userPasswordUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updatePassword = async () => {
    //调用接口
    let result = await userPasswordUpdateService(passwordInfo.value);
    //退出登录
    //1.清空pinia中存储的token以及个人信息
    tokenStore.removeToken()
    userInfoStore.removeInfo()

    //2.跳转到登录页面
    router.push('/login')
    ElMessage.success(result.message ? result.message : '修改成功請重新登入');
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
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