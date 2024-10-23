import { useEffect } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
    useEffect(() => {
        const socket = io('http://localhost:3000'); // Endereço do servidor do instrutor

        // Função para iniciar o compartilhamento de tela
        const startScreenShare = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false // Você pode habilitar áudio se desejar
                });
                const videoElement = document.getElementById('screen');
                videoElement.srcObject = stream;

                // Enviar a stream para o servidor do instrutor
                socket.emit('stream', stream);
            } catch (error) {
                console.error('Erro ao iniciar o compartilhamento de tela:', error);
            }
        };

        // Iniciar compartilhamento ao montar o componente
        startScreenShare();

        // Limpar ao desmontar o componente
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Aplicação do Aluno</h1>
            <video id="screen" autoPlay style={{ width: '100%' }}></video>
        </div>
    );
};

export default Home;
