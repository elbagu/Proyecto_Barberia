let pagina = 1;

const cita = {
    nombre = '',
    fecha = '',
    hora = '',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();
   
    mostrarSeccion();
   
    cambiarSeccion();

    paginaSiguente();

    paginaAnterior();

    botonesPaginacion();

    mostrarResumen();

    nombreCita();

    fechaCita();

    deshabilitarFechaAnterior();

    horaCita();
}

function mostrarSeccion(){

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    

    const seccionActual = document.querySelector("#paso-"+pagina);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior =  document.querySelector('.tabs .actual');
    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }

    const tab = document.querySelector('[data-paso="'+pagina+'"]');
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace =>{
        enlace.addEventListener('click',e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginacion();
        })
    })
}

async function mostrarServicios(){
    try {
        const url = "http://localhost:3000/servicios.php";
        

        const resultado = await fetch(url);
        const db = await resultado.json();
        //const {servicios} = db;
        //Generar HTML

        
        db .forEach(servicio => {
            const { id,nombre,precio} = servicio;

            // Dom Scripting
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = ('$ '+precio);
            precioServicio.classList.add('precio-servicio');

            // Generar los DIV

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio=id;

            //Seleccionar servicio

            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al div de servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error)
    }
}

function seleccionarServicio(e){

    let elemento;
    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }
    
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj)

        agregarServicio(servicioObj);
    }
}

function paginaSiguente(){
    const paginaSiguente = document.querySelector('#siguente');
    paginaSiguente.addEventListener('click', () =>{
        pagina++;
        botonesPaginacion();
    })
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () =>{
        pagina--;
        botonesPaginacion();
    })
}

function botonesPaginacion(){
    const paginaSiguente = document.querySelector('#siguente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    }else if(pagina === 3){
        paginaSiguente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguente.classList.remove('ocultar');
    }

    mostrarSeccion();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////resumem

function mostrarResumen(){
    const {nombre,fecha,hora,servicios} = cita;

    const resumenDiv = document.querySelector('.contenido-resumen');

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if (Object.values(cita).includes('')) {
       
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicio por completar';

        noServicios.classList.add('invalidar-cita');   

        resumenDiv.appendChild(noServicios);
        return;
    }

    const headCita = document.createElement('H3');
    headCita.textContent = 'Resumen de Cita';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML=`<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML=`<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML=`<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicio');

    const Heading = document.createElement('H3');
    Heading.textContent = 'Resumen de Servicios';

    servicioCita.appendChild(Heading);

    let cantidad = 0;
   // Iterar

   servicios.forEach(servicio =>{
       const{nombre, precio}=servicio;
       const contenedorServicio = document.createElement('DIV');
       contenedorServicio.classList.add('contenedor-servicio');

       const textoServicio = document.createElement('P');
       textoServicio.textContent = nombre;

       const precioServicio = document.createElement('P');
       precioServicio.textContent = precio;
       precioServicio.classList.add('precio');

       const totalServicio = precio.split('$');
       console.log(parseInt(totalServicio[1].trim()));

       cantidad += parseInt(totalServicio[1].trim());

       contenedorServicio.appendChild(textoServicio);
       contenedorServicio.appendChild(precioServicio);
       
       servicioCita.appendChild(contenedorServicio);
   });

    resumenDiv.appendChild(headCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(servicioCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.innerHTML = `<span>Total a pagar: </span> ${cantidad}`;
    cantidadPagar.classList.add('total');
    resumenDiv.appendChild(cantidadPagar);
}



function eliminarServicio(id){

    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita);

}

function agregarServicio(servicioObj){

    const {servicios} = cita;

    cita.servicios = [...servicios,servicioObj];
    console.log(cita);
}

function nombreCita(){
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        if(nombreTexto === '' || nombreTexto.length < 3){
            mostrarMensaje('El nombre no es valido','error');
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarMensaje(mensaje,tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }
    
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    setTimeout(() =>{
        alerta.remove();
    },3000)
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
       
        const dia = new Date(e.target.value).getUTCDay();

       if ([0, 6].includes(dia)) {
        e.preventDefault();
        fechaInput.value = '';
        mostrarMensaje('Fines de semana no disponibles', 'error');
       }else{
           cita.fecha = fechaInput.value;
       }
    })
    
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;

    const fechaDeshabilitar = `${dia}-0${mes}-${year}`;
    
    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {

    const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 9 || hora[0] > 19) {
           mostrarMensaje('Hora no disponible','error');
           setTimeout(()=>{
            horaInput.value = '';
           },3000);
           
        }else{
            cita.hora = horaCita;
            console.log(cita);
        }
    });
}