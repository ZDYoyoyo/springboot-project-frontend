<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//調用函數,獲取使用者詳細信息
const getUserInfo = async () => {
    //調用接口
    let result = await userInfoService();
    //資料存儲到pinia中
    userInfoStore.setInfo(result.data);
}

getUserInfo();

//條目被點擊後,調用的函數
import { useRouter } from 'vue-router'
const router = useRouter();
import { ElMessage, ElMessageBox } from 'element-plus'
const handleCommand = (command) => {
    //判斷指令
    if (command === 'logout') {
        //退出登錄
        ElMessageBox.confirm(
            '您確認要退出嗎?',
            '溫馨提示',
            {
                confirmButtonText: '確認',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //退出登錄
                //1.清空pinia中存儲的token以及個人資訊
                tokenStore.removeToken()
                userInfoStore.removeInfo()

                //2.跳轉到登錄頁面
                router.push('/login')
                ElMessage({
                    type: 'success',
                    message: '退出登錄成功',
                })

            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '用戶取消了退出登錄',
                })
            })
    } else {
        //路由
        router.push('/user/' + command)
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左側菜單 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分類</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>個人中心</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本資料</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更換頭像</span>
                    </el-menu-item>
                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重設密碼</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右側主區域 -->
        <el-container>
            <!-- 頭部區域 -->
            <el-header>
                <div>作者：<strong>{{ userInfoStore.info.nickname }}</strong></div>
                <!-- 下拉菜單 -->
                <!-- command: 條目被點擊後會觸發,在事件函數上可以聲明一個參數,接收條目對應的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar
                            :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : 'https://storage.googleapis.com/springboot_project_bucket/2852428c-3b54-4562-bbc3-ce163dccdf5b.jpg'" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本資料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更換頭像</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">重設密碼</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登錄</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中間區域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
            內容展示區
        </div> -->
                <router-view></router-view>
            </el-main>
            <!-- 底部區域 -->
            <el-footer>
                縫合怪 ©2024 Created by 鍾定佑
            </el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/莒光園地片頭.jpg') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>