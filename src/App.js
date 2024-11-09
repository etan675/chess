import React from 'react'
import Content from './components/Content'
import Game from './components/Game'

const App = () => {

  return (
    <div className='w-screen h-screen bg-slate-600'>
      <Content>
        <Game />
      </Content>
    </div>
  )
}

export default App