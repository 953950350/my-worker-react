import React, { useState, useEffect } from 'react'


export default function TestComponent(props: any) {
//     const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      props.onValueChange({
          a: 123
      })
    }, 1000)
  }, [])
    return (
        <div>
            {props.count}
            TestComponent
        </div>
    )
}