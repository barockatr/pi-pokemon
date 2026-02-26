import { useEffect, useRef, useCallback } from 'react';

/**
 * Módulo 3: Sistema de Audio (Inmersión Total)
 * Controlador de sonido no bloqueante para BGM (Fondo) y SFX (Efectos)
 */
export const useGameAudio = () => {
    // Almacenamos instancias de Audio en refs para no causar re-renders
    const bgmRef = useRef(null);
    const sfxRefs = useRef({});

    // -- Sound URLs (Placeholders de inmersión, reemplazables por assets locales) --
    // Idealmente apuntarían a '/sounds/battle_theme.mp3' o importados de assets.
    // Usamos Data URIs muy cortos o URLs libres para evitar errores 404 abruptos en el demo.
    const SOUND_LIBRARY = {
        // Un loop suave (Placeholder: silenciado intencionalmente con data URI base64 vacío si no hay archivo
        // Cambiar por URL real para que suene: 'https://cdn.freesound.org/previews/256/256094_3263906-lq.mp3'
        BGM: 'https://cdn.freesound.org/previews/256/256094_3263906-lq.mp3',

        // Zarpazo / Punch: 'https://cdn.freesound.org/previews/195/195048_1029706-lq.mp3'
        ATTACK: 'https://cdn.freesound.org/previews/195/195048_1029706-lq.mp3',

        // Explosión / Death: 'https://cdn.freesound.org/previews/477/477346_9628584-lq.mp3'
        EXPLOSION: 'https://cdn.freesound.org/previews/477/477346_9628584-lq.mp3'
    };

    useEffect(() => {
        // Inicializar BGM
        try {
            bgmRef.current = new Audio(SOUND_LIBRARY.BGM);
            bgmRef.current.loop = true;
            bgmRef.current.volume = 0.15; // Volumen inmersivo y suave
        } catch (e) {
            console.warn("No se pudo inicializar Audio API (BGM)", e);
        }

        return () => {
            // Limpieza al desmontar el componente (huir, salir del componente)
            if (bgmRef.current) {
                bgmRef.current.pause();
                bgmRef.current.currentTime = 0;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Funciones BGM
    const playBGM = useCallback(() => {
        if (bgmRef.current) {
            // El navegador puede bloquear el autoplay sin interacción, capturamos el error silenciosamente
            bgmRef.current.play().catch(e => console.log("BGM bloqueado por política del navegador (requiere click previo)"));
        }
    }, []);

    const stopBGM = useCallback(() => {
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current.currentTime = 0;
        }
    }, []);

    // Función SFX
    const playSFX = useCallback((type) => {
        try {
            const soundUrl = SOUND_LIBRARY[type];
            if (!soundUrl) return;

            // Creamos un nuevo objeto Audio en demanda para permitir solapamiento (ej: múltiples golpes rápidos)
            const sfx = new Audio(soundUrl);
            sfx.volume = type === 'EXPLOSION' ? 0.6 : 0.4;
            sfx.play().catch(e => console.log(`SFX ${type} silencioso`));
        } catch (error) {
            console.warn(`Error al reproducir SFX ${type}:`, error);
        }
    }, [SOUND_LIBRARY]);

    return {
        playBGM,
        stopBGM,
        playSFX
    };
};
