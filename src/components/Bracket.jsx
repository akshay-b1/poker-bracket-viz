import React, { useState } from "react";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";

const CardShuffleAnimation = () => {
  return (
    <div className="flex justify-center items-center h-8 my-1">
      <div className="relative w-24 h-8">
        {["♠", "♥", "♦", "♣"].map((suit, i) => (
          <div
            key={i}
            className="absolute w-6 h-8 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center text-lg"
            style={{
              left: `${i * 6}px`,
              zIndex: i,
              animation: `shuffle-${i} 0.7s infinite`,
              color: i % 2 === 0 ? "black" : "red",
            }}
          >
            {suit}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes shuffle-0 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes shuffle-1 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes shuffle-2 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-5deg);
          }
          75% {
            transform: translateY(-5px) rotate(5deg);
          }
        }
        @keyframes shuffle-3 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(5deg);
          }
          75% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

const Bracket = ({ data }) => {
  const [played, setPlayed] = useState({});
  const [animating, setAnimating] = useState({});
  const [winnerPopup, setWinnerPopup] = useState(null);

  const handlePlay = (roundIndex, matchupIndex) => {
    const key = `${roundIndex}-${matchupIndex}`;
    setAnimating((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAnimating((prev) => ({ ...prev, [key]: false }));
      setPlayed((prev) => ({ ...prev, [key]: true }));

      // Check if this was the final matchup
      const isFinalRound = roundIndex === data.rounds.length - 1;
      const isFinalMatchup = isFinalRound && matchupIndex === 0; // Assuming final round has one matchup

      if (isFinalMatchup) {
        const matchup = data.rounds[roundIndex].matchups[matchupIndex];
        const winnerTeam = matchup.winner === 0 ? matchup.team1 : matchup.team2;
        setWinnerPopup(winnerTeam);
      }
    }, 2000);
  };

  const closeWinnerPopup = () => {
    setWinnerPopup(null);
  };

  const roundReady = (roundIndex) => {
    if (roundIndex === 0) return true;
    const prev = data.rounds[roundIndex - 1];
    return prev.matchups.every((_, i) => played[`${roundIndex - 1}-${i}`]);
  };

  const cardHeight = 60;
  const verticalSpacing = 40;

  // Add additional vertical offset for rounds after the first
  const getRoundOffset = (roundIndex) => {
    if (roundIndex === 0) return 0;
    if (roundIndex === 1) return 40; // Second round offset
    if (roundIndex === 2) return 100; // Third round offset
    return 160 * (roundIndex - 2); // Later rounds get even more offset
  };

  return (
    <div
      className="bg-emerald-800 text-white min-h-screen p-6 font-serif overflow-x-auto"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 80, 40, 0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 80, 40, 0.7) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <h1 className="text-4xl font-bold mb-6 text-yellow-400 text-center tracking-wider">
        Build4Good PokerBot Challenge
      </h1>

      <div className="flex space-x-16 relative items-start">
        {data.rounds.map((round, roundIndex) => {
          const showRound = roundReady(roundIndex);
          const matchHeight =
            cardHeight + verticalSpacing * Math.pow(2, roundIndex);
          const roundOffset = getRoundOffset(roundIndex);

          return (
            <div
              key={roundIndex}
              className="relative flex flex-col"
              style={{ marginTop: `${roundIndex == 0 ? 0 : roundOffset}`, left: `${roundIndex * 100}px` }}
            >
              <div className="text-center mb-4 text-yellow-300 font-bold">
                {roundIndex === 0
                  ? "First Round"
                  : roundIndex === data.rounds.length - 1
                  ? "Finals"
                  : `Round ${roundIndex + 1}`}
              </div>
              {showRound &&
  round.matchups.map((matchup, matchupIndex) => {
    const key = `${roundIndex}-${matchupIndex}`;
    const isPlayed = played[key];
    const isAnimating = animating[key];

    // matchHeight increases each round to create vertical gaps
    const matchHeight = cardHeight + verticalSpacing * Math.pow(2, roundIndex);

    // For matchup positioning
    let topMargin;

    if (roundIndex === 0) {
      // First round — even spacing
      topMargin = matchupIndex === 0 ? 0 : cardHeight + verticalSpacing;
    } else {
      // Later rounds — center between the two source matchups
      const stepSize = (cardHeight + verticalSpacing) * Math.pow(2, roundIndex);
      topMargin = stepSize * matchupIndex + stepSize / 2 - cardHeight / 2;
    }
    
    

    return (
      <div
  key={matchupIndex}
  className={`${roundIndex === 0 ? "relative" : "absolute"}`}
  style={{
    top: `${roundIndex === 0 ? 0 : (cardHeight + verticalSpacing) * (matchupIndex * Math.pow(2, roundIndex)) + (cardHeight + verticalSpacing) * (Math.pow(2, roundIndex - 1) - 0.5) - (roundIndex * roundIndex * 30)}px`,
  }}
>

        <div
          className={`bg-white border-2 ${
            isAnimating ? "border-yellow-400" : "border-gray-800"
          } rounded-lg p-3 w-52 shadow-lg transition-all duration-500 relative`}
          style={{
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          }}
        >

                        <div className="absolute -top-1 -left-1 w-6 h-6 text-xs font-bold bg-red-600 text-white rounded-full flex items-center justify-center border border-white">
                          {matchupIndex + 1}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 text-xs font-bold bg-black text-white rounded-full flex items-center justify-center border border-white">
                          ♠
                        </div>

                        {[matchup.team1, matchup.team2].map((team, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center px-2 py-1 my-1 rounded-md border ${
                              isPlayed && i === matchup.winner
                                ? "bg-yellow-100 border-yellow-500 text-black font-bold"
                                : "border-gray-300 text-gray-800"
                            }`}
                          >
                            <span className="text-sm">
                              <span className="font-bold mr-1 text-red-600">
                                {team.seed}
                              </span>
                              {team.name} 
                            </span>
                            {isPlayed && i === matchup.winner && (
                              <span className="text-yellow-600 font-bold text-sm">
                                {team?.money} ♦ 
                              </span>
                            )}
                          </div>
                        ))}

                        {!isPlayed && (
                          <div className="flex justify-center mt-3">
                            {isAnimating ? (
                              <div className="h-8 flex items-center justify-center">
                                <CardShuffleAnimation />
                                <div className="text-xs text-gray-600 ml-2 animate-pulse">
                                  Dealing...
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handlePlay(roundIndex, matchupIndex)
                                }
                                className="text-sm bg-red-700 text-white px-4 py-1 rounded-md hover:bg-red-800 flex items-center gap-1 shadow-md"
                              >
                                <PlayIcon className="w-4 h-4" />
                                Deal
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* Winner Popup */}
      {winnerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            className="bg-white border-4 border-yellow-500 rounded-lg p-8 max-w-md text-center shadow-2xl relative"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff, #f8f8f8)",
            }}
          >
            <div className="absolute -top-6 -right-6 bg-red-600 rounded-full p-4 w-12 h-12 flex items-center justify-center border-2 border-white">
              <span className="text-white text-lg">♠</span>
            </div>
            <div className="absolute -top-6 -left-6 bg-black rounded-full p-4 w-12 h-12 flex items-center justify-center border-2 border-white">
              <span className="text-white text-lg">♣</span>
            </div>
            <button
              onClick={closeWinnerPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-5 text-red-700">WINNER!</h2>
            <div className="bg-emerald-800 rounded-lg p-6 mb-4 border-2 border-yellow-500 text-white">
              <p className="text-2xl font-bold">
                {winnerPopup.seed} {winnerPopup.name}
              </p>
              <div className="text-yellow-400 mt-2 text-lg">Takes the pot!</div>
              <div className="flex justify-center mt-3 space-x-2">
                {["♠", "♥", "♦", "♣"].map((suit, i) => (
                  <span
                    key={i}
                    className={i % 2 === 0 ? "text-white" : "text-red-400"}
                  >
                    {suit}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={closeWinnerPopup}
              className="mt-4 bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 font-bold shadow-lg"
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bracket;
