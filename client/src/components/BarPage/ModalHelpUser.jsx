import { useEffect } from "react";
import M from "materialize-css";
import { FaCogs } from "react-icons/fa";
import { GoShareAndroid } from "react-icons/go";
import { BsPatchQuestion } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import { FaArrowCircleDown } from "react-icons/fa";

const ModalHelpUser = () => {
  // Initialize the modal
  useEffect(() => {
    const elem = document.getElementById("ModalHelpUser");
    if (elem) {
      M.Modal.init(elem);
    }
  }, []);

 
  return (
    <div id="ModalHelpUser" className="modal">
      <div className="modal-content">
        <h5>Aide pour l'utilisateur</h5>
        <p>Voici quelques conseils pour utiliser l'application <BsPatchQuestion className="icons" /></p>
        <ul>
          <li>Assurez-vous d'avoir une connexion Internet stable pour profiter pleinement de l'application.</li>
          <li>Le propriétaire de la room peut modifier les paramètres de la room depuis  <FaCogs className="icons" />.</li>
          <li>Vous pouvez partager votre salle avec d'autres utilisateurs en cliquant sur <GoShareAndroid className="icons" />.</li>
          <li>Effectez une recherche depuis la barre en cliquant sur <IoSearchSharp className="icons" />vous pourrez lancer la video ou bien l'ajouter à la playlist.</li>
          <li>Afin de rétrouver la dernière suggestion de vidéos recherchées, cliquez sur <FaArrowCircleDown className="icons" />. </li>
        </ul>
      </div>
    </div>
  );
};

export default ModalHelpUser;
