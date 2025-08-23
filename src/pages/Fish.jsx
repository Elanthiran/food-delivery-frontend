import React from 'react'
import Card from './Card'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'



const Fish = ({data}) => {
  const {totalQuantity} =useSelector((state) => state.cart)
  const fish=data.filter((item)=>item.domain==="fish")
  return (
    <div className='container-fluid px-2'>
      <div  className="row d-flex py-5">
        {
          fish.map((item,index)=>
          {
            return(
              <Card item={item} key={index} />
            )
          })
        }
     
      </div>
   {totalQuantity > 0 && (
                    <Link
                      to="/cart"
                      className="btn btn-warning position-fixed bottom-0 start-50 translate-middle-x mb-3 px-4 shadow"
                      style={{ zIndex: 1050 }}
                    >
                      🛒 {totalQuantity} item(s)
                    </Link>
                  )}
    </div>
  )
}

export default Fish