<template>
    <div class="drag-target text-center" 
        @dragenter="handleDragEnter" 
        @dragleave="handleDragLeave"
        @dragend="handleDragEnd"
        @dragover="handleDragOver"
        @drop.prevent="handleDrop" 
        :style="{'border-color': dragenter ? '#FF6537' : 'gray'}"
    >
        点击上传或者拖拽到此处
    </div>
</template>

<script>
export default {
    data() {
        return {
            dragenter: false
        };
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
            
        }
    }
}
</script>

<style>
.drag-target {
    border: 4px dashed gray;
    background-color: #fff;
    border-radius: 10px;
    width: 100%;
}
</style>
