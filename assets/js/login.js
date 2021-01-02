$(function() {
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login_box').hide()
    })
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login_box').show()
    })


    // 初始化form表单
    var form = layui.form;
    var layer = layui.layer
        //2,自定义函数效验规则
    form.verify({
            // 自定义了一个叫做 pwd 校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            // 校验两次密码是否一致的规则
            repwd: function(value) {
                // 通过形参拿到的是确认密码框中的内容
                // 还需要拿到密码框中的内容
                // 然后进行一次等于的判断
                // 如果判断失败,则return一个提示消息即可
                var pwd = $('#form_reg [name=password]').val()
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        // 监听注册表单事件
    $('#form_reg').on('submit', function(e) {
        //1, 阻止表单默认跳转
        e.preventDefault();
        //2,发起post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.massage)
            }
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为
            $('#link_login').click();
        })
    })




    // 监听表单提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        console.log(666);
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // 将得到登录成功token 字符串，保存到localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})