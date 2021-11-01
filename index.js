// Llamada a los elementos necesarios
const btn = document.getElementById('jugar')
const alerts = document.getElementById('alerts')
const bloque1 = document.getElementById('bloque1')
const bloque2 = document.getElementById('bloque2')
const bloque3 = document.getElementById('ganador')
const bloque4 = document.getElementById('leaderboard')
const leaderboard2 = document.getElementsByClassName('leader')[0]
const jugadorGanador = document.getElementById('jugadorGanador')

// Funcion bienvenida
const bienvenida = (nombre1, nombre2) => alerts.textContent = `Bienvenidxs ${nombre1} y ${nombre2}, diviertanse!`

// Si hay datos almacenados en el storage significa que ya completaron el form con sus nombres, entonces no lo muestro
if(sessionStorage.getItem('jugador2') == null){
    bloque1.style.display="block"
    bloque2.style.display="none"
}else{
    bienvenida(sessionStorage.getItem('jugador1'), sessionStorage.getItem('jugador2'));
}

// Pantalla de bienvenida al cargar la pagina
$(document).ready( () => {

    setTimeout( () => {
        $('.bienvenida').css({
            opacity: 0,
            visibility: "hidden"
        })
    }, 1000)
})

// Funcion de los botones de salida. Borran los datos del storage y recargan la pagina
function salirDelJuego(){
    sessionStorage.clear() 
    location.reload();
}

// Funcion para reiniciar el juego
function reiniciarJuego(){
    location.reload()
}

// Formulario donde los usuarios ponen sus nombres
let form = document.getElementById("form");
form.addEventListener("submit", validarFormulario);

function validarFormulario(e){
    e.preventDefault();
    let formulario = e.target
    sessionStorage.setItem('jugador1', formulario.children[0].value);
    sessionStorage.setItem('jugador2', formulario.children[1].value);
    bloque1.style.display="none"
    bloque2.style.display="block"
    bienvenida(sessionStorage.getItem('jugador1'), sessionStorage.getItem('jugador2'));
}

// Funcion para mostrar el leaderboard
function mostrarTop(jugadores){
    bloque2.style.display="none"
    bloque3.style.display="none"
    bloque4.style.display="block"

    // Para que si vuelven a llamar a esta funcion, se reinicie y no se acumulen los datos repetidos
    $('.tops').remove()
    
    // Contador para poner los puestos del top 
    let i = 10
    jugadores.forEach((jugador) => {
        // Como los datos vienen ordenados de menor a mayor pero yo los quiero de mayor a menor uso prepend
        $('#lista').prepend(`
            <tr class="tops">
                <td>${i}</td>
                <td>${jugador.nombre}</td>
                <td>${jugador.ganadas}</td>
            </tr>
            
        `)
        i -= 1
    })
}

// Puse top2 porque con la palabra top no funciona, supongo que sera una palabra reservada o algo
let top2 = []

const cargarTop = () => {
    // Recibe los datos del json y los ordena segun la cantidad de partidas ganadas de menor a mayor
    $.get('./leader.json', (res) => {
        top2 = res
        top2.sort(function (a,b) {
            return a.ganadas - b.ganadas
        })
    
        mostrarTop(top2)
    })
}

function leaderBoard(){
    cargarTop()
}

// Compara los valores del array de turnos, por ejemplo, si el nombre pablo esta en las posiciones 0, 1 y 2 del array, la funcion devuelve true, ya que ese jugador gano
const ganador = (turnos) => {
    if(turnos[0] == turnos[1] && turnos[1] == turnos[2] && turnos[0]){
        return true
    }else if(turnos[3] == turnos[4] && turnos[4] == turnos[5] && turnos[3]){
        return true
    }else if(turnos[6] == turnos[7] && turnos[7] == turnos[8] && turnos[6]){
        return true
    }else if(turnos[0] == turnos[3] && turnos[3] == turnos[6] && turnos[0]){
        return true
    }else if(turnos[1] == turnos[4] && turnos[4] == turnos[7] && turnos[1]){
        return true
    }else if(turnos[2] == turnos[5] && turnos[5] == turnos[8] && turnos[2]){
        return true
    }else if(turnos[0] == turnos[4] && turnos[4] == turnos[8] && turnos[0]){
        return true
    }else if(turnos[2] == turnos[4] && turnos[4] == turnos[6] && turnos[2]){
        return true
    }else{
        return false
    }
}

