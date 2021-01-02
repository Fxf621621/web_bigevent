  var layer = layui.layer


  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
      // 1.2 配置选项
  const options = {
      // 纵横比
      aspectRatio: 1,
      // 指定预览区域
      preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 拿到用户选择的文件
  //   var file = e.target.files[0]

  //   var newImgURL = URL.createObjectURL(file)

  //   $image
  //       .cropper('destroy') // 销毁旧的裁剪区域
  //       .attr('src', newImgURL) // 重新设置图片路径
  //       .cropper(options) // 重新初始化裁剪区域

  // 给上传绑定点击事件

  $('#shang').on('click', function() {
      //   e.preventDafult();
      $('#file').click();
  })

  //给file绑定change事件
  $('#file').on('change', function(e) {
      console.log(e);

      var newFile = e.target.files;
      if (newFile.length == 0) {
          return layer.msg('上传失败！')
      }

      // 拿到用户选择的文件
      var file = e.target.files[0]

      //创建一个对应的url地址

      var newImgURL = URL.createObjectURL(file)

      //
      $image
          .cropper('destroy') // 销毁旧的裁剪区域
          .attr('src', newImgURL) // 重新设置图片路径
          .cropper(options) // 重新初始化裁剪区域

  })

  $('#btnUpload').on('click', function() {
      var dataURL = $image
          .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
              width: 100,
              height: 100
          })
          // 小图片可以转成base64，因为会减少不必要的请求，提高网页的打开速度，base64图片会比原图大30%
          .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      $.ajax({
          method: "POST",
          url: '/my/update/avatar',
          data: {
              avatar: dataURL
          },
          success: function(res) {
              if (res.status !== 0) {
                  return layer.mas('更新头像失败！')
              }
              layer.msg('更新头像成功！');
              window.parent.getUserInfo();
          }
      })
  })