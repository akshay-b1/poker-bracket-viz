import React, { useState } from "react";
import { PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";

const CardShuffleAnimation = () => {
  return (
    <div className="flex justify-center items-center h-8 my-1">
      <div className="relative w-24 h-8">
        {["♠", "♥", "♦", "♣"].map((suit, i) => (
          <div
            key={i}
            className="absolute w-6 h-8 bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center text-lg"
            style={{
              left: `${i * 6}px`,
              zIndex: i,
              animation: `shuffle-${i} 0.8s infinite ease-in-out`,
              color: i % 2 === 0 ? "#1a1a1a" : "#e53e3e",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
            transform: translateY(-10px) rotate(-3deg);
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
          30% {
            transform: translateY(-7px) rotate(3deg);
          }
          60% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes shuffle-2 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          35% {
            transform: translateY(-9px) rotate(-2deg);
          }
          65% {
            transform: translateY(-4px) rotate(2deg);
          }
        }
        @keyframes shuffle-3 {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          40% {
            transform: translateY(-8px) rotate(3deg);
          }
          70% {
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
      className="bg-emerald-900 text-white min-h-screen p-8 font-sans overflow-x-auto"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(16, 85, 60, 0.7) 0%, rgba(6, 40, 30, 0.95) 100%)",
      }}
    >
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide">
        <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
          Build4Good PokerBot Challenge
        </span>
      </h1>

      <div className="flex space-x-20 relative items-start px-6">
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
              <div className="text-center mb-6 font-medium">
                <span className="px-4 py-1.5 rounded-full bg-emerald-800/50 text-yellow-300 text-sm uppercase tracking-wider backdrop-blur-sm border border-emerald-700/30">
                  {roundIndex === 0
                    ? "First Round"
                    : roundIndex === data.rounds.length - 1
                    ? "Finals"
                    : `Round ${roundIndex + 1}`}
                </span>
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
                        <div className="absolute -top-1.5 -right-1.5 w-7 h-7 text-xs font-bold bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          ♠
                        </div>

                        {[matchup.team1, matchup.team2].map((team, i) => (
                          <div
                            key={i}
                            className={`flex justify-between items-center px-3 py-2 my-1.5 rounded-lg border transition-all duration-300 ${
                              isPlayed && i === matchup.winner
                                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 text-gray-800 font-medium shadow-inner"
                                : "border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-sm">
                              <span
                                className={`font-bold mr-1.5 ${
                                  isPlayed && i === matchup.winner
                                    ? "text-red-600"
                                    : "text-red-500"
                                }`}
                              >
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
                          <div className="flex justify-center mt-3.5">
                            {isAnimating ? (
                              <div className="h-8 flex items-center justify-center">
                                <CardShuffleAnimation />
                                <div className="text-xs text-gray-600 ml-2 animate-pulse font-medium">
                                  Dealing...
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handlePlay(roundIndex, matchupIndex)
                                }
                                className="text-sm bg-gradient-to-b from-red-600 to-red-700 text-white px-5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-red-900/20 hover:from-red-700 hover:to-red-800 transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white border-4 border-yellow-500 rounded-2xl p-10 max-w-md text-center shadow-2xl relative"
            style={{
              backgroundImage:
                "radial-gradient(circle at top, #ffffff, #f9fafb)",
              animation:
                "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
          >
            <style jsx>{`
              @keyframes popIn {
                0% {
                  transform: scale(0.9);
                  opacity: 0;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              @keyframes float {
                0%,
                100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-10px);
                }
              }
              .floating-suit {
                animation: float 3s ease-in-out infinite;
              }
            `}</style>

            <div
              className="absolute -top-7 -right-7 bg-gradient-to-br from-red-500 to-red-700 rounded-full p-4 w-14 h-14 flex items-center justify-center border-2 border-white shadow-xl floating-suit"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="text-white text-xl">♠</span>
            </div>
            <div className="absolute -top-7 -left-7 bg-black rounded-full p-4 w-14 h-14 flex items-center justify-center border-2 border-white shadow-xl floating-suit">
              <span className="text-white text-xl">♣</span>
            </div>

            <button
              onClick={closeWinnerPopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
              WINNER!
            </h2>

            <div className="bg-gradient-to-b from-emerald-700 to-emerald-800 rounded-xl p-8 mb-6 border-2 border-yellow-500 text-white shadow-lg">
              <div className="mb-1 text-yellow-300 text-sm font-medium uppercase tracking-wider">
                Champion
              </div>
              <p className="text-3xl font-bold mb-2">
                <span className="text-yellow-400 mr-2">{winnerPopup.seed}</span>
                {winnerPopup.name}
              </p>
              <div className="text-yellow-300 mt-3 text-lg font-medium">
                Takes the pot!
              </div>
              <div className="flex justify-center mt-4 space-x-4">
                {["♠", "♥", "♦", "♣"].map((suit, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i % 2 === 0 ? "text-white" : "text-red-300"
                    } floating-suit`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {suit}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={closeWinnerPopup}
              className="mt-4 bg-gradient-to-b from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
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
