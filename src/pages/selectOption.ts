import { state } from "../state";
import { Router } from "@vaadin/router";

export class SelectPage extends HTMLElement {
  connectedCallback() {
    const user = JSON.parse(sessionStorage.getItem("chatuser"));
    if (!user?.userId) {
      alert("No estas logueado, por favor inicia sesión");
      Router.go("/");
    } else {
      state.setState(user);
    }
    this.render();
  }
  render() {
    const currentState = state.getState();
    this.innerHTML = `
        <div class="div-titulo">
            <h1 class="titulo">Hola ${currentState.nombre}!</h1>

            <h2>Elegí crear una nueva sala o ir a una sala existente!</h2>

        </div>
        <form class="my-form">
             <div>
                <select class="opciones">
                    <p>Elije una opción</p>
                    <option value="opcion1">Nuevo Room</option>
                    <option value="opcion2">Room existente</option>
                </select>
             </div>

             <div class="div-display" style="display:none;">
                <div>
                    <label>Room id</label>
                    <input type="text" name="campo" class="campo">
                </div>
             </div>

             <div class="contenedor-button">
                <button class="my-button">Comenzar</button>
             </div>
        </form>

        <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #121212;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
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

          .my-form{
            width:355px;
          }
          .opciones{
            width: 100%;
            font-family: 'Poppins', sans-serif;
            padding: 10px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 8px;
            background-color: #fff;
            margin: 10px 0;
          }
          input{
            width:100%;
            height:35px;
            border-radius:8px;
            margin-top:10px;
          }
        </style>

    `;
    const currenState = state.getState();
    const form = this.querySelector(".my-form");
    const selectOptions = this.querySelector(".opciones") as HTMLSelectElement;
    const divDisplay = this.querySelector(".div-display") as HTMLElement;
    const campo = this.querySelector(".campo") as HTMLInputElement;

    selectOptions?.addEventListener("change", () => {
      const valueSelect = selectOptions.value;
      if (valueSelect === "opcion2") {
        divDisplay.style.display = "block";
      } else {
        divDisplay.style.display = "none";
      }
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as any;

      const contenedorButton = this.querySelector(
        ".contenedor-button"
      ) as HTMLDivElement;

      const div = document.createElement("div") as HTMLDivElement;
      div.style.margin = "10px 0";
      div.innerHTML = `
          <p>Cargando..</p>
          <style>
            p{
              font-size:15px;
              text-align:center;
            }
          </style>
        `;
      contenedorButton.appendChild(div);

      const valueSelect = selectOptions.value;
      const inputIdRoom = target.campo.value;
      if (valueSelect === "opcion1" && currenState.userId) {
        console.log("opcion 1 crear");

        await state.generateNewRoom();

        await state.getToRoom();

        Router.go("/chat");
      }
      if (valueSelect === "opcion2" && currenState.userId) {
        currenState.idRoom = inputIdRoom;

        state.setState(currenState);
        if (currenState.idRoom) {
          await state.getToRoom();
          Router.go("/chat");
        }
      }
    });
  }
}

customElements.define("select-page", SelectPage);
