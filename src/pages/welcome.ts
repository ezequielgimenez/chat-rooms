import { Router } from "@vaadin/router";
import { state } from "../state";
import { create } from "domain";

export class initWelcome extends HTMLElement {
  connectedCallback() {
    const user = JSON.parse(sessionStorage.getItem("chatuser"));
    if (user?.userId) {
      Router.go("/select-options");
    }
    this.registro();
    const formRegistro = this.querySelector(
      ".registro-form"
    ) as HTMLFormElement;
    const userForm = this.querySelector(".user-form") as HTMLFormElement;

    formRegistro?.addEventListener("submit", () => {
      this.render();
    });

    userForm?.addEventListener("submit", () => {
      Router.go("/signIn");
    });
  }
  registro() {
    this.innerHTML = `
    <h1>Bievenido</h1>   
    
    <form class="registro-form">
      <button class="my-button">Registrarse</button>
    </form>

    <form class="user-form">
     <button class="my-button secondary">Ya tengo un usuario</button>
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

      .welcome-container {
        background-color: #1e1e1e;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 0 20px rgba(0, 255, 164, 0.2);
        text-align: center;
        width: 100%;
        max-width: 400px;
      }

      h1 {
        font-size: 4rem;
        margin-bottom: 2rem;
        color: #00ffa4;
        text-align:center;
      }

      .my-button {
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
      }

      .my-button:hover {
        background-color: #00c68a;
      }

      .my-button.secondary {
        background-color: transparent;
        color: #00ffa4;
        border: 2px solid #00ffa4;
      }
    </style>

    `;
  }
  render() {
    this.innerHTML = `
    <h1>Registrarse</h1>   
    <form class="my-form">
        <div>
             <label>Email</label>
        </div>
        <input type="text" name="email">
        <div>
            <label>Nombre</label>
        </div>
        <input type="text" name="nombre">
        <div class="contenedor-button">
        <button class="my-button">Registrarse</button>
        </div>

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
      input{
        width:100%;
        height:35px;
        border-radius:8px;
        margin-top:10px;
      }
    
        </style>
    </form>
`;
    const formRender = this.querySelector(".my-form") as HTMLFormElement;
    const contenedorButton = this.querySelector(
      ".contenedor-button"
    ) as HTMLDivElement;
    formRender?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const target = e.target as any;
      const email = target.email.value;
      const name = target.nombre.value;
      state.setEmailAndFullName(email, name);
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
      await state.signUp();

      Router.go("/signIn");
    });
  }
}

customElements.define("init-welcome", initWelcome);
