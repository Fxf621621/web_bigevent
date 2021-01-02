$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    // 调用函数
    initUserInfo();

    function initUserInfo() {
        // 发起get请求
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res.data);

                form.val('formUserInfo', res.data)
            }
        })
    }

    //给重置绑定点击事件
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认跳转
        e.preventDefault()
        initUserInfo();
    })

    //给表单注册提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认跳转
        e.preventDefault();
        console.log(666);
        // 发起post请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')

                }

                // 如果成功
                layer.msg('更新用户信息成功！');
                console.log(777);
                window.parent.getUserInfo();
            }
        })
    })
})