import React, { useState } from 'react'

import HeroSection from './components/HeroSection'

function App() {

  return (
    <div>
     <HeroSection />

      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <h1 className="text-4xl text-pink-600 font-bold">
        Tailwind está funcionando! 🎉
      </h1>
    </div>
    </div>
   
  )
}

export default App
