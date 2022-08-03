let page = document.querySelector('.page')
let container = document.querySelector('.contenedor')
let submit = document.querySelector('#submit')
let shop_counter = document.querySelector('#shop-counter')
let scroll_to_top = document.querySelector('#scroll_top')
let nav_logo = document.querySelector('#logo')
let nav = document.querySelector('#nav')
let shop_logo = document.querySelector('#shop-a')
let shop_container = document.querySelector('.shop-container')

const get_data = async function(){

        let response = await fetch ("https://apipetshop.herokuapp.com/api/articulos")
        let data = await response.json()

	let objects = data.response

	
	return objects
}

const objects = await get_data()

const Toast = Swal.mixin({
	toast: true,
	position: 'center-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	width:'21rem',

	didOpen: (toast) => {
	toast.addEventListener('mouseenter', Swal.stopTimer)
	toast.addEventListener('mouseleave', Swal.resumeTimer)
}
})

// TOOLTIP
var tooltipTriggerList = [].slice.call(document.querySelectorAll('.tt'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


const show_warning_form = function(){
	let forms = document.getElementsByClassName('check-len')
	let array_forms = [...forms]
	let check_numbers = ['1', '2', '3', '4', '5', '6', '7', '8','9', '0']

	let flag = true

	array_forms.forEach((evento) => {
		if (evento.value == '' || evento.value.length < 2){
			flag = false
		}

		if (evento.type == 'text' && check_numbers.includes(evento.value[0])){
			flag=false
		}
	})


	if (!flag){
		Toast.fire({
			icon: 'error',
			title: `Faltan datos por completar o hay datos incorrectos`
		})

		return
	}

	Toast.fire({
		icon: 'success',
		title: `Formulario enviado`
	  })
}

let local_length = []

const show_local_storage = function(){

	let favorites = JSON.parse(localStorage.getItem('favoritos')) || []

	if (favorites.length != 0){
		local_length = favorites
	} else{
		local_length = []
	}
	shop_counter.innerHTML = local_length.length 
}

show_local_storage()

const add = function(event, check_quantities){
	let favorites = JSON.parse(localStorage.getItem('favoritos')) || []
	let quantity = document.getElementById(event).value
	let object_flag = true

	favorites.forEach((object) => {
		if (object[0] == event){
			object_flag = false
		}
	})

	if (!object_flag){
		return
	}

	if (quantity > check_quantities){
		Toast.fire({
			icon: 'error',
			title:  `No puedes agregar mas de ${check_quantities} unidades`
		  })

		return
	}

	let data = [event, quantity]

	favorites.push(data)

	localStorage.setItem('favoritos', JSON.stringify(favorites))

	Toast.fire({
		icon: 'success',
		title: `Articulo agregado ( ${quantity} unidades )`
	  })

	show_local_storage()
	display_shop()
}

const remove = function(event){

	let favorites = JSON.parse(localStorage.getItem('favoritos')) || []

	let quantity = document.getElementById(event).value

	favorites.forEach((object) => {
		if (object[0] == event){
			Toast.fire({
				icon: 'error',
				title:  `Articulo/s eliminado/s`
			  })
		}
	})

	let favorites_decrease = favorites.filter(product_id => product_id[0] != event)

	localStorage.setItem('favoritos', JSON.stringify(favorites_decrease))

	show_local_storage()
	display_shop()
}

window.add = add
window.remove = remove

const display_shop = function(){
	let favorites = JSON.parse(localStorage.getItem('favoritos')) || []
	let inner_html = String()

	let total = Number()

	favorites.map((favorite) => {
		objects.map((event) => {
			if (favorite[0] == event._id){
				inner_html += `
				<div class="carritoletra d-flex flex-column justify-content-center custom-border-bottom">

				<p class=''> <span class='fw-bold mb-0'>- PRODUCTO:</span> ${event.nombre} </p>
				<p><span class='fw-bold mb-0'>- CANTIDAD:</span> ${favorite[1]}</p>
				<p><span class='fw-bold mn-0'>- PRECIO:</span> $ ${event.precio}</p>
				</div>
				`
				total += (event.precio * favorite[1])
			}
		})
	})

	inner_html += `
	<p class='carritototal fw-bold p-2'>TOTAL A PAGAR: $ ${total}</p>
	<div class="divcarritocontenedor p-2">
	<button id='pressbutton' class="carritobutton">
  <span class="shadow"></span>
  <span class="edge"></span>
  <span class="front text fw-bold"> PAGAR
  </span>
</button>
</div>
	`

	shop_container.innerHTML = inner_html


}

display_shop()

const display_data = function(){
        let inner_html = String()

	for (let i=0; i<objects.length; i++){
		if(page.id == 'farmacia'){
			if(objects[i].tipo == 'Medicamento'){
				if(objects[i].stock < 5){
					inner_html += `
					<div class="cartas">
					<img src="${objects[i].imagen}">
						<div class="info">
						    <h3 class='fs-5'>${objects[i].nombre}</h3>
						    <p class='fw-bold text-info fs-4'>${objects[i].precio}$</p>
						    <p class="fw-bold">Cantidad: <input value='1' min='1' type="number" id="${objects[i]._id}"></p>
						    <p class="text-danger fw-bold">Ultima/s ${objects[i].stock} unidad/es</p>
						    <button onClick="add('${objects[i]._id}', ${objects[i].stock})">Agregar al carrito</button>

						    <button class='bg-danger' onClick="remove('${objects[i]._id}')">Eliminar</button>
						</div>
					</div>
					`

					continue
				}
				inner_html += `
				<div class="cartas">
				<img src="${objects[i].imagen}">
					<div class="info">
					    <h3 class='fs-5'>${objects[i].nombre}</h3>
					    <p class='fw-bold text-info fs-4'>${objects[i].precio}$</p>
					    <p class="fw-bold">Cantidad: <input value='1' min='1' type="number" id="${objects[i]._id}"></p>
					    <button onClick="add('${objects[i]._id}')">Agregar al carrito</button>

					    <button class='bg-danger' onClick="remove('${objects[i]._id}')">Eliminar</button>
					</div>
				</div>
				`

			}
		}
		if(page.id == 'juguetes'){
			if(objects[i].tipo == 'Juguete'){
				if(objects[i].stock < 5){
					inner_html += `
					<div class="cartas">
					<img src="${objects[i].imagen}">
						<div class="info">
						    <h3 class='fs-5'>${objects[i].nombre}</h3>
						    <p class='fw-bold text-info fs-4'>${objects[i].precio}$</p>
						    <p class="fw-bold">Cantidad: <input value='1' min='1' type="number" id="${objects[i]._id}"></p>
						    <p class="text-danger fw-bold">Ultima/s ${objects[i].stock} unidad/es</p>
						    <button onclick="add('${objects[i]._id}', ${objects[i].stock})">Agregar al carrito</button>

						    <button class='bg-danger' onClick="remove('${objects[i]._id}')">Eliminar</button>
						</div>
					</div>
					`

					continue
				}

				inner_html += `
				<div class="cartas">
				<img src="${objects[i].imagen}">
					<div class="info">
					    <h3 class='fs-5'>${objects[i].nombre}</h3>
					    <p class='fw-bold text-info fs-4'>${objects[i].precio} $</p>
					    <p class="fw-bold">Cantidad: <input value='1' type="number" min='1' id="${objects[i]._id}"></p>
					    <button onclick="add('${objects[i]._id}')">Agregar al carrito</button>

					    <button class='bg-danger' onClick="remove('${objects[i]._id}')">Eliminar</button>
					</div>
				</div>

				`

			}
		}
	}

	container.innerHTML = inner_html
}

if (page.id != 'contacto' && page.id != 'home' && page.id != 'proximamente' && page.id!='shop'){
	display_data()
}

if (page.id == 'contacto'){
	submit.addEventListener('click', show_warning_form)
}

// proximamente - countdown 

if (page.id == 'proximamente'){
	let contadorDate = new Date('Apr 1, 2023 00:00:00').getTime();
	function contadorDown(){
	    let now = new Date().getTime()
	    let gap = '' 
	    gap = contadorDate - now

	    let segundos = 1000
	    let minutos = segundos * 60
	    let horas = minutos * 60
	    let dia = horas * 24

	    let d = Math.floor(gap / (dia))
	    let h = Math.floor((gap % (dia))/(horas))
	    let m = Math.floor((gap % (horas))/(minutos))
	    let s = Math.floor((gap % (minutos))/(segundos))

	    document.getElementById('dias').innerText = d
	    document.getElementById('horas').innerText = h
	    document.getElementById('minutos').innerText = m
	    document.getElementById('segundos').innerText = s
	}
	setInterval( function(){
	contadorDown()
	},1000)
}

nav_logo.addEventListener('click', () => { 
    nav.classList.toggle('activo')
})

shop_logo.addEventListener('click', () => {
	shop_container.classList.toggle('shop_active')
})

window.addEventListener('scroll', () => {
	if (document.documentElement.scrollTop <= 500){
		scroll_to_top.style.right = '-100vw'
	} else{
		scroll_to_top.style.right = '3vw'
	}
})


let carritoButton= document.getElementById('pressbutton')

carritoButton.addEventListener('click',()=> {Swal.fire({
	title: 'Muchas gracias por tu compra!',
	text: 'Pronto tendremos listo tu pedido.',
	
})})
