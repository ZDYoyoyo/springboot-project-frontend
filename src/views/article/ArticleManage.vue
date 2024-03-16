<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

import { ref } from 'vue'

// 文章分類資料模型
const categorys = ref([
    {
        "id": 3,
        "categoryName": "美食",
        "categoryAlias": "my",
        "createTime": "2023-09-02 12:06:59",
        "updateTime": "2023-09-02 12:06:59"
    },
    {
        "id": 4,
        "categoryName": "娛樂",
        "categoryAlias": "yl",
        "createTime": "2023-09-02 12:08:16",
        "updateTime": "2023-09-02 12:08:16"
    },
    {
        "id": 5,
        "categoryName": "軍事",
        "categoryAlias": "js",
        "createTime": "2023-09-02 12:08:33",
        "updateTime": "2023-09-02 12:08:33"
    }
])

// 使用者搜索時選擇的分類id
const categoryId = ref('')

// 使用者搜索時選擇的發佈狀態
const state = ref('')

// 文章列表資料模型
const articles = ref([
    {
        "id": 5,
        "title": "陝西旅遊攻略",
        "content": "兵馬俑,華清池,法門寺,華山...愛去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陝西旅遊攻略",
        "content": "兵馬俑,華清池,法門寺,華山...愛去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
    {
        "id": 5,
        "title": "陝西旅遊攻略",
        "content": "兵馬俑,華清池,法門寺,華山...愛去哪去哪...",
        "coverImg": "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
        "state": "草稿",
        "categoryId": 2,
        "createTime": "2023-09-03 11:55:30",
        "updateTime": "2023-09-03 11:55:30"
    },
])

// 分頁條資料模型
const pageNum = ref(1) // 目前頁面
const total = ref(20) // 總條數
const pageSize = ref(3) // 每頁條數

// 當每頁條數發生了變化，調用此函數
const onSizeChange = (size) => {
    pageSize.value = size
    articleList();
}
// 目前頁碼發生變化，調用此函數
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList();
}

// 回顯文章分類
import { articleCategoryListService, articleListService, articleAddService, articleDeleteService, articleUpdateService, articledetailService } from '@/api/article.js'
const articleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;
}

// 獲取文章列表資料
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await articleListService(params);

    // 渲染視圖
    total.value = result.data.total;
    articles.value = result.data.items;

    // 處理資料，給資料模型擴展一個屬性categoryName，分類名稱
    for (let i = 0; i < articles.value.length; i++) {
        let article = articles.value[i];
        for (let j = 0; j < categorys.value.length; j++) {
            if (article.categoryId == categorys.value[j].id) {
                article.categoryName = categorys.value[j].categoryName;
            }
        }
    }
}


articleCategoryList()
articleList();

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { Plus } from '@element-plus/icons-vue'
// 控制抽屜是否顯示
const visibleDrawer = ref(false)
const visibleDrawerState = ref(false)
// 添加表單資料模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '<p/>',
    state: ''
})

// 導入token
import { useTokenStore } from '@/stores/token.js';
const tokenStore = useTokenStore();

// 上傳成功的回調函數
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data;
    console.log(result.data);
}

// 添加文章
import { ElMessage } from 'element-plus'
const addArticle = async (clickState) => {
    // 把發布狀態賦值給資料模型
    articleModel.value.state = clickState;

    // 調用接口
    let result = await articleAddService(articleModel.value);

    ElMessage.success(result.msg ? result.msg : '添加成功');
    // 讓抽屜消失
    visibleDrawer.value = false;

    // 刷新當前列表
    articleList()
}

// 編輯文章
const updateArticle = async (clickState) => {
    // 把發布狀態賦值給資料模型
    articleModel.value.state = clickState;

    // 調用接口
    let result = await articleUpdateService(articleModel.value);

    ElMessage.success(result.msg ? result.msg : '添加成功');
    // 讓抽屜消失
    visibleDrawer.value = false;

    // 刷新當前列表
    articleList()
}

