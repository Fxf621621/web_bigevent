$(function() {

    var layer = layui.layer
    var form = layui.form
        //发起请求获取数据
    initArtCateList();

    function initArtCateList() {
        // console.log(666);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // console.log(res.data);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //给添加类别绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on("click", function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
        })
        //实现添加文章分类的功能
        //1，发起Ajax请求
        //通过代理的形式，为form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        // 阻止表单的默认提交
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 调用函数，重新渲染页面
                initArtCateList()
                layer.msg('新增分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
                console.log('OK!新增分类成功！');
            }
        })
    })


    //编辑按钮
    // 通过代理的形式，为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        console.log('编辑');
        // 弹出一个修改文章分类的信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-add').html()
        })

        //  为编辑弹出层填充表单数据
        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res.data.Id);
                form.val('form-edit', res.data)
                console.log(res.data);
            }
        })
    })


    // 更新文章分类的数据
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    //删除文章分类
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
            // 获取到文章的 id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后,
                        // 再重新调用 initTable 方法
                        // 4
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index)
        })
    })




})