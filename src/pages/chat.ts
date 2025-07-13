import { Router } from "@vaadin/router";
import { state } from "../state";
import { rtdb } from "../rtdb";
import { ref, onValue } from "firebase/database";

export class Chat extends HTMLElement {
  connectedCallback() {
    const user = JSON.parse(sessionStorage.getItem("chatuser"));
    if (user) {
      state.setState(user);
    }
    if (!user?.idChat) {
      alert("No estás en ninguna sala. Creá una o pedí una válida.");
      Router.go("/");
    }
    this.render();
  }

  render() {
    const currenState = state.getState();
    this.innerHTML = `
        <div class="chat">
            <div class="contenedor-titulo">
                <h1 class="titulo">Chat</h1>

            </div>
            <div class="contenedor-titulo">
                <h3>Id Room: ${currenState.idRoom}</h3>
            </div>

            <form class="my-form">
              <div class="contenedor-chat">

              </div>
              <input class="my-input" type="text" name="chat">
              <button>Enviar</button>
            </form>
        </div>

        <style>


     body {
        width:100%;
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color:white;
        overflow-y: auto; 
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 10px; 
        box-shadow: 0 2px 10px rgba(246, 171, 22, 0.1); /* Sombra sutil */
      }
        
      .chat{
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
      }

      h1,h3{
        color:rgb(230, 231, 231);
      }
      input {
        width: 100%;
        height: 35px;
        border-radius: 8px;
        margin-top: 10px;
        border: 2px solid #ccc; 
        font-size: 14px; 
        outline: none; 
        transition: border-color 0.3s, box-shadow 0.3s; 
      }

      input:focus {
        border-color:rgb(86, 255, 235);
        box-shadow: 0 0 0 4px rgba(0, 121, 107, 0.2);
      }

      button {
        background-color: #00ffa4;
        color: #000;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.3s ease;
        width: 100%;
        margin-bottom: 1rem;
        margin-top:10px;
      }
        .contenedor-chat{
            overflow-y:scroll;
            height:300px;
            background-color:rgb(255, 255, 255);
        }
        </style>
    `;
    const containerChat = this.querySelector(
      ".contenedor-chat"
    ) as HTMLDivElement;
    const currentState = state.getState();

    const chatRooms = ref(rtdb, "/chatRooms/" + currenState.idChat);
    onValue(chatRooms, (snapshot) => {
      if (snapshot.exists()) {
        containerChat.innerHTML = ""; // limpia antes

        const data = snapshot.val();
        for (const key in data) {
          const message = data[key];
          if (message.from && message.mensaje) {
            const div = document.createElement("div");
            if (message.from !== currentState.nombre) {
              div.style.backgroundColor = "#f5b642";
            } else {
              div.style.backgroundColor = "#42f58a";
            }
            div.innerHTML = `
                   <p class="nombre">${message.from}</p>
                   <div class="mensaje">${message.mensaje}</div>
                <style>
                    .nombre{
                      font-size: 25px;
                      font-family: 'Segoe UI', sans-serif;
                      color:#393e4a;
                    }
                    .mensaje{
                      font-size: 18px;
                      font-family: 'Segoe UI', sans-serif;
                   }
                 </style>
                `;
            containerChat.appendChild(div);
            containerChat.scrollTop = containerChat.scrollHeight;
          }
        }
      }
    });

    const myForm = this.querySelector(".my-form");
    myForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const mensajeNuevo = target.chat.value;
      state.pushMessage(mensajeNuevo);
      target.chat.value = "";
    });
  }
}

customElements.define("chat-page", Chat);
