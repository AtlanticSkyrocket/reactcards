import React from 'react';

const Card = ({card, index}) => {
  return (
     <>
      <img src={card.cardUrl} alt={`Card ${index}`}></img>
    </>
  )
}

export default Card;