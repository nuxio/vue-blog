// textarea 相关操作

/**
 * 获取光标位置
 * @param {*} input 
 */
const getCursorPosition = (input) => {
    let postion = 0;
    if (document.selection) {
        // ie 
        input.focus();
        let selectRange = document.selection.createRange();
        selectRange.moveStart('character', -input.value.length);
        postion = selectRange.text.length;
    } else if (input.selectionStart || input.selectionStart == '0') {
        postion = input.selectionStart;
    }
    return postion;
};

/**
 * 设置光标位置
 * @param {*} input 
 * @param {*} pos 
 */
const setCursorPosition = (input, pos) => {
    if (input.setSelectionRange) {
        // ie
        input.focus();
        input.setSelectionRange(pos, pos);
    } else if (input.createTextRange) {
        let range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};

/**
 * 获取选中的文本
 */
const getSelectText = () => {
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection) {
        // ie
        text = document.selection.createRange();
    }
    return text;
};

/**
 * 选中文本
 * @param {*} input 
 * @param {*} start 
 * @param {*} end 
 */
const selectText = (input, start = 0, end) => {
    var start = parseInt(start),
        textLength = input.value.length
        end = end ? parseInt(end) : textLength;
    if (textLength) {
        if (start > textLength) {
            start = textLength;
        }
        if (end > textLength) {
            end = textLength;
        }
        if (start < 0) {
            start = textLength + start;
        }
        if (end < 0) {
            end = textLength + end;
        }
        if (input.createTextRange) {
            // ie
            let range = input.createTextRange();
            range.moveStart("character", -textLength);
            range.moveEnd("character", -textLength);
            range.moveStart("character", start);
            range.moveEnd("character", end);
            range.select();
        } else {
            input.setSelectionRange(start, end);
            input.focus();
        }
    }
};

/**
 * 在光标后插入文本
 * @param {*} input 
 * @param {*} value 
 */
const insertAfterCursor = (input, value) => {
    let selectRange = null;
    if (document.selection) {
        // ie
        input.focus();
        selectRange = document.selection.createRange();
        selectRange.text = value;
        input.focus();
    } else if (input.selectionStart || input.selectionStart == '0') {
        let start = input.selectionStart;
        let end = input.selectionEnd;
        let scrollTop = input.scrollTop;
        input.value = input.value.substring(0, start) + value + input.value.substring(end, input.value.length);
        input.focus();
        input.selectionStart = start + value.length;
        input.selectionEnd = start + value.length;
        input.scrollTop = scrollTop;
    } else {
        input.value += value;
        input.focus();
    }
}


export default {
    insertAfterCursor,
    selectText,
    getSelectText,
    setCursorPosition,
    getCursorPosition
};