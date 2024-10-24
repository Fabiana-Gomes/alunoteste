import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
    const [isSharing, setIsSharing] = useState(false); // Estado para controlar o status do compartilhamento
    const [errorMessage, setErrorMessage] = useState(null); // Estado para exibir mensagens de erro

    useEffect(() => {
        const socket = io('http://localhost:3000'); // Endereço do servidor do instrutor

        // Limpar ao desmontar o componente
        return () => {
            socket.disconnect();
        };
    }, []);

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
            const socket = io('http://localhost:3000');
            socket.emit('stream', stream);
            setIsSharing(true); // Atualiza o status para "compartilhando"
        } catch (error) {
            console.error('Erro ao iniciar o compartilhamento de tela:', error);
            setErrorMessage('Erro ao compartilhar a tela. Verifique as permissões.');
        }
    };

    // Função para parar o compartilhamento de tela
    const stopScreenShare = () => {
        const videoElement = document.getElementById('screen');
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();

        // Parar todas as faixas (tracks) de mídia
        tracks.forEach(track => track.stop());
        setIsSharing(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Compartilhamento Aluno</h1>

            {errorMessage && <p style={styles.error}>{errorMessage}</p>}

            <div style={styles.controls}>
                {!isSharing ? (
                    <button style={styles.button} onClick={startScreenShare}>
                        Iniciar Compartilhamento de Tela
                    </button>
                ) : (
                    <button style={styles.button} onClick={stopScreenShare}>
                        Parar Compartilhamento de Tela
                    </button>
                )}
            </div>

            <div style={styles.videoContainer}>
                <video id="screen" autoPlay style={styles.video}></video>
            </div>
        </div>
    );
};

// Estilos aplicados para UX design aprimorado
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8', // Fundo mais claro e suave
        padding: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px', // Fonte maior para o título
        marginBottom: '20px',
        color: '#222', // Tom mais escuro para contraste
    },
    videoContainer: {
        width: '640px', // Aumentado para proporcionar mais conforto na exibição
        height: '360px', // Proporção 16:9, maior mas ainda compacto
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        marginTop: '30px',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // Preenchimento adequado do vídeo
        borderRadius: '12px',
    },
    controls: {
        marginTop: '20px',
    },
    button: {
        padding: '12px 30px', // Botão mais espaçoso
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#4CAF50', // Cor verde suave e moderna
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        marginBottom: '20px', // Espaço entre o botão e o vídeo
    },
    buttonHover: {
        backgroundColor: '#45a049', // Cor mais escura ao hover
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    },
};

export default Home;
