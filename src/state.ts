const API_BASE_URL = import.meta.env.VITE_URL;
import { rtdb } from "./rtdb";
import { ref, onValue, push } from "firebase/database";

const state = {
  data: {
    email: "",
    nombre: "",
    password: "",
    userId: "",
    token: "",
    idRoom: "",
    idChat: "",
    messages: [],
  },

  listeners: [], //array de funciones

  getState() {
    return this.data;
  },

  setEmailAndFullName(email: string, name: string, password: string) {
    const currenState = this.getState();
    currenState.email = email;
    currenState.nombre = name;
    currenState.password = password;
    this.setState(currenState);
  },

  async signUp() {
    const currentState = this.getState();
    if (currentState.email && currentState.nombre && currentState.password) {
      const resp = await fetch(API_BASE_URL + "/users", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          name: currentState.nombre,
          password: currentState.password,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        alert(data.message || "No se pudo registrar el usuario");
        return;
      } else {
        currentState.userId = data.userId;
        this.setState(currentState);
        sessionStorage.setItem("chatuser", JSON.stringify(currentState));
      }
    } else {
      alert("No dejes campos sin completar");
    }
  },

  async signIn() {
    const currentState = this.getState();
    if (currentState.email && currentState.password) {
      const resp = await fetch(API_BASE_URL + "/users/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          password: currentState.password,
        }),
      });
      const data = await resp.json();
      if (!data.success) {
        alert("No hay un usuario registrado con ese email");
      } else {
        currentState.token = data.token;
        if (currentState.token) {
          const getUser = await fetch(API_BASE_URL + "/users", {
            headers: {
              Authorization: `bearer ${currentState.token}`,
            },
          });
          const user = await getUser.json();
          currentState.userId = user.data._id;
          currentState.nombre = user.data.name;
          this.setState(currentState);
          sessionStorage.setItem("chatuser", JSON.stringify(currentState));
        } else {
          alert("Ocurrio un error al obtener data del user");
        }
      }
    } else {
      alert("No hay un email");
    }
  },

  async generateNewRoom() {
    const currentState = this.getState();
    if (currentState.userId) {
      const resp = await fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      });
      const data = await resp.json();
      currentState.idRoom = data.id;
      this.setState(currentState);
      sessionStorage.setItem("chatuser", JSON.stringify(currentState));
    } else {
      alert("No hay user id por favor inicia sesion");
    }
  },

  async getToRoom() {
    const currentState = this.getState();
    const idRoom = currentState.idRoom;
    await fetch(
      API_BASE_URL + "/rooms/" + idRoom + "?userId=" + currentState.userId
    )
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        currentState.idChat = data.idSala;
        this.setState(currentState);
        sessionStorage.setItem("chatuser", JSON.stringify(currentState));
      });
  },

  pushMessage(mensaje: string) {
    const currentState = this.getState();
    if (currentState.idChat) {
      const chatRoomRef = ref(rtdb, "/chatRooms/" + currentState.idChat);
      push(chatRoomRef, {
        from: currentState.nombre,
        mensaje,
      });
    }
  },

  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
    console.log("Todos las funciones dentro de listeners", this.listeners);
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
  },
};

export { state };
