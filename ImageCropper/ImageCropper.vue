<template>
  <div>
    <div class="image-cropper-wrapper" v-show="showCropper">
      <img ref="image-cropper" @click="createMask" @mouseover="createMask" class="image-cropper"/>
    </div>
    <div v-show="!showCropper">
      <a class="a-input-container">点击上传
        <input id="file" type="file" value="上传文件" @change="onchange" accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"/>
      </a>
    </div>
    <div v-if="showCropper && !mFile">
      <button type="button" @click="getCropper">剪切</button>
      <button type="button" @click="reopen">重新选择</button>
    </div>
    <link href="//cdn.bootcss.com/cropper/3.1.3/cropper.min.css" rel="stylesheet">
    <div class="image-cropper-tips"><slot name="tips"></slot></div>
  </div>
</template>
<style>
  .a-input-container {
    position: relative;
    display: inline-block;
    background: #20a0ff;
    border-radius: 4px;
    padding: 4px 20px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    text-indent: 0;
    line-height: 26px;
    height: 32px;
    cursor: pointer;
    font-size: 13px;
  }
  .a-input-container input {
    position: absolute;
    /*font-size: 100px;*/
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .a-input-container:hover {
    background: #20a0ff;
    color: #fff;
    text-decoration: none;
  }
  .image-cropper {
    width: auto;
    height: 320px;
    position: relative;
    z-index: 10;
  }
  .image-cropper.image-cropper-rect {
    height: 450px;
  }
  .image-cropper-mask {
    opacity: .5;
    background-color: rgb(0,0,0);
    position: absolute;
    top: 0;
    left: 0;
    height: 320px;
    z-index: 100;
    color: white;
    font-size: 24px;
    text-align: center;
    vertical-align: baseline;
  }
  .image-cropper-mask i {
    cursor: pointer;
    margin-top: 148px;
  }
  .image-cropper-mask i + i {
    margin-left: 60px;
  }
  .iv-container {
    position: fixed;
    background: rgba(0,0,0,.6);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: block;
    z-index: 2000;
    overflow: hidden;
  }
  .image-view {
    display: block;
    width: auto;
    height: 80%;
    margin: auto;
    padding-top: 100px;
  }
  .image-cropper-tips {
    font-size: 12px;
    color: #8391a5;
    margin-top: 7px;
  }
</style>
<script>
  import VueScript2 from 'vue-script2'
  export default {
    name: 'image-cropper',
    data () {
      return {
        $: null,
        fileReader: new window.FileReader(),
        mFile: null,
        showCropper: false,
        currentImg: null,
        currentImage: null
      }
    },
    props: {
      ratio: {
        type: Number,
        default: 1
      },
      url: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      getFiles () {
        return this.mFile
      },
      viewImage (e) {
        let div = document.createElement('div')
        div.className = 'iv-container'
        div.onclick = (e) => {
          document.body.removeChild(e.target)
        }
        let img = document.createElement('img')
        img.src = e.target.parentNode.previousElementSibling.src
        e.target.parentNode.remove()
        img.className = 'image-view'
        img.onclick = (e) => {
          e.stopImmediatePropagation()
          document.body.removeChild(e.target.parentNode)
        }
        div.appendChild(img)
        document.body.appendChild(div)
      },
      deleteImage (e) {
        this.showCropper = false
        this.mFile = null
        e.target.parentNode.remove()
      },
      destroyMask (e) {
        if (e.toElement.nodeName !== 'I' && e.target.className === 'image-cropper-mask') {
          e.target.remove()
        }
        e.stopImmediatePropagation()
      },
      createMask (e) {
        let mask = document.createElement('div')
        let preview = document.createElement('i')
        let del = document.createElement('i')
        preview.className = 'fa fa-search-plus'
        preview.setAttribute('aria-hidden', true)
        preview.addEventListener('click', this.viewImage)
        mask.appendChild(preview)

        if (!this.disabled) {
          del.className = 'fa fa-trash'
          del.setAttribute('aria-hidden', true)
          del.addEventListener('click', this.deleteImage)
          mask.appendChild(del)
        }
        mask.className = 'image-cropper-mask'
        mask.style.width = e.target.width + 'px'
        mask.addEventListener('mouseout', this.destroyMask)
        e.target.parentElement.appendChild(mask)
      },
      getAction () {
        return (this.axios.defaults.baseURL || '') + '/api/vendor:oss/files'
      },
      uploadImg (blob) {
        let formData = new window.FormData()
        formData.append('files', blob, 'cropper.' + blob.type.split('/').pop())
        this.$.ajax(this.getAction(), {
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          headers: {
            'Authorization': 'Bearer' + this.$auth.token()
          },
          success: (body) => {
            this.mFile = body.data.content[0]
            this.$nextTick(() => {
              this.$('.image-cropper').cropper('destroy')
              this.$('.image-cropper').removeClass('image-cropper-rect')
              this.setImage(this.fileToUri(this.mFile))
            })
          },
          error: function (e) {
            console.error(e)
          }
        })
      },
      fileToUri (file) {
        if (!file) {
          return file
        }
        if (/^http/.test(file)) {
          return file
        } else {
          let middleFix = this.$store.state.oss_host.lastIndexOf('/') === this.$store.state.oss_host.length - 1 ? '' : '/'
          return this.$store.state.oss_host + middleFix + file
        }
      },
      getCropper (e) {
        let currImg = e.currentTarget.parentNode.parentNode.firstElementChild.firstElementChild
        let canvas = this.$(currImg).cropper('getCroppedCanvas')
        canvas.toBlob((blob) => {
          this.uploadImg(blob)
        })
      },
      reopen () {
        this.showCropper = false
        this.$('.image-cropper').cropper('destroy')
      },
      onloadend (e) {
        this.$refs['image-cropper'].src = e.target.result
        this.$(this.currentImage).cropper({
          aspectRatio: this.ratio,
          crop: function (e) {
            // Output the result data for cropping image.
          }
        })
      },
      setImage (url) {
        if (/^https?/.test(url) || /^data:image\//.test(url)) {
          this.showCropper = true
          this.$nextTick(() => {
            this.$refs['image-cropper'].src = url
          })
        }
      },
      onchange (e) {
        this.showCropper = true
        let imageCropper = e.currentTarget.parentNode.parentNode.previousElementSibling.firstElementChild
        this.currentImg = imageCropper
        this.$nextTick(() => {
          this.$(this.currentImg).addClass('image-cropper-rect')
          this.$nextTick(() => {
            this.fileReader.onloadend = this.onloadend
            this.fileReader.readAsDataURL(e.target.files[0])
          })
        })
      }
    },
    created () {
      // 加载jquery和cropper
      VueScript2.load('https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js').then(() => {
        let $ = window.$
        this.$ = $
        VueScript2.load('https://cdn.bootcss.com/cropper/3.1.3/cropper.min.js').then(() => {})
      })
    },
    components: [VueScript2],
    watch: {
      url (val) {
        this.mFile = val
        this.setImage(this.fileToUri(val))
      },
      currentImg (val) {
        this.currentImage = val
      }
    }
  }
</script>
