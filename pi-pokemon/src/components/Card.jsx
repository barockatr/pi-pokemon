import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Card = ({ id, name, image, types }) => {
  return (
    <div className="card">
      <Link to={`/detail/${id}`}>
        <h3>{name}</h3>
        <img src={image} alt={name} width="200px" height="250px" />
        <div className="types">
          {types?.map((type, index) => (
            <span key={index}>{type} </span>
          ))}
        </div>
      </Link>
    </div>
  );
};

export default Card;
