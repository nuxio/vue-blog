<template>
<div>
    <div class="drag-target text-center" 
            @dragenter="handleDragEnter" 
            @dragleave="handleDragLeave"
            @dragend="handleDragEnd"
            @dragover="handleDragOver"
            @drop.prevent="handleDrop" 
            :style="{'border-color': dragenter ? '#FF6537' : 'gray'}"
            v-if="!show_cropper_modal"
        >
        Upload
    </div>
    <canvas ref="preview_canvas" height="100" width="100" v-else></canvas>
    <div class="modal-wrap" v-show="show_cropper_modal">
        <div class="modal-backdrop"></div>
        <div class="cropper-modal">
            <div class="cropper-container" @mousemove="drag" @mouseleave="endDrag" :style="container_style">
                <button type="button" @click="closeCropperModal" class="cropper-modal-close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                <img class="cropper-image" :style="cropper_image_style" :src="src" ref="origin_image" />
                <div class="cropper-image-modal"></div>
                <div class="cropper-crop-wrap" :style="crop_style">
                    <div class="croper-crop-image" @mousedown.prevent="startDragCrop">
                        <img :src="src" :style="crop_image_style" />
                    </div>
                    <span class="cropper-crop-ctrl-point" data-pos="wn" @mousedown="startResizeCrop('wn', $event)"></span>
                    <span class="cropper-crop-ctrl-point" data-pos="en" @mousedown="startResizeCrop('en', $event)"></span>
                    <span class="cropper-crop-ctrl-point" data-pos="es" @mousedown="startResizeCrop('es', $event)"></span>
                    <span class="cropper-crop-ctrl-point" data-pos="ws" @mousedown="startResizeCrop('ws', $event)"></span>
                </div>
                <div class="cropper-op-bar">
                    <span @click="doCropAndPreview"><i class="fa fa-check" aria-hidden="true"></i></span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

// 裁剪框的最小高度，图片小于这个尺寸则默认覆盖整张图片
const CROP_INIT_WIDTH = 100;
const CROP_INIT_HEIGHT = 100;

export default {
    data() {
        return {
            // 距离上次move事件的毫秒数
            last_call: 0,
            // 至少过这么多毫秒才再次调用，节流
            throttle: 50,
            dragenter: false,
            preview_src: '',
            src: '',
            image: {
                height: 0,
                width: 0,
                top: 0,
                left: 0
            },
            // 剪裁框的初始宽高和位置
            crop: {
                height: 100,
                width: 100,
                top: 0,
                left: 0,
                // 被鼠标点击的时候，左上角与鼠标点击位置的距离
                mouse_x: 0,
                mouse_y: 0
            },
            show_cropper_modal: false,
            // 鼠标是否在剪裁区域点下并且没有松开
            crop_mouse_down: false,
            // 鼠标是否在剪裁区域控制点上点下并且没有松开
            crop_ctrl_pos: ''
        };
    },
    computed: {
        container_style() {
            return {
                height: this.image.height + 'px',
                width: this.image.width + 'px'
            }
        },
        cropper_image_style() {
            return {
                height: this.image.height + 'px',
                width: this.image.width + 'px',
                top: this.image.top + 'px',
                left: this.image.left + 'px'
            };
        },
        crop_style() {
            return {
                height: this.crop.height + 'px',
                width: this.crop.width + 'px',
                top: this.crop.top + 'px',
                left: this.crop.left + 'px'
            };
        },
        crop_image_style() {
            return {
                height: this.image.height + 'px',
                width: this.image.width + 'px',
                top: (this.image.top - this.crop.top) + 'px',
                left: (this.image.left - this.crop.left) + 'px'
            };
        }
    },
    methods: {
        handleDragEnter() {
            this.dragenter = true;
        },
        handleDragOver(e) {
            e.preventDefault();
        },
        handleDragLeave(e) {
            this.dragenter = false;
        },
        handleDragEnd (e) {
            this.dragenter = false;
        },
        handleDrop(e) {
            this.dragenter = false;
            let file = e.dataTransfer.files[0];
            let name = file.name;
            if(!name.match(/.*\.(jpg|png|gif|jpeg)$/)) {
                this.$toast.error('请选择图片');
                return false;
            }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.preview_src = this.src = e.target.result;
                this.$refs.origin_image.onload = () => {
                    let nh = this.$refs.origin_image.naturalHeight;
                    let nw = this.$refs.origin_image.naturalWidth;

                    this.image.height = nh;
                    this.image.width = nw;
                    this.crop.width = nh < CROP_INIT_HEIGHT ? nh : CROP_INIT_HEIGHT;
                    this.crop.height = nw < CROP_INIT_WIDTH ? nw : CROP_INIT_WIDTH;
                    this.crop.top = nh < CROP_INIT_HEIGHT ? 0 : ((nh - CROP_INIT_HEIGHT) / 2);
                    this.crop.left = nw < CROP_INIT_WIDTH ? 0 : ((nw - CROP_INIT_WIDTH) / 2);

                    this.doCropAndPreview();
                };
                this.show_cropper_modal = true;
            };
        },
        closeCropperModal() {
            this.show_cropper_modal = false;
        },
        startDragCrop(e) {
            this.crop_mouse_down = true;
            // 因为触发mousedown的srcElement是img标签，所以鼠标相对于crop的位置应该用img标签的位置来计算
            this.crop.mouse_x =  e.offsetX + (this.image.left - this.crop.left);
            this.crop.mouse_y = e.offsetY + (this.image.top - this.crop.top);
        },
        endDrag() {
            this.crop_mouse_down = false;
            this.crop_ctrl_pos = '';
        },
        drag(e) {
            if(!this.crop_mouse_down && !this.crop_ctrl_pos) return false;

            let now = new Date().getTime();
            if(now - this.last_call < this.throttle) return false;
            this.last_call = now;

            if(this.crop_mouse_down) {
                let move_y = e.offsetY - this.crop.mouse_y;
                let move_x = e.offsetX - this.crop.mouse_x;
                let max_y = this.image.height - this.crop.height;
                let max_x = this.image.width - this.crop.width;

                this.crop.top = move_y < 0 ? 0 : (move_y > max_y ? max_y :move_y);
                this.crop.left = move_x < 0 ? 0 : (move_x > max_x ? max_x :move_x);
                this.doCropAndPreview();
            }
            if(this.crop_ctrl_pos) {
                let move_y = e.offsetY - this.crop.top;
                let move_x = e.offsetX - this.crop.left;
                let max = Math.max(move_x, move_y);
                max = max < 0 ? 0 : max;
                this.crop.width = this.crop.height = max;

                if(this.crop_ctrl_pos === 'es') {
                    this.doCropAndPreview();
                }
                if(this.crop_ctrl_pos === 'en') {
                    this.crop.top = e.offsetY;
                    this.doCropAndPreview();
                }
            }
        },
        // 鼠标点中边框的控制按钮，接下来可能会设置剪裁区域的大小
        startResizeCrop(pos, e) {
            e.preventDefault();
            this.crop_ctrl_pos = pos;
        },
        doCropAndPreview() {
            let ctx = this.$refs.preview_canvas.getContext('2d');
            ctx.clearRect(0, 0, 100, 100);
            // ctx.drawImage(source, source_x, scource_y, source_width, source_height, dest_x, dest_y, dest_width, dest_height)
            ctx.drawImage(this.$refs.origin_image, this.crop.left, this.crop.top, this.crop.width, this.crop.height, 0, 0, 100, 100);
        }
    },
    mounted() {
        document.body.addEventListener('mouseup', () => {
            this.endDrag();
        });
    }
}
</script>

