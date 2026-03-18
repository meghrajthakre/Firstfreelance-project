import React from 'react'

const Live = () => {
  return (

    <div className="px-5 mt-[120px]">

      <div className="flex gap-4 mb-6">

        <button className="bg-white px-6 py-2 rounded shadow">
          CRICKET
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          FOOTBALL
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          TENNIS
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          KABADDI
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          ELECTIONS
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          TOURNAMENT
        </button>

      </div>

      <div className="bg-white p-6 rounded shadow flex justify-between">

        <div>

          <h3 className="font-bold">
            KARACHI REGION WHITES V ABBOTTABAD REGION
          </h3>

          <p>Final</p>

          <p>Match Bets : 0</p>

          <p>Session Bets : 0</p>

        </div>

        <div className="bg-blue-700 text-white p-6 rounded">

          <p>18</p>

          <p>March</p>

          <p>08:30 PM</p>

        </div>

      </div>

    </div>

  )
}

export default Live
