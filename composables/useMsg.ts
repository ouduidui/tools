import {
  ElMessage,
} from 'element-plus'

const useMsg = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  ElMessage({
    showClose: true,
    message: msg,
    type,
    center: true,
  })
}

export default useMsg
