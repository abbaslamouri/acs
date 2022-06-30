let uuid = 0

const useUniqueId = () => {
	const getId = () => {
		uuid++
		return uuid
	}

	return { getId }
}

export default useUniqueId
