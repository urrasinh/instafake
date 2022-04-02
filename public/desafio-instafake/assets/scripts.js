$('#js-form').submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value
    const JWT = await postData(email, password)
    const posts = await getFotos(JWT)
    //fillCard(posts, 'js-table-posts')
    toggleFormAndTable('js-form-wrapper', 'js-table-wrapper')
    //console.log(posts)
})

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json()
        localStorage.setItem('jwt-token', token) // persistir jws
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

const getFotos = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/photos',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        // return data
        if (data) {
            fillCard(data, 'js-table-posts')
            toggleFormAndTable('js-form-wrapper', 'js-table-wrapper')
        }

    } catch (err) {
        console.error(`Error: ${err}`)
    }
}
const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        const posts = await getFotos(token)
        fillCard(posts, 'js-table-posts')
        toggleFormAndTable('js-form-wrapper', 'js-table-wrapper')
    }
}
init()