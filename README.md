<h1 align="center">💬 <strong>Chatify</strong> - Full-Stack Real-Time Chat Application</h1>
<p align="left">
<strong>A modern, full-stack chat application built with the MERN stack and Socket.io, designed for seamless, real-time communication.</strong>
</p>

Chatify is a feature-rich, real-time messaging application. It provides a secure and intuitive platform for users to sign up, connect with others, and engage in instant, one-on-one conversations with live online status indicators.

✨ Key Features
🔒 Secure Authentication: Robust user authentication and authorization system using JSON Web Tokens (JWT) and password hashing with bcrypt.

⚡ Real-Time Messaging: Instantaneous message delivery powered by Socket.io, allowing for seamless, bi-directional communication without needing to refresh the page.

🟢 Online User Status: See which users are currently online in real-time, providing an engaging and dynamic user experience.

😊 Emoji & Name Change Support: Enhance conversations with a built-in emoji picker and allow users to update their display names.

⚛️ Efficient State Management: A highly responsive and predictable UI powered by Zustand for lightweight, global state management on the client-side.

🎨 Styled with TailwindCSS & DaisyUI: A beautiful and modern user interface built with the utility-first approach of TailwindCSS and the component library of DaisyUI.

🛡️ Robust Error Handling: Comprehensive error handling implemented on both the server and the client to ensure a smooth and reliable user experience.

🛠️ How It Works: The Tech Stack
Chatify is built with a classic client-server architecture, perfect for a real-time application.

<details>
<summary><strong>Click to expand the technical workflow</strong></summary>

Backend (Node.js, Express, MongoDB):

An Express.js server provides a RESTful API for user authentication (signup/login/logout).

User data is stored securely in a MongoDB database, with passwords hashed using bcrypt.

A Socket.io server is integrated with the Express server to handle all real-time events.

Frontend (React, Zustand, TailwindCSS):

The client is a single-page application built with React.

Upon login, the client receives a JWT, which is stored and sent with subsequent API requests for authorization.

Zustand is used to manage global state, such as the authenticated user, selected conversations, and messages.

Real-Time Communication (Socket.io):

Once logged in, the client establishes a persistent WebSocket connection to the Socket.io server.

The server tracks connected users and broadcasts online status updates to all clients.

When a user sends a message, it is emitted to the server, which then instantly relays it to the correct recipient, who receives it without delay. The sender also gets an immediate UI update.

</details>

<p align="center">
Built with ❤️ by <strong>Sakshi</strong>

</p>
