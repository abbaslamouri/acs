const useCart = () => {
  // const { errorMsg, message } = useAppState()
  const config = useRuntimeConfig()
  const cart = useState('cart', () => {
    return {}
  })

  const updateLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart.value))
    }
  }

  const addItem = (item, quantity) => {
    // console.log('CCCCC', cart.value)
    if (isNaN(quantity) || quantity === null) return
    const cartItem = {
      product: { ...item },
      quantity: quantity * 1,
      // product: item._id,
      // productType: item.productType,
      // name: item.name,
      // slug: item.slug,
      // categories: item.categories,
      // quantity: quantity * 1,
      // thumb: item.gallery[0],
    }
    // if (item.productType === 'simple') {
    //   cartItem.price = item.price
    //   cartItem.salePrice = item.salePrice
    // }

    if (!cart.value.items || !cart.value.items.length) {
      cart.value.items = []
      cart.value.items.push(cartItem)
      // cart.value.shippingAddress = {}
      // cart.value.customer = {}
    } else {
      const index = cart.value.items.findIndex((p) => p.product.id == item.id)
      if (index !== -1) {
        if (quantity) cart.value.items[index].quantity = quantity * 1
        else cart.value.items.splice(index, 1)
        // cart.value.items[index].quantity = cart.value.items[index].quantity + quantity
      } else {
        cart.value.items.push(cartItem)
      }
    }
    cart.value.total = cartTotal()
    updateLocalStorage()
  }

  const removeItem = (cartItem) => {
    const index = cart.value.items.findIndex((item) => item.product.id == cartItem.product.id)
    if (index !== -1) cart.value.items.splice(index, 1)
    cart.value.total = cartTotal()
    updateLocalStorage()
  }

  // const updateItemQuantity = (item, quantity) => {
  //   // console.log(item, quantity)
  //   if (isNaN(quantity) || quantity === null) return
  //   const index = cart.value.items.findIndex((p) => p.product == item.product)
  //   if (index !== -1) {
  //     if (quantity === 0) cart.value.items.splice(index, 1)
  //     else cart.value.items[index].quantity = quantity * 1
  //     updateLocalStorage()
  //   }
  // }

  // const storeCartCustomer = (customer = {}) => {
  //   cart.value.customer = customer
  //   updateLocalStorage()
  // }

  // const updateCustomerEmail = (email = {}) => {
  //   cart.value.email = email
  //   updateLocalStorage()
  // }

  // const updateShippinAddress = (address = {}) => {
  //   cart.value.shippingAddress = address
  //   updateLocalStorage()
  // }

  const numberOfItems = () => {
    return cart.value.items && cart.value.items.length
      ? cart.value.items.reduce((accumulator, item) => accumulator + item.quantity, 0)
      : 0
  }

  const cartTotal = () => {
    return cart.value.items.reduce((accumulator, item) => accumulator + item.product.price * item.quantity * 1, 0)
  }

  const fetchPublishableKey = async () => {
    errorMsg.value = ''
    message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/publishableKey`)
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // return data.value.publishableKey
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  const fetchClientSecret = async (orderId) => {
    errorMsg.value = ''
    message.value = ''
    try {
      // const { data, pending, error } = await useFetch(`${config.API_URL}/orders/secret`, {
      //   method: 'POST',
      //   body: { orderId },
      // })
      // if (error.value) throw error.value
      // if (data.value && data.value.status === 'fail') {
      //   if (process.client) errorMsg.value = data.value.message
      //   return false
      // }
      // console.log('PI', data.value)
      // return data.value.clientSecret
    } catch (err) {
      if (process.client) {
        console.log('MYERROR', err)
        errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
      }
      return false
    }
  }

  return {
    cart,
    addItem,
    removeItem,
    numberOfItems,
    // updateItemQuantity,
    // storeCartCustomer,
    // updateShippinAddress,
    // updateCustomerEmail,
    cartTotal,
    fetchPublishableKey,
    fetchClientSecret,
    updateLocalStorage,
  }
}

export default useCart
