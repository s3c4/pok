import { useEffect, useState, Fragment } from 'react'
import './HandCards.scss'
import CheckWinner from '../../services/checkWinner';
import { PotentialResult } from '../../interfaces/PotentialResults.interface';
import { CardAnalyse } from '../../interfaces/CardAnalyse.interface';

function HandCards({hand = ''}) {
  const [playerOne] = useState<string[]>(hand.split(' ').slice(0, 5));
  const [playerTwo] = useState<string[]>(hand.split(' ').slice(5, 10));
  const [playerOneResult, setPlayerOneResult] = useState<PotentialResult | null>(null);
  const [playerTwoResult, setPlayerTwoResult] = useState<PotentialResult | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    // preparePlayer method - analyse data and set into a specific format (cards, maxNoOfCards and suit)
    Promise.all([
      CheckWinner.preparePlayer(playerOne),
      CheckWinner.preparePlayer(playerTwo)
    ]).then((preparePlayers: CardAnalyse[]) => {
      Promise.all([
        CheckWinner.checkPlayer(preparePlayers[0].cards, preparePlayers[0].maxNoOfCards, preparePlayers[0].suit),
        CheckWinner.checkPlayer(preparePlayers[1].cards, preparePlayers[1].maxNoOfCards, preparePlayers[1].suit)
      ]).then((results: PotentialResult[]) => {
        setPlayerOneResult(results[0]);
        setPlayerTwoResult(results[1]);
        // player 1 wins
        if(results[0].power > results[1].power) {
          setWinner('1');
        }
        // player 2 wins
        if(results[0].power < results[1].power) {
          setWinner('2');
        }
        // draw
        if(results[1].power === results[0].power) {
            CheckWinner.checkHighestCard(results[1].power, preparePlayers[0].cards, preparePlayers[1].cards).then((res: string) => setWinner(res));
        }
      });
    });
  }, [playerTwo]);

  return (
    <div className="hand-cards">
      <div className='hand-player'>
        <h3>Player 1 -  {winner === '1' ? <span className="winner">winner</span> : (winner === '2' ? <span className='loser'>loser</span> : <span className='draw'>draw</span>)}</h3>
        {
          playerOne?.length > 0 ?
            playerOne.map((card, index) =>
                <Fragment key={index}>
                  <img src={'./cards/' + card + '.png'} alt={card} loading="lazy" width="90"/>
                </Fragment>
            )
          :<></>
        }
        <p><b>Result:</b> {playerOneResult?.name}</p>
      </div>
      <div className='hand-player'>
      <h3>Player 2 -  {winner === '2' ? <span className="winner">winner</span> : (winner === '1' ? <span className='loser'>loser</span> : <span className='draw'>draw</span>)}</h3>
        {
          playerTwo?.length > 0 ?
            playerTwo.map((card, index) =>
                <Fragment key={index}>
                  <img src={'./cards/' + card + '.png'} alt={card} loading="lazy" width="90"/>
                </Fragment>
            )
          :<></>
        }
        <p><b>Result:</b> {playerTwoResult?.name}</p>
      </div>
    </div>
  )
}

export default HandCards
