import React from 'react';

const MarqueeBanner = () => {
  return (
    <div className="
        fixed top-16 left-0 right-0 z-40
        h-9
        bg-(--color-banner)
        overflow-hidden
        flex items-center
        whitespace-nowrap
      ">

      <span className="
          inline-block
          animate-marquee
          font-nunito text-[13.5px] font-bold
          text-(--color-text-muted)
        ">

        ‖ WELCOME TO Sonu Book GROUP ‖     
        Jo Group bets Karte he unke Profit ke Saude hataye jayenge
             ‖ WELCOME TO NICE BSF GROUP ‖     
        Jo Group bets Karte he unke Profit ke Saude hataye jayenge
             

      </span>

    </div>
  );
};

export default MarqueeBanner;