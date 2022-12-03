import axios from 'axios'

axios.interceptors.response.use((res) => res.data)

async function getRepoList() {
    return axios.get('https://api.github.com/orgs/j-cli-org/repos')
}

module.exports = {
    getRepoList,
}
