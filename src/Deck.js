import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const Deck = () => {
  const INITIAL_DECK = [{
    id: '00',
    cardUrl: "https://deckofcardsapi.com/static/img/back.png",
    remaining: 52

  }]
  const [cards, setCards] = useState(INITIAL_DECK);
  const [lastCard, setLastCard] = useState(false);
  const [deckId, setDeckId] = useState(null);
  const [loading, setLoading] = useState(false);
  /** Draws the next card from the deck */

  const handleDrawBtn = async () => {
    try {

        const cardRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const newCard = {
          id: cardRes.data.cards[0].code,
          cardUrl: cardRes.data.cards[0].images.png,
          remaining: cardRes.data.remaining
        }
        if(newCard.remaining === 0)
          setLastCard(true);
        setCards(currentCards => [...currentCards, newCard]);
      }
      catch (err) {
        console.log(err);
      }
  }

  /** Shuffles the deck and restarts the draw */
  const handleRestartBtn = async () => {
    try {
      setLoading(true);
      await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      setCards(INITIAL_DECK);
      setLastCard(false);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  }

  /** This is called after component first added to DOM and creates the deck */

  useEffect(function fetchDeckWhenMounted(){
    async function fetchDeck() {
      try {
      const deckRes = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
      setDeckId(deckRes.data.deck_id)
      }
      catch (err) {
        console.log(err);
      }
    }
    fetchDeck();
  },[]);

  return (
    <div className='container'>
      <div className="menu-btns">
        <button onClick={lastCard ? null : handleDrawBtn}>Draw Card</button>
        <button onClick={handleRestartBtn} disabled={loading}>Restart</button>
      </div>
      <div className='card-stack'>
        {lastCard ? <p>“Error: no cards remaining!”</p> : null}
        {cards.map((card, index) => (
          <Card key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Deck;
