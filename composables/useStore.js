const useStore = () => {
  const product = useState('product', () => {
    return { gallery: [], categories: [], attributes: [], variants: [] }
  })

  return { product }
}

export default useStore
