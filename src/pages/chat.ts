import { state } from "../state";

type Mensajes = {
  from: string;
  mensaje: string;
};

export class Chat extends HTMLElement {
  connectedCallback() {
    //Una vez que este conectado al dom, cada vez que haya un cambio en el state ejecuta esto
    state.suscribe(() => {
      const currenState = state.getState();
      this.arrayMensajes = currenState.messages;
      // console.log("mensajes connectedCallback", currenState.messages);
      this.render();
    });
    this.render();

    ///
    ///
  }
  sendMessage() {
    const currenState = state.getState();
    console.log("dato del state rtdbRoom", currenState.rtdbRoomId);
    const myForm = this.querySelector(".my-form");
    myForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      console.log("Datos del input chat", target.chat.value);
      state.pushMessage(target.chat.value);
      target.chat.value = "";
    });
  }
  arrayMensajes: Mensajes[] = [];

  render() {
    console.log("array de mensajes", this.arrayMensajes);
    const currenState = state.getState();
    this.innerHTML = `
        <div>
            <div class="contenedor-titulo">
                <h1 class="titulo">Chat</h1>

            </div>
            <div class="contenedor-titulo">
                <h3>Id Room: ${currenState.idRoom}</h3>
            </div>

            <form class="my-form">
              <div class="contenedor-chat">
              ${this.arrayMensajes
                .map((m) => {
                  if (m.from !== undefined) {
                    const divUserContenedor = document.createElement("div");
                    const RecepContenedor = document.createElement("div");
                    //Div contenido del mensaje
                    const divMessage = document.createElement("div");
                    //agregando clases a los contenedores
                    divUserContenedor.classList.add("contenedor-mensajes");
                    RecepContenedor.classList.add("contenedor-recibed");
                    //
                    if (m.from === currenState.nombre) {
                      divMessage.classList.add("contenedor-me");
                      divMessage.innerHTML = `
                      <div>
                         ${m.from}:${m.mensaje}
                      </div>
                      `;
                      divUserContenedor.appendChild(divMessage);
                      return divUserContenedor.outerHTML;
                      ///
                    } else {
                      divMessage.classList.add("contenedor-recep");
                      divMessage.innerHTML = `
                      <div>
                         ${m.from}:${m.mensaje}
                     </div>
                      `;
                      RecepContenedor.appendChild(divMessage);
                      return RecepContenedor.outerHTML;
                    } //obtiene el fragmento HTML serializado que describe el elemento incluyendo sus descendientes
                  } else {
                    return "";
                  }
                })
                .join("")}
              </div>
              <input class="my-input" type="text" name="chat">
              <button>Enviar</button>
            </form>
        </div>

        <style>
        .contenedor-chat{
            border: solid 3px black;
            overflow-y:scroll;
            height:300px;
        }

        .contenedor-recep{
          display:inline-block;
          margin: 10px 0; /* Espaciado entre los mensajes */
          padding: 5px; /* Espaciado interno de los mensajes */
          background-color: #D8D8D8; /* Color de fondo de los mensajes */
          border: 1px solid #cccccc; /* Borde de los mensajes */
          border-radius: 5px; /* Bordes redondeados */
        }

        .contenedor-me{
          display:inline-block;
          margin-left:90%;
          
          padding: 5px; /* Espaciado interno de los mensajes */
          background-color: #B9E97C; /* Color de fondo de los mensajes */
          border: 1px solid #cccccc; /* Borde de los mensajes */
          border-radius: 5px; /* Bordes redondeados */
        }

        </style>
    `;
    this.sendMessage();
  }
}

customElements.define("chat-page", Chat);
