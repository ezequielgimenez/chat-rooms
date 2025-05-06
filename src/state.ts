const API_BASE_URL = "https://chat-rooms-ds0i.onrender.com";
import { rtdb } from "./rtdb";
import { ref, onValue, push } from "firebase/database";

const state = {
  data: {
    email: "",
    nombre: "",
    userId: "",
    idRoom: "",
    idChat: "",
    messages: [],
  },

  listeners: [], //array de funciones

  listenRoom() {
    const currenState = this.getState();
    const chatRoomRef = ref(rtdb, "/chatRooms/" + currenState.idChat);
    if (currenState.idChat) {
      onValue(chatRoomRef, (snapshot) => {
        const data = snapshot.val();

        for (const key in data) {
          const messagesFromServer = data[key];
          currenState.messages.push(messagesFromServer);
          this.setState(currenState);
        }
      });
    }
  },

  getState() {
    return this.data;
  },

  setEmailAndFullName(email: string, name: string) {
    const currenState = this.getState();
    currenState.email = email;
    currenState.nombre = name;
    this.setState(currenState);
  },

  async signUp() {
    const currentState = this.getState();
    if (currentState.email && currentState.nombre) {
      const resp = await fetch(API_BASE_URL + "/signup", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          nombre: currentState.nombre,
        }),
      });
      const data = await resp.json();
      currentState.userId = data.id;
      this.setState(currentState);
      sessionStorage.setItem("chatuser", JSON.stringify(currentState));
      if (!resp.ok || !data.success) {
        alert(data.message || "No se pudo registrar el usuario");
        return;
      }
    } else {
      alert(
        "No hay un email y un nombre, por favor registrese o inicie sesión"
      );
    }
  },

  async signIn() {
    const currentState = this.getState();
    if (currentState.email) {
      const resp = await fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
        }),
      });
      const data = await resp.json();
      currentState.userId = data.id;
      this.setState(currentState);
      sessionStorage.setItem("chatuser", JSON.stringify(currentState));
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
        currentState.idChat = data.id;
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
    console.log("Soy el state y he cambiado", this.data);
  },
};

export { state };
