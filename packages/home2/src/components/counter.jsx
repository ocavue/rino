import React, { useState } from "react"

function Counter() {
    const [count, setCount] = useState(1)
    const addCount = () => setCount(count + 1)

    return <button onClick={addCount}>{count} +1 </button>
}

Counter.viteHOOKS = 1234

export default Counter
