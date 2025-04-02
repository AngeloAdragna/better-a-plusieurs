import React, { useState } from "react";

function PlaylistContent() {
    const [isSelected, setisSelected] = useState(true);
    const handleLinkClick = () => {
        setisSelected((prev) => !prev);
    };

    return (
        <section className='PlaylistContent'>
            <div className="SelectionBar">
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'down' : 'up'}`}>History</span>
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'up' : 'down'}`}>Playlist</span>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? 'desactived' : ''}`}>
                Les vidéos dans la playlist
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? '' : 'desactived'}`}>
                Les vidéos dans l'historique
            </div>
        </section>
    );
}

export default PlaylistContent;
