import { state } from "../state";
import { Router } from "@vaadin/router";

export class InitForm extends HTMLElement {
  connectedCallback() {
    this.render();
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
            <input class="my-input" type="email" name="email">
            <div>
                <label>Tu nombre</label>
             </div>
             <input class="my-input" type="text" name="nombre">

             <div>
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
    const form = this.querySelector(".my-form");

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as any;
      const email = target.email.value;
      const name = target.nombre.value;

      state.setEmailAndFullName(email, name);
      await state.signIn();
      Router.go("/select-options");
    });
  }
}

customElements.define("init-page", InitForm);
