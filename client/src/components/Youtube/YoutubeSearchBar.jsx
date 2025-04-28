import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import M from "materialize-css";
import debounce from 'lodash.debounce';

const YouTubeSearchBar = ({roomId, socket}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isFormSubmitted, setIsFormSubmitted] = useState(false)

    // Clé d'API à utiliser pour pouvoir utiliser l'API de youtube
    const API_KEY = 'AIzaSyDfs_OdXymNYGXGcCHU8T1iu_w6Iz1CzKg';

    function decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

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
                        maxResults: 20,      // Maximum 20 Résulats renvoyés
                        type: 'video',
                    },
                }
            );

            // Décodage html des titres pour pouvoir les afficher correctement
            const decodedResults = response.data.items.map(video => ({
                ...video,
                snippet: {
                    ...video.snippet,
                    title: decodeHtmlEntities(video.snippet.title),
                }
            }));

            setIsFormSubmitted(true);
            setResults(decodedResults);
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        }
    };

    // Fonction de parsing pour la réponse de l'API de suggestion
    // L'api renvoie un string au lieu d'un JSON
    // Il faut donc la parser pour pouvoir l'exploiter
    const parseGoogleSuggestResponse = (responseString) => {
        try {
            // Extraire le contenu entre les parenthèses de "window.google.ac.h(...)"
            const match = responseString.match(/window\.google\.ac\.h\((.*)\)/);

            if (!match || match.length < 2) return [];

            const rawData = JSON.parse(match[1]);

            // Renvoyer uniquement la recommandation textuelle et pas les stat associées
            const suggestions = rawData[1].map(item => item[0]);
            return suggestions;
        } catch (err) {
            console.error("Erreur lors du parsing des suggestions :", err);
            return [];
        }
    };

    // Requête vers le serveur pour récupérer les suggestions
    // L'API interdit de lancer des requêtes depuis le front
    const fetchSuggestions = async (query) => {
        if (!query) return;

        try {
            // On effectue la requête
            const res = await axios.get(`http://localhost:8080/suggest?q=${encodeURIComponent(query)}`);
            // On parse la réponse pour avoir quelque chose d'exploitable
            const suggestions = parseGoogleSuggestResponse(res.data);
            // On actualise les suggestions
            setSuggestions(suggestions);
        } catch (err) {
            console.error("Erreur lors de la récupération des suggestions :", err);
        }
    };

    // AJOUT D'UN DEBOUNCE POUR EVITER DE SURCHARGER LE SERVEUR

    // on mémorise le debounce pour éviter de le recréer à chaque rendu
    const debouncedFetch = useCallback(
        debounce(fetchSuggestions, 300),
        [] // vide pour garder la même instance
    );

    const handleInputChange = (e) => {
        const query = e.target.value;
        fetchSuggestions(query)
        debouncedFetch(query); // appelle la version debounce
    };


    const handleSelectVideo = (video, roomId, socket) => {
        // Emission d'une requête au serveur pour indiquer qu'on souhaite changer de vidéo
        //console.log(socket)   // DEBUG
        socket.emit("selectVideo", {roomId: roomId, video: video})
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

    const openResultsModalManually = () => {
        const modal = document.querySelector('.modal');
        const instance = M.Modal.getInstance(modal);
        instance.open();
    }

    // Fonction pour ajouter une vidéo à la playlist
    const handleAddVideoToPlaylist = (video) => {
        //Todo verif structure lien bien vid
        socket.emit("videoAddedPlaylist", { roomId, video });  // Envoie la vidéo au serveur
    };

    return (
        <div className="container">
            <form onSubmit={handleSearch} className="center-align">
                <div className="row valign-wrapper">
                    <div className="input-field col s10 text-suggestions-wrapper">
                        <input
                            type="text"
                            placeholder="Rechercher sur YouTube..."
                            value={query}
                            onChange={(e) => {
                                const value = e.target.value
                                setQuery(value);
                                handleInputChange(e);  // à chaque changement, on actualise les suggestions
                            }
                            }
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Délai pour laisser le temps de cliquer sur une suggestion
                        />

                        {showSuggestions && suggestions.length > 0 && ( // Si le focus est sur la barre de recherche et qu'il y a au moins 1 suggestion, on affiche la liste de suggestions
                            <ul id="text-suggestions" className="collection z-depth-1">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="collection-item"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            setQuery(suggestion);             // Actualiser la valeur de l'input
                                            setSuggestions([])          // Fermer les suggestions après sélection
                                        }}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="col s2">
                        <button className="btn green" type="submit" style={{ padding: '0 12px' }}>
                            🔍
                        </button>
                        {isFormSubmitted && (
                            <button className="btn green" style={{ padding: '0 12px' }} onClick={openResultsModalManually}>
                                ⬇️
                            </button>)
                        }
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
                                <div>
                                    <div className="video-result row">
                                        <div
                                            key={video.id.videoId}
                                            onClick={() => handleSelectVideo({ title: video.snippet.title, thumbnail: video.snippet.thumbnails.medium.url, id: video.id.videoId }, roomId, socket)}
                                            className="modal-close col">
                                            <img
                                                src={video.snippet.thumbnails.medium.url}
                                                alt="thumbnail"
                                                className="col"
                                            />
                                            <p>{video.snippet.title}</p>
                                        </div>
                                        <button className="add-to-playlist" onClick={() => handleAddVideoToPlaylist({ title: video.snippet.title, thumbnail: video.snippet.thumbnails.medium.url, id: video.id.videoId })}>
                                            Ajouter à la playlist
                                        </button>
                                    </div>
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