<style>
.drag-target {
    border: 4px dashed gray;
    background-color: #fff;
    border-radius: 10px;
}
.drag-target {
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    line-height: 100px;
}
.cropper-modal {
    z-index: 300;
    position: absolute;
    height: 100%;
    width: 100%;
}
.cropper-container {
    height: 350px;
    width: 350px;
    margin: 50px auto;
    position: relative;
    border: 1px dashed #ccc;
    background-image: url('../assets/img/cropper_background.png')
}
.cropper-modal-close {
    position: absolute;
    top: 0px;
    right: -25px;
    color: #fff;
    border: 0;
    padding: 0;
    background-color: #000;
    border-radius: 50%;
    font-size: 14px;
    font-weight: bold;
    height: 20px;
    width: 20px;
    text-align: center;
    opacity: 0.7;
    cursor: pointer;
    z-index: 500;
}
.cropper-image, .cropper-image-modal, .cropper-crop-wrap, .croper-crop-image, .croper-crop-image>img, .cropper-crop-ctrl-point {
    position: absolute;
}
.cropper-image-modal {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.5;
}
.croper-crop-image {
    overflow: hidden;
    cursor: move;
    height: 100%;
    width: 100%;
    border: 1px solid #39f;
}
.cropper-crop-ctrl-point {
    display: block;
    width: 6px;
    height: 6px;
    opacity: .75;
    background-color: #39f;
}
.cropper-crop-ctrl-point[data-pos=wn] {
    top: -3px;
    left: -3px;
    cursor: nw-resize;
}
.cropper-crop-ctrl-point[data-pos=en] {
    top: -3px;
    right: -3px;
    cursor: ne-resize;
}
.cropper-crop-ctrl-point[data-pos=es] {
    right: -3px;
    bottom: -3px;
    cursor: se-resize;
}
.cropper-crop-ctrl-point[data-pos=ws] {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize;
}
.cropper-op-bar {
    position: absolute;
    bottom: -30px;
    left: 0px;
}
.cropper-op-bar >span {
    cursor: pointer;
    color: #39f;
}
</style>
