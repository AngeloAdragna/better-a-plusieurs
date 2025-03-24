import React, { useState } from "react";
import "../styles/PlaylistContent.css";

function PlaylistContent() {
      // Collapse the unselected content
          const [isSelected, setisSelected] = useState(true);
          const handleLinkClick = () => {
              setisSelected((prev) => !prev);
          };
    return (
        <section className='PlaylistContent'>
            <div className="SelectionBar">
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'down' : 'up'}`}>
                    History
                </span>
                <span onClick={handleLinkClick} className={`button ${isSelected ? 'up' : 'down'}`}>
                    Playlist
                </span>
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? 'desactived' : ''}`}>
                Les videos qui sont dans la playlist
            </div>
            <div className={`ContentPlaylistHistory ${isSelected ? '' : 'desactived'}`}>
                Les videos qui sont dans l'history
            </div>
        </section>
    );
}

export default PlaylistContent;

