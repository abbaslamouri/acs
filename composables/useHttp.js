const useHttp = () => {
  const config = useRuntimeConfig()
  const { errorMsg, message } = useAppState()
  const { token } = useAuth()

  const getErrorStr = (errors) => {
    console.log('MYERROR', errors)
    let errorStr = ''
    for (const prop in errors) {
      errorStr = `${errorStr}<li>${errors[prop].message}</li>`
    }
    return `<ul>${errorStr}</ul>`
  }

  const fetchAll = async (resource, params = {}) => {
    errorMsg.value = null
    message.value = null
    try {
      const esc = encodeURIComponent
      const query = Object.keys(params)
        .map((k) => esc(k) + '=' + esc(params[k]))
        .join('&')
      const response = await fetch(`${config.apiUrl}/${resource}?${query}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      // console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return { docs: [], count: 0, totalCount: 0 }
    }
  }

  const fetchDoc = async (resource, id) => {
    errorMsg.value = null
    message.value = null
    try {
      const response = await fetch(`${config.apiUrl}/${resource}/${id}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      // console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }

    // errorMsg.value = null
    // message.value = null
    // // const token =
    // //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    // //     ? useCookie('auth').value.token
    // //     : null
    // try {
    //   const { data, pending, error } = await useFetch(`${config.API_Url}/${resource}/${id}`, {
    //     headers: { Authorization: `Bearer ${token.value}` },
    //   })
    //   // console.log(data.value)
    //   if (error.value) throw error.value
    //   if (data.value && data.value.status === 'fail') {
    //     // console.log('DATAT', data.value.message)
    //     if (process.client) errorMsg.value = data.value.message
    //     // return { docs: [], totalCount: 0 }
    //     return false
    //   }
    //   return data.value.doc
    // } catch (err) {
    //   if (process.client) {
    //     console.log('MYERROR', err)
    //     errorMsg.value = err.data && err.data.message ? err.data.message : err.message ? err.message : ''
    //     // return { docs: [], totalCount: 0 }
    //     return false
    //   }
    // }
  }

  const saveDoc = async (resource, payload) => {
    errorMsg.value = null
    message.value = null
    let response = null
    try {
      if (payload.id) {
        response = await fetch(`${config.apiUrl}/${resource}/${payload.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          }),
        })
      } else {
        response = await fetch(`${config.apiUrl}/${resource}`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          }),
        })
      }
      // console.log(response)
      if (response.ok) {
        const jsonRes = await response.json()
        return jsonRes.doc ? jsonRes.doc : {}
      }
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const deleteDoc = async (resource, id) => {
    errorMsg.value = ''
    message.value = ''
    let response
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/${resource}/${id}`, {
        method: 'DELETE',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token && token.value ? token.value : ''}`,
        }),
      })

      // console.log(response)
      if (response.ok) return true
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      console.log(errorMsg.value)
      return false
    }
  }

  const deleteDocs = async (resource, payload) => {
    errorMsg.value = null
    message.value = null
    let response = null
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/${resource}/delete-many`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })

      // console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const saveMedia = async (payload) => {
    console.log('here')
    errorMsg.value = null
    message.value = null
    let response = null
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/media`, {
        method: 'POST',
        body: payload,
        headers: new Headers({
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const seedProducts = async (payload) => {
    console.log('here')
    errorMsg.value = null
    message.value = null
    let response = null
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/products/seeder`, {
        method: 'POST',
        body: payload,
        headers: new Headers({
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const seedCountries = async (payload) => {
    console.log('here')
    errorMsg.value = null
    message.value = null
    let response = null
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/countries/seeder`, {
        method: 'POST',
        body: payload,
        headers: new Headers({
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const seedStates = async (payload) => {
    console.log('here')
    errorMsg.value = null
    message.value = null
    let response = null
    // const token =
    //   useCookie('auth') && useCookie('auth').value && useCookie('auth').value.token
    //     ? useCookie('auth').value.token
    //     : null
    try {
      response = await fetch(`${config.apiUrl}/states/seeder`, {
        method: 'POST',
        body: payload,
        headers: new Headers({
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      console.log(response)
      if (response.ok) return await response.json()
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  const saveOrder = async (payload) => {
    errorMsg.value = null
    message.value = null
    let response = null
    try {
      response = await fetch(`${config.apiUrl}/orders`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        }),
      })
      // }
      // console.log(response)
      if (response.ok) {
        const jsonRes = await response.json()
        return jsonRes.doc ? jsonRes.doc : {}
      }
      if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
      throw getErrorStr((await response.json()).errors)
    } catch (err) {
      console.log('MYERROR', err)
      errorMsg.value = err
      return false
    }
  }

  // const productsSearchAll = async (params = {}) => {
  // 	errorMsg.value = null
  // 	message.value = null
  // 	try {
  // 		const esc = encodeURIComponent
  // 		const query = Object.keys(params)
  // 			.map((k) => esc(k) + '=' + esc(params[k]))
  // 			.join('&')
  // 		const response = await fetch(`${config.apiUrl}/products/searchAll?${query}`, {
  // 			method: 'GET',
  // 			headers: new Headers({
  // 				'Content-Type': 'application/json',
  // 				Authorization: `Bearer ${token.value}`,
  // 			}),
  // 		})
  // 		// console.log(response)
  // 		if (response.ok) return await response.json()
  // 		if (!response.headers.get('content-type')?.includes('application/json')) throw 'Something went terribly wrong'
  // 		throw getErrorStr((await response.json()).errors)
  // 	} catch (err) {
  // 		console.log('MYERROR', err)
  // 		errorMsg.value = err
  // 		return { docs: [], count: 0, totalCount: 0 }
  // 	}
  // }

  return {
    fetchAll,
    fetchDoc,
    saveDoc,
    deleteDoc,
    deleteDocs,
    saveMedia,
    seedProducts,
    seedCountries,
    seedStates,
    saveOrder,
  }
}

export default useHttp
