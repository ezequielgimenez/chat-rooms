import { state } from "../state";
import { Router } from "@vaadin/router";

export class InitForm extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = this.querySelector(".my-form");
    const selectOptions = this.querySelector(".opciones") as HTMLSelectElement;
    const divDisplay = this.querySelector(".div-display") as HTMLElement;
    const campo = this.querySelector(".campo") as HTMLInputElement;

    selectOptions?.addEventListener("change", () => {
      const valueSelect = selectOptions.value;
      if (valueSelect === "opcion2") {
        divDisplay.style.display = "block";
        campo.disabled = false;
        campo.value = "";
      } else {
        divDisplay.style.display = "none";
        campo.value = "";
        campo.disabled = true;
      }
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const email = target.email.value;
      const name = target.nombre.value;
      const valueSelect = selectOptions.value;

      state.setEmailAndFullName(email, name);
      state.signIn(() => {
        const currenState = state.getState();
        console.log("user Id", currenState.userId);
        if (valueSelect === "opcion2" && currenState.userId) {
          const currenState = state.getState();
          const valueInput = campo.value;
          currenState.idRoom = valueInput;
          state.setState(currenState);
          // console.log("Nuevo id room es", currenState.idRoom);
          if (currenState.idRoom) {
            state.getToRoom();
            // const nuevoState = state.getState();
            // console.log("rtdbRoomId", nuevoState.rtdbRoomId);
            // console.log("idroom", nuevoState.idRoom);
            // console.log("messages", nuevoState.messages);
            Router.go("/chat");
          }
          //chat.ts ======> getToRoom() que nos dara el idRTDB para sincronizarnos a "rooms/" + idRTDB donde estaran todos los messages
        } else if (currenState.userId) {
          state.generateNewRoom(() => {
            const currenState = state.getState();
            console.log("nuevo room con el idRoom", currenState.idRoom);
            console.log("userID del room", currenState.userId);

            state.getToRoom();
            const nuevoState = state.getState();

            console.log("rtdbRoomId", nuevoState.rtdbRoomId);

            state.setState(nuevoState);
            Router.go("/chat");
          });
          // chat.ts ======> generateNewRoom() que nos dara un idRoom para el chat que estara vacio
        }
      });
    });
  }
  render() {
    this.innerHTML = `
        <div class="div-titulo">
            <h1 class="titulo">Bienvenidos</h1>
            <h2>Login</h2>

        </div>
        <form class="my-form">
            <div>
                <label>Email</label>
            </div>
            <input class="my-input" type="text" name="email">
            <div>
                <label>Tu nombre</label>
             </div>
             <input class="my-input" type="text" name="nombre">

             <div>
                <select class="opciones">
                    <option value="opcion0">[Elije una opcion]</option>
                    <option value="opcion1">1-Nuevo Room</option>
                    <option value="opcion2">2-Room existente</option>
                </select>
             </div>

             <div class="div-display" style="display:none;">
                <div>
                    <label>Room id</label>
                </div>
                <input type="text" class="campo">
             </div>

             <div>
                <button class="my-button">Comenzar</button>
             </div>
        </form>

        <style>
            .div-titulo{
                width:271px;
            }
            .titulo{
                font-size:52px;
            }
            .my-input{
                width:312px;
                height:40px;
            }
            .my-button{
                background-color:#9CBBE9;
                border:none;
                width:320px;
                height:55px;
                margin-top:10px;
            }
        </style>

    `;
  }
}

customElements.define("init-page", InitForm);
