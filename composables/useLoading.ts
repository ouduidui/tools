import { ElLoading } from 'element-plus'

/**
 *
 * @param text
 * @returns close function
 */
export const useLoading = (text = ''): () => void => {
  const loading = ElLoading.service({
    lock: true,
    text,
    background: 'rgba(0, 0, 0, 0.7)',
  })

  return () => loading.close()
}
