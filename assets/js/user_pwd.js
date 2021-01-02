$(function() {
    var form = layui.form;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },

        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })


    // 重置密码
    // $('.layui-form').on('submit', function(e) {
    //     // 阻止表单默认跳转
    //     e.preventDefalut();
    //     // 发起post请求
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/updatepwd',
    //         data: $(this).serialize(),
    //         success: function(res) {
    //             if (res.status !== 0) {
    //                 return layui.layer.msg("重置密码失败！")
    //             }
    //             layui.layer.msg("更新密码成功！");
    //             $('.layui-form')[0].reset()
    //         }
    //     })
    // })
})