const anunciarGanador = (ganador) => {
    bloque2.style.display="none"
    bloque3.style.display="block"
    turnos = [];
    turno = -1
    jugadorGanador.textContent = `Felicidades, ${ganador}, ganaste!!!`
}

// Esta funcion se ejecuta cuando el contador de turnos llega a 8, osea que todas las casillas estan ocupadas
const anunciarEmpate = () => {
    bloque2.style.display="none"
    bloque3.style.display="block"
    turnos = [];
    turno = -1
    jugadorGanador.textContent = `Empate!!!`
}

// Funcion general del juego
btn.onclick = () => {
    btn.style.display = "none"
    leaderboard2.style.display = "none"

    // Aca almaceno el nombre del jugador que clickeo un casillero en la posicion correspondiente a ese casillero para despues comparar los valores
    let turnos = [];

    // Contador y organizador de turnos
    let turno = 0;
    
    // Esto da un numero entre 1 y 2 y segun eso empieza un jugador u otro
    const primerturno = Math.round(Math.random() * 2)

    if(primerturno == 1){
        alerts.textContent = `Turno de ${sessionStorage.getItem('jugador1')}`

        // Esta funcion recorre los casilleros del tablero y guarda la informacion necesaria del evento, para poder detectar que casillero clickeo el jugador
        document.querySelectorAll('div.casillero').forEach(
            (obj, i) => obj.addEventListener('click',(e) => jugada(i))
        )

        const jugada = (casillero) => {
            const casilleroUsado = document.getElementsByClassName('casillero')[casillero]
            const cruz = document.getElementsByClassName('fa-times')[casillero]
            const circulo = document.getElementsByClassName('fa-circle')[casillero]

            // Voy alternando los turnos segun si el contador es par o impar
            if(turno % 2 == 0){
                alerts.textContent = `Turno de ${sessionStorage.getItem('jugador2')}`
                cruz.style.display="block"
                turnos[casillero] = sessionStorage.getItem('jugador1')
                if(ganador(turnos)){
                    anunciarGanador(sessionStorage.getItem('jugador1'))
                }else if(turno == 8){
                    anunciarEmpate()
                }
            }else{
                alerts.textContent = `Turno de ${sessionStorage.getItem('jugador1')}`
                circulo.style.display="block"
                turnos[casillero] = sessionStorage.getItem('jugador2')
                if(ganador(turnos)){
                    anunciarGanador(sessionStorage.getItem('jugador2'))
                }else if(turno == 8){
                    anunciarEmpate()
                }
            }

            // Si un casillero esta marcado le saco los pinter events para que no se pueda volver a clickear
            casilleroUsado.style.pointerEvents = "none"
            turno ++
        }
    }else{
        alerts.textContent = `Turno de ${sessionStorage.getItem('jugador2')}`
        document.querySelectorAll('div.casillero').forEach(
            (obj, i) => obj.addEventListener('click',(e) => jugada(i))
        )
        const jugada = (casillero) => {
            const casilleroUsado = document.getElementsByClassName('casillero')[casillero]
            const cruz = document.getElementsByClassName('fa-times')[casillero]
            const circulo = document.getElementsByClassName('fa-circle')[casillero]
            if(turno % 2 !== 0){
                alerts.textContent = `Turno de ${sessionStorage.getItem('jugador2')}`
                cruz.style.display="block"
                turnos[casillero] = sessionStorage.getItem('jugador1')
                if(ganador(turnos)){
                    anunciarGanador(sessionStorage.getItem('jugador1'))
                }else if(turno == 8){
                    anunciarEmpate()
                }
            }else{
                alerts.textContent = `Turno de ${sessionStorage.getItem('jugador1')}`
                circulo.style.display="block"
                turnos[casillero] = sessionStorage.getItem('jugador2')
                if(ganador(turnos)){
                    anunciarGanador(sessionStorage.getItem('jugador2'))
                }else if(turno == 8){
                    anunciarEmpate()
                }
            }
            casilleroUsado.style.pointerEvents = "none"
            turno ++
        }
    }
}



