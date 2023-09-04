import './App.scss'
import HandCards from './components/hand-cards/HandCards'
import { Fragment, useEffect, useState } from 'react';

function App() {

  const [hands, setHands] = useState<string[]>([]);

  useEffect(() => {
    fetch('./poker-original.txt')
    .then(res => res.blob())
    .then((res) => {
        const reader = new FileReader();
        reader.readAsText(res);
        reader.onloadend = (event: ProgressEvent<FileReader>) => {
            const fileText = event?.target?.result;
            // need to transform to string to get each line
            setHands((fileText as string)?.split('\n'));
        }
    });
  }, []);

  return (
    <>
      <h1>Poker test</h1>
      {
        hands ?
          hands.map((hand, index) =>
            <Fragment key={index}>
              <h1>Hand - {index + 1}</h1>
              <HandCards hand={hand}></HandCards>
            </Fragment>
          )
        :<>No hands!</>
      }
    </>
  )
}

export default App
