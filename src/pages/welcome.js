"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWelcome = void 0;
const router_1 = require("@vaadin/router");
const state_1 = require("../state");
class initWelcome extends HTMLElement {
    connectedCallback() {
        this.registro();
        const formRegistro = this.querySelector(".registro-form");
        const userForm = this.querySelector(".user-form");
        formRegistro?.addEventListener("submit", () => {
            this.render();
            const formRender = this.querySelector(".my-form");
            formRender?.addEventListener("submit", (e) => {
                e.preventDefault();
                const target = e.target;
                console.log("valor del email", target.email.value);
                console.log("valor del nombre", target.nombre.value);
                const email = target.email.value;
                const name = target.nombre.value;
                state_1.state.setEmailAndFullName(name, email);
                state_1.state.signUp();
                router_1.Router.go("/signIn");
            });
        });
        userForm?.addEventListener("submit", () => {
            router_1.Router.go("/signIn");
        });
    }
    registro() {
        this.innerHTML = `
    <h1>Registro</h1>   
    <form class="registro-form">
      <button class="my-button">Registrarse</button>
    </form>
    <form class="user-form">
     <button class="my-button">Ya tengo un usuario</button>
    </form>
    `;
    }
    render() {
        this.innerHTML = `
    <h1>Registro</h1>   
    <form class="my-form">
        <div>
             <label>Email</label>
        </div>
        <input type="text" name="email">
        <div>
            <label>Nombre</label>
        </div>
        <input type="text" name="nombre">
        <div>
        <button class="my-button">Registrarse</button>
        </div>
    </form>
`;
    }
}
exports.initWelcome = initWelcome;
customElements.define("init-welcome", initWelcome);