// 刪除分類
import { ElMessageBox } from 'element-plus'
const deleteArticle = (row) => {
    // 提示用戶 確認框

    ElMessageBox.confirm(
        '你確認要刪除該文章嗎?',
        '溫馨提示',
        {
            confirmButtonText: '確認',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            // 調用接口
            let result = await articleDeleteService(row.id);
            ElMessage({
                type: 'success',
                message: '刪除成功',
            })
            // 刷新列表
            articleList();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用戶取消了刪除',
            })
        })
}

// 編輯文章
const title = ref('')
const showDialog = (row) => {
    visibleDrawer.value = true;
    visibleDrawerState.value = false;
    title.value = '編輯文章'
    // 資料拷貝
    articleModel.value.title = row.title
    articleModel.value.categoryId = row.categoryId
    articleModel.value.coverImg = row.coverImg
    articleModel.value.content = row.content
    articleModel.value.state = row.state
    // 擴展id屬性,將來需要傳遞給後台,完成分類的修改
    articleModel.value.id = row.id;
}

// 清空模型的資料
const clearData = () => {
    articleModel.value.title = ''
    articleModel.value.categoryId = ''
    articleModel.value.coverImg = ''
    articleModel.value.content = '<p/>'
    articleModel.value.state = ''
}

const showDetail = (row) => {
    visibleDrawer.value = true;
    visibleDrawerState.value = true;
    title.value = '文章預覽';
    articleModel.value.title = row.title;
    articleModel.value.categoryName = row.categoryName;
    articleModel.value.coverImg = row.coverImg;
    articleModel.value.content = row.content;
    articleModel.value.state = row.state;
    articleModel.value.updateTime = row.updateTime;
    articleModel.value.createUser = row.createUser;
}

const sanitizeHtml = (html) => {
    // 使用 DOMParser 解析 HTML，並重新序列化以清除潛在的不安全標籤
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary"
                        @click="visibleDrawer = true; visibleDrawerState = false; title = '添加文章'; clearData()">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表單 -->
        <el-form inline>
            <el-form-item label="文章分類：" style="width: 15%">
                <el-select placeholder="請選擇" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="發布狀態：" style="width: 15%">
                <el-select placeholder="請選擇" v-model="state">
                    <el-option label="已發布" value="已發布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章標題" width="400" prop="title">
                <template #default="{ row }">
                    <a class="el-link el-link--primary" @click="showDetail(row)">{{ row.title }}</a>
                </template>
            </el-table-column>
            <el-table-column label="分類" prop="categoryName"></el-table-column>
            <el-table-column label="發表時間" prop="createTime"> </el-table-column>
            <el-table-column label="狀態" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="沒有數據" />
            </template>
        </el-table>
        <!-- 分頁條 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />

        <!-- 抽屜 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 預覽文章 -->
            <el-form v-show="visibleDrawerState == true" :model="articleModel" label-width="100px">
                {{ articleModel.title }}
                <br><br>
                作者:{{ articleModel.createUser }}
                發布時間:{{ articleModel.updateTime }}
                文章分類:{{ articleModel.categoryName }}
                <hr>
                <img v-if="articleModel.coverImg" :src="articleModel.coverImg" width="400" />
                <!--  使用 DOMParser 解析 HTML，并重新序列化以清除潜在的不安全標籤  但是是把全部html標籤格式化 不好用-->
                <!-- <span v-html="sanitizeHtml(articleModel.content)"></span> -->
                <span v-html="articleModel.content"></span>
            </el-form>
            <!-- 添加與更新文章 -->
            <el-form v-show="visibleDrawerState == false" :model="articleModel" label-width="100px">
                <el-form-item label="文章標題">
                    <el-input v-model="articleModel.title" placeholder="請輸入標題"></el-input>
                </el-form-item>
                <el-form-item label="文章分類">
                    <el-select placeholder="請選擇" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">

                    <!-- 
                auto-upload:設置是否自動上傳
                action:設置服務器接口路徑
                name:設置上傳的文件字段名
                headers:設置上傳的請求頭
                on-success:設置上傳成功的回調函數
             -->

                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章內容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
                        </quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                        @click="title == '添加文章' ? addArticle('已發布') : updateArticle('已發布')">發布</el-button>
                    <el-button type="info"
                        @click="title == '添加文章' ? addArticle('草稿') : updateArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>