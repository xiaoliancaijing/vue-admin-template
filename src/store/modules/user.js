import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
	return {
		token: '',
		name: '',
		avatar: '',
	}
}

const state = getDefaultState()

const mutations = {
	RESET_STATE: state => {
		Object.assign(state, getDefaultState())
	},
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
}

const actions = {
	// user login
	login({ commit }, userInfo) {
		const { phone, passWord } = userInfo
		return new Promise((resolve, reject) => {
			login({ phone, passWord })
				.then(response => {
					const { data } = response
					console.log(data)
					commit('SET_TOKEN', data.token)
					commit('SET_NAME', data.admin.name)
					commit('SET_AVATAR', data.admin.avatar)
					setToken(data.token)
					sessionStorage.setItem('token', data.token)
					sessionStorage.setItem('role_router', JSON.stringify(data.permissionCodeSet))
					resolve()
				})
				.catch(error => {
					reject(error)
				})
		})
	},

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then(response => {
					const { data } = response

					if (!data) {
						reject('Verification failed, please Login again.')
					}

					const { name, avatar } = data.admin

					commit('SET_NAME', name)
					commit('SET_AVATAR', avatar)
					resolve(data)
				})
				.catch(error => {
					reject(error)
				})
		})
	},

	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			// logout(state.token)
			// 	.then(() => {
			removeToken() // must remove  token  first
			resetRouter()
			commit('RESET_STATE')
			resolve()
			// })
			// .catch(error => {
			// 	reject(error)
			// })
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			removeToken() // must remove  token  first
			commit('RESET_STATE')
			resolve()
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
