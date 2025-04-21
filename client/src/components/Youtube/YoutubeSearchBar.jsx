import React, { useState, useEffect } from 'react';
import axios from 'axios';
import M from "materialize-css";

const YouTubeSearchBar = ({roomId, socket}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    // Clé d'API à utiliser pour pouvoir utiliser l'API de youtube
    const API_KEY = 'AIzaSyCXLJRGuMxDY3fnll0xeEE0qKKzzhvxLic';

    // Gestion de la recherche lors de la soumission du formulaire
    const handleSearch = async (e) => {
        e.preventDefault();     // Empêche la soumission automatique par défaut

        try {
            // Utilisation de axios car plus pratique que fetch()
            const response = await axios.get(
                'https://www.googleapis.com/youtube/v3/search',
                {
                    params: {
                        part: 'snippet',
                        q: query,           // Texte de la barre de recherche
                        key: API_KEY,       // Utilisation de la clé d'API déclarée plus haut
                        maxResults: 20,     // Maximum 20 Résulats renvoyés
                        type: 'video',
                    },
                }
            );

            setResults(response.data.items);
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        }
    };

    const handleSelectVideo = (videoId, roomId, socket) => {
        // Emission d'une requête au serveur pour indiquer qu'on souhaite changer de vidéo
        socket.emit("selectVideo", {videoId: videoId, roomId: roomId})
    }

    // Initialisation de la modal dans laquelle seront affichés les résultats
    useEffect(() => {
        const modalElems = document.querySelectorAll('.modal');
        M.Modal.init(modalElems);
    }, []);

    // Ouverture automatique de la modal quand les résultats sont mis à jour
    useEffect(() => {
        if (results.length > 0) {
            const modal = document.querySelector('.modal');
            const instance = M.Modal.getInstance(modal);
            instance.open();
        }
    }, [results]);

    return (
        <div className="container">
            <form onSubmit={handleSearch} className="center-align">
                <div className="row valign-wrapper">
                    <div className="input-field col s10">
                        <input
                            type="text"
                            placeholder="Rechercher sur YouTube..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="col s2">
                        <button className="btn green" type="submit" style={{ padding: '0 12px' }}>
                            🔍
                        </button>
                    </div>
                </div>
            </form>

            {/* Modal contenant les résulats */}
            <div id="searchResultsModal" className="modal">
                <div className="modal-content" >
                    <button id="closeResultsModal" className="modal-close btn-flat" >
                        ✖
                    </button>
                <h5>Résultats de la recherche</h5>
                    {results.length > 0 && (
                        <div>
                            {results.map((video) => (
                                <div
                                    key={video.id.videoId}
                                    onClick={() => handleSelectVideo(video.id.videoId, roomId, socket)}
                                    className="video-result modal-close">
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt="thumbnail"
                                    />
                                    <p>{video.snippet.title}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default YouTubeSearchBar;
