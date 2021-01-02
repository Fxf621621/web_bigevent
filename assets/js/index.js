function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 请求头就是请求头配置对象
        success: function(res) {
            console.log(res);
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            renderAvatar(res.data)
        },
    });
}
// 渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的昵称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎  ' + name)
        //3.按需渲染用户的头像  图片头像还是文本头像
    if (user.user_pic !== null) {
        // 图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()

    }
}
// 入口函数
$(function() {
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html'
                //关闭提示框
            layer.close(index);
        });
    })
})
























// // 获取用户的基本信息
// $(function() {
//     getUserInfo();

//     var layer = layui.layer;

//     // 给退出注册点击事件
//     // layui 弹出层
//     // layer.confirm('退出?', {icon: 3, title:'提示'}, function(index){
//     //     //do something

//     //     layer.close(index);
//     //   });

//     //1，给退出注册点击事件
//     $('#btnLogout').on('click', function() {
//         layer.confirm('退出?', { icon: 3, title: '提示' }, function(index) {
//             //do something
//             //2,清空本地储存的token
//             localStorage.removeItem('token');
//             //3,跳转会登录页面
//             location.href = 'login.html';
//             layer.close(index);
//         });
//     })
// })

// // 获取用户信息
// function getUserInfo() {
//     $.ajax({
//         method: 'GET',
//         url: '/my/userinfo',
//         // headers 就是请求头配置对象
//         success: function(res) {
//             if (res.status !== 0) {
//                 return layui.layer.msg('获取用户信息失败！')
//             }
//             // 调用 renderAvatar 渲染用户的头像
//             console.log(res.data);
//             renderAvatar(res.data)
//         },
//     })
// }
// // 渲染用户的头像
// function renderAvatar(user) {
//     //1,获取用户的名称
//     var name = user.nickname || user.username
//         //2,设置欢迎的文本
//     $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
//         //3,按需渲染用户头像
//     if (user.user_pic !== null) {
//         //3.1 渲染用户头像
//         $('.layui-nav-img').attr('src', user.user_pic).show()
//         $('.text-avatar').hide()
//     } else {
//         //3.2 渲染文本头像
//         $('.layui-nav-img').hide()
//         var first = name[0].toUpperCase() // 转为大写
//         $('.text-avatar').html(first).show()
//     }
// }