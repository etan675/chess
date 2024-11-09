import React from 'react'

const Content = ({ children }) => {
  return (
    <div className='max-w-[500px] w-full h-full m-auto'>
      {children}
    </div>
  )
}

export default Content