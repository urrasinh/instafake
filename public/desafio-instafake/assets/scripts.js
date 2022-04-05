(() => {  // inicio IIFE
    const formularioSelector = document.querySelector('#js-form')
    const feedUnicoSelector = document.querySelector('#mostrar-feed')
    const contenedorImagenesSelector = document.querySelector('#contenedor-imagenes')
    const logoutSelector = document.querySelector('#cerrar-sesion')
    const masImagenesSelector = document.querySelector('#cargar-mas-imagenes')
    let imagenFeed = ''
    let pageNum = 1

    formularioSelector.addEventListener('submit', async (event) => { 
        event.preventDefault()
        const email = document.querySelector('#correo-electronico').value
        const password = document.querySelector('#contrasena').value
        await postData(email, password)
        getFoto(pageNum)
        document.querySelector('#correo-electronico').value = ''
        document.querySelector('#contrasena').value = ''
    })

    const postData = async (email, password) => {
        try {
            const response = await fetch('http://localhost:3000/api/login',
                {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                })
            const { token } = await response.json()
            localStorage.setItem('jwt-token', token)            
            return token
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    const getFoto = async (numeroPagina) => { 
        const jwt = localStorage.getItem('jwt-token')
        try {
            const response = await fetch(`http://localhost:3000/api/photos?page=${numeroPagina}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            const { data } = await response.json()
            if (data) {
                contenedorImagenesSelector.setAttribute("style", "display: block")
                formularioSelector.setAttribute("style", "display: none")
                data.forEach((datos) => {
                    imagenFeed += `
                    <div class="card" id="tarjeta">
                        <img width="600" height="800" src="${datos.download_url}" class="card-img-top"/>
                        <div class="card-footer">
                            <span>${datos.author}</span>
                        </div>
                    </div>
                    `
                })
                feedUnicoSelector.innerHTML = imagenFeed
            }
        } catch (error) {
            console.log(error)
        }
    }
    //  de logout que elimine el JWT 
    logoutSelector.addEventListener('click', () => {
        localStorage.removeItem('jwt-token')
        localStorage.clear()
        feedUnicoSelector.innerHTML = ''
        contenedorImagenesSelector.setAttribute("style", "display: none")
        formularioSelector.setAttribute("style", "display: block")
    })     

    masImagenesSelector.addEventListener('click', () => {
        pageNum++
        getFoto(pageNum)
    }) 

    const iniciar = () => {
        const token = localStorage.getItem('jwt-token')
        if (token) {
            getFoto(pageNum)
        }
    }
    iniciar() // Cargar el feed de fotos cuando exista el JWT
    
})() // fin IIFE
