import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [socket, setSocket] = useState<Socket | null>(null);

	function handleEmitMessage(ip: string) {
		if (ip && socket) socket.emit("message", ip);
	}
	useEffect(() => {
		// console.log("Hello World");
		const newSocket = io("http://localhost:3005");
		newSocket.on("connect", () => {
			console.log("Connected to server");

			// socket.emit("message", "Hello, server!");
		});

		newSocket.on("message", (data) => {
			console.log("Received message:", data);
		});
		newSocket.on("broadcast", (data) => {
			console.log("Received broadcast message:", data);
		});
		setSocket(newSocket);

		// Don't forget to clean up the socket connection
		return () => {
			socket?.disconnect();
		};
	}, []);
	return (
		<main
			className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
		>
			<h1 className="text-4xl font-bold text-center">Test App</h1>
			<div className="flex flex-col items-center justify-center">
				<input
					id="mymessage"
					className="border-2 text-black border-gray-500 rounded-lg p-2"
					type="text"
					placeholder="Enter Message"
				/>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() =>
						handleEmitMessage(
							(
								document.getElementById(
									"mymessage"
								) as HTMLInputElement
							)?.value || ""
						)
					}
				>
					Send Message
				</button>
			</div>
		</main>
	);
}
