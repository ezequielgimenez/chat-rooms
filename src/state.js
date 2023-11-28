"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.state = void 0;
const API_BASE_URL = "https://chat-rooms-ds0i.onrender.com";
const rtdb_1 = require("./rtdb");
const map_1 = require("lodash/map");
const state = {
    data: {
        email: "",
        nombre: "",
        userId: "",
        idRoom: "",
        rtdbRoomId: "",
        messages: [],
    },
    listeners: [], //array de funciones
    init() {
        // const chatRoomsRef = rtdb.ref("/chatRooms/general/chatPage");
        // const currenState = this.getState();
        // chatRoomsRef.on("value", (snapshot) => {
        //   const messagesFromServer = snapshot.val();
        //   console.log(messagesFromServer);
        //   if (messagesFromServer) {
        //     const messageList = map(messagesFromServer);
        //     currenState.messages = messageList;
        //     this.setState(currenState);
        //   }
        // });
    },
    listenRoom() {
        const currenState = this.getState();
        const chatRoomRef = rtdb_1.rtdb.ref("/rooms/" + currenState.rtdbRoomId);
        chatRoomRef.on("value", (snapshot) => {
            const messagesFromServer = snapshot.val();
            if (messagesFromServer) {
                const listaDeMensajes = (0, map_1.default)(messagesFromServer);
                currenState.messages = listaDeMensajes;
                this.setState(currenState);
                console.log("listenRoom() current messages", currenState.messages);
            }
        });
    },
    getState() {
        return this.data;
        //Te devuelve la ultima version del estado
    },
    setEmailAndFullName(email, name) {
        const currenState = this.getState();
        currenState.email = email;
        currenState.nombre = name;
        this.setState(currenState);
    },
    signUp() {
        const currenState = this.getState();
        if (currenState.email) {
            fetch(API_BASE_URL + "/signup", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: currenState.email,
                    nombre: currenState.nombre,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                currenState.userId = data.id; /// Res User id
                this.setState(currenState);
            });
        }
        else {
            console.error("No hay un email en el state");
        }
    },
    signIn(callback) {
        const currenState = this.getState();
        if (currenState.email) {
            fetch(API_BASE_URL + "/signin", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    email: currenState.email,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                currenState.userId = data.id; /// Res User id
                this.setState(currenState);
                callback();
            });
        }
        else {
            console.error("No hay un email en el state");
        }
    },
    generateNewRoom(callback) {
        const currenState = this.getState();
        if (currenState.userId) {
            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: currenState.userId,
                }),
            })
                .then((resp) => {
                return resp.json();
            })
                .then((data) => {
                currenState.idRoom = data.id; /// Res RoomId
                if (callback) {
                    callback();
                }
            });
        }
        else {
            console.error("No hay userId");
        }
    },
    getToRoom(callback) {
        const currenState = this.getState();
        const idRoom = currenState.idRoom;
        fetch(API_BASE_URL + "/rooms/" + idRoom + "?userId=" + currenState.userId)
            .then((resp) => {
            return resp.json();
        })
            .then((data) => {
            console.log("rtdb id:", data.rtdbID);
            currenState.rtdbRoomId = data.rtdbID; /// Res rtbdID
            this.setState(currenState);
            this.listenRoom();
        });
        if (callback) {
            callback();
        }
    },
    pushMessage(message) {
        const currenState = this.getState();
        const nameDelState = this.data.nombre;
        fetch(API_BASE_URL + "/messages", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                from: nameDelState,
                mensaje: message,
                idRealTime: currenState.rtdbRoomId,
            }),
        });
    },
    suscribe(callback) {
        this.listeners.push(callback);
        console.log("Todos las funciones dentro de listeners", this.listeners);
        // te avisa cuando algun componente cambia el estado
    },
    setState(newState) {
        this.data = newState;
        for (const callback of this.listeners) {
            callback();
        }
        console.log("Soy el state y he cambiado", this.data);
    },
};
exports.state = state;
