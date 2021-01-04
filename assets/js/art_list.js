$(function() {

    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage
        // 定义一个查询的参数对象，将来请求数据的时候，
        // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 3, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 请求文章列表数据并使用模板引擎渲染列表结构
    //1,定义获取文章列表数据的方法如下：
    initTable();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                    // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                console.log(htmlStr);
                $('tbody').html(htmlStr)
                    // console.log(res.data);
                    //调用分页
                renderPage(res.total)
            }

        })
    }


    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //发起请求获取并渲染文章分类的下拉选择框
    //1,定义initCate函数请求文章分类的列表数据
    initCate();

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取分类数据失败！')

                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通过layui 重新渲染表单区域的ui结构
                // layui 渲染机制
                form.render()
            }
        })
    }

    //事项筛选功能
    //1，为筛选选表单绑定submit事件：
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象对应q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            //  根据最新的筛选条件，重新渲染表格
        initTable()
    })




    // 调用laypage.render() 方法，来渲染分页结构：
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数除以
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum // 设置默认被选中的分页
        })
    }


    //在jump回调函数中通过obj.curr获取到最新的页码值
    // 定义渲染分页的方法
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页展示多少条信息？
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit //赋值给q.pagesize属性中
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 编辑文章列表，做委托
    var indexBian = null
    $("tbody").on('click', ".btn-bian", function(e) {
        console.log('编辑');
        // 弹出一个修改文章的信息层
        indexBian = layer.open({
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
                console.log(res);
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




    // 删除文章列表的文章，做委托
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