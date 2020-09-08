<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.login_container{
    height: 100%;
    background-color: #2b4b6b;
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .avatar_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #eee;
            background-color: #fff;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #ddd;
            }
        }
    }
}
</style>